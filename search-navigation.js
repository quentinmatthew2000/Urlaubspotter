/* ============================================================
   search-navigation.js — geïsoleerde homepage zoek-component.
   Rendert een ingeklapte zoekbalk + categorie-tabs onder de
   header, en opent een fullscreen modal met Wie / Wat / Waar /
   Wanneer. Multi-select chips voor Wie en Wat, zoekveld +
   bestemmingenlijst voor Waar (met directe navigatie naar Level
   1 landings), date-range picker voor Wanneer.

   Usage:
       <div id="hero-searchbar"></div>
       <script src="search-navigation.js"></script>
       <script>renderSearchNavigation('hero-searchbar');</script>
   ============================================================ */

(function () {
    "use strict";

    // ---- CATEGORIEEN ---------------------------------------------------
    // De bar-tabs op de homepage navigeren direct naar de Level 1 landing
    // van die categorie. In de modal wisselen ze de "Wat?"-opties.
    // Bar-tabs landen rechtstreeks op de Niveau 2 — Wat pagina met de
    // bijbehorende `what`-filter al actief. Daar staat de WIE-keuze
    // open en is WAAR beschikbaar — gebruikers landen dus direct in
    // de juiste gefilterde context.
    const CATEGORIES = [
        { value: "hotels",         label: "Resorts & Hotels", emoji: "🏨", href: "Niveau2-Wat.html?what=hotel" },
        { value: "campings",       label: "Campings",         emoji: "🏕️", href: "Niveau2-Wat.html?what=camping" },
        { value: "vakantieparken", label: "Vakantieparken",   emoji: "🏡", href: "Niveau2-Wat.html?what=holiday-park" },
    ];

    // Categorie-tab → primaire `type`-waarde voor het filter op
    // /accommodaties. Sluit aan op de 'what'-keys in site-data.js.
    const CATEGORY_TYPE_MAP = {
        hotels: "hotel",
        campings: "camping",
        vakantieparken: "holiday-park",
    };

    // Vertaling van Wie-chip-values naar de doelgroep-keys die de
    // resultatenpagina kent (zelfde als SITE_DATA.labels.who).
    const WHO_TO_DATA = {
        volwassenen: null,
        vrienden:    "friends",
        alleen:      "solo",
        gezinnen:    "families-kids",
        senioren:    "seniors",
        koppels:     "couples",
        huisdieren:  "pets",
    };

    const WHO_OPTIONS = [
        { value: "volwassenen", label: "Volwassenen" },
        { value: "vrienden",    label: "Vrienden" },
        { value: "alleen",      label: "Alleen" },
        { value: "gezinnen",    label: "Gezinnen" },
        { value: "senioren",    label: "Senioren" },
        { value: "koppels",     label: "Koppels" },
        { value: "huisdieren",  label: "Met huisdieren" },
    ];

    // "Wat?" is afhankelijk van de actieve categorie-tab.
    const WHAT_BY_CATEGORY = {
        hotels: [
            { value: "alle-hotels",   label: "Alle hotels" },
            { value: "boutique",      label: "Boutique Hotels" },
            { value: "wellness",      label: "Wellness hotels" },
            { value: "all-inclusive", label: "All-inclusive hotels" },
            { value: "adult-only",    label: "Adult Only hotels" },
        ],
        campings: [
            { value: "alle-campings",  label: "Alle campings" },
            { value: "glampings",      label: "Glampings" },
            { value: "aquapark",       label: "Campings met Aquapark" },
            { value: "natuur",         label: "Camping in de natuur" },
            { value: "kindercampings", label: "Kindercampings" },
            { value: "honden",         label: "Hondvriendelijke campings" },
            { value: "aan-zee",        label: "Campings aan zee" },
        ],
        vakantieparken: [
            { value: "alle-parken",  label: "Alle vakantieparken" },
            { value: "attractiepark", label: "Met attractiepark" },
            { value: "zwemparadijs", label: "Met zwemparadijs" },
            { value: "themaparken",  label: "Themaparken" },
        ],
    };

    // Bestemmingen mappen op Level 1 landing pages (per land).
    // "In de buurt" heeft geen landing — selecteren slaat het op zonder
    // direct te navigeren, gebruiker kan daarna "Zoeken" gebruiken.
    // `land` is de slug die op /accommodaties als ?land= filter gebruikt
    // wordt en is ook de pad-segment voor de Level 1 country landing.
    const WHERE_SUGGESTIONS = [
        { value: "near",       title: "In de buurt",                 sub: "Rondkijken in je omgeving",                                 icon: "🧭",  land: null },
        { value: "parijs",     title: "Parijs, Frankrijk",           sub: "Voor bezienswaardigheden zoals Eiffeltoren",                icon: "🗼",  land: "frankrijk" },
        { value: "londen",     title: "Londen, Verenigd Koninkrijk", sub: "Voor het bruisende nachtleven",                             icon: "🌉",  land: "verenigd-koninkrijk" },
        { value: "maastricht", title: "Maastricht, Limburg",         sub: "Populaire bestemming",                                      icon: "🏙️", land: "nederland" },
        { value: "antwerpen",  title: "Antwerpen, België",           sub: "Voor bezienswaardigheden zoals MAS - Museum aan de Stroom", icon: "🏛️", land: "belgie" },
        { value: "valencia",   title: "Valencia, Spanje",            sub: "Voor de verbluffende architectuur",                         icon: "🏟️", land: "spanje" },
    ];

    // -------- State --------
    function createState() {
        return {
            category: "hotels",
            whoSelection: [],
            whatSelection: [],
            whereQuery: "",
            whereExpanded: false,
            whereSelected: null,
            dateRange: { start: "", end: "" },
            activeSection: null,  // null = alles ingeklapt; anders "who"|"what"|"where"|"when"
            modalOpen: false,
        };
    }

    // -------- Helpers --------
    function el(html) {
        const tpl = document.createElement("template");
        tpl.innerHTML = html.trim();
        return tpl.content.firstElementChild;
    }

    function toggleInArray(arr, value) {
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        return arr;
    }

    function labelsFor(values, options) {
        return values
            .map(v => options.find(o => o.value === v)?.label)
            .filter(Boolean)
            .join(", ");
    }

    function escapeAttr(s) {
        return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // -------- Tab templates --------
    // Bar tabs zijn anchor-links: klikken → navigeer naar landing page.
    function barTabsHTML(activeCategory) {
        return CATEGORIES.map(cat => `
            <a class="sn-tab${cat.value === activeCategory ? " active" : ""}"
               href="${cat.href}"
               data-sn-bar-tab="${cat.value}">
                <span class="sn-tab-emoji" aria-hidden="true">${cat.emoji}</span>
                <span class="sn-tab-label">${cat.label}</span>
            </a>
        `).join("");
    }

    // Modal tabs zijn buttons: klikken → wissel "Wat?" opties (geen nav).
    function modalTabsHTML(activeCategory) {
        return CATEGORIES.map(cat => `
            <button type="button"
                    class="sn-tab${cat.value === activeCategory ? " active" : ""}"
                    data-sn-modal-tab="${cat.value}">
                <span class="sn-tab-emoji" aria-hidden="true">${cat.emoji}</span>
                <span class="sn-tab-label">${cat.label}</span>
            </button>
        `).join("");
    }

    function collapsedBarHTML(state) {
        return `
            <div class="sn-bar-wrap">
                <button type="button" class="sn-bar" data-sn-open aria-haspopup="dialog">
                    <svg class="sn-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span class="sn-bar-text">Begin je zoektocht</span>
                </button>
                <div class="sn-tabs" role="tablist">
                    ${barTabsHTML(state.category)}
                </div>
            </div>
        `;
    }

    // -------- Section templates --------
    // Elke sectie rendert collapsed (rij + huidige waarde) of expanded
    // (titelknop om in te klappen + invoercontrols).
    function expandedHeaderHTML(section, title) {
        return `
            <button type="button" class="sn-card-header" data-sn-toggle-section="${section}" aria-expanded="true">
                <h2 class="sn-card-title">${title}</h2>
                <span class="sn-card-chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                </span>
            </button>
        `;
    }

    function whoSectionHTML(state) {
        if (state.activeSection !== "who") {
            const value = state.whoSelection.length
                ? labelsFor(state.whoSelection, WHO_OPTIONS)
                : "Voeg gezelschap toe";
            return `
                <div class="sn-card collapsed" data-sn-toggle-section="who" role="button" tabindex="0">
                    <span class="sn-card-label">Wie</span>
                    <span class="sn-card-value" data-empty="${state.whoSelection.length === 0}">${value}</span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                ${expandedHeaderHTML("who", "Wie?")}
                <div class="sn-chip-grid">
                    ${WHO_OPTIONS.map(opt => `
                        <button type="button"
                                class="sn-chip${state.whoSelection.includes(opt.value) ? " active" : ""}"
                                data-sn-who="${opt.value}"
                                aria-pressed="${state.whoSelection.includes(opt.value)}">${opt.label}</button>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function whatSectionHTML(state) {
        const opts = WHAT_BY_CATEGORY[state.category] || [];
        if (state.activeSection !== "what") {
            const value = state.whatSelection.length
                ? labelsFor(state.whatSelection, opts)
                : "Voeg vakantietype toe";
            return `
                <div class="sn-card collapsed" data-sn-toggle-section="what" role="button" tabindex="0">
                    <span class="sn-card-label">Wat</span>
                    <span class="sn-card-value" data-empty="${state.whatSelection.length === 0}">${value}</span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                ${expandedHeaderHTML("what", "Wat?")}
                <div class="sn-chip-grid">
                    ${opts.map(opt => `
                        <button type="button"
                                class="sn-chip${state.whatSelection.includes(opt.value) ? " active" : ""}"
                                data-sn-what="${opt.value}"
                                aria-pressed="${state.whatSelection.includes(opt.value)}">${opt.label}</button>
                    `).join("")}
                </div>
            </div>
        `;
    }

    function whereSectionHTML(state) {
        if (state.activeSection !== "where") {
            const selected = state.whereSelected
                ? WHERE_SUGGESTIONS.find(s => s.value === state.whereSelected)?.title
                : null;
            const value = selected || state.whereQuery || "Voeg bestemming toe";
            return `
                <div class="sn-card collapsed" data-sn-toggle-section="where" role="button" tabindex="0">
                    <span class="sn-card-label">Waar</span>
                    <span class="sn-card-value" data-empty="${!selected && !state.whereQuery}">${value}</span>
                </div>
            `;
        }

        // Expanded — input + suggestions. whereExpanded toggle bepaalt of we
        // alleen "In de buurt" of de volledige lijst tonen. Lijst is altijd
        // scrollbaar binnen max-height (zie CSS).
        const visible = state.whereExpanded
            ? WHERE_SUGGESTIONS
            : WHERE_SUGGESTIONS.slice(0, 1);

        const filtered = state.whereQuery
            ? WHERE_SUGGESTIONS.filter(s =>
                s.title.toLowerCase().includes(state.whereQuery.toLowerCase()))
            : visible;

        return `
            <div class="sn-card expanded">
                ${expandedHeaderHTML("where", "Waar?")}
                <div class="sn-where-input-wrap">
                    <svg class="sn-where-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text"
                           class="sn-where-input"
                           data-sn-where-input
                           placeholder="Bestemmingen zoeken"
                           value="${escapeAttr(state.whereQuery)}" />
                </div>
                <p class="sn-where-suggest-label">Voorgestelde bestemmingen</p>
                <ul class="sn-where-list">
                    ${filtered.map(s => `
                        <li class="sn-where-item${state.whereSelected === s.value ? " active" : ""}" data-sn-where="${s.value}" role="button" tabindex="0">
                            <span class="sn-where-item-icon" aria-hidden="true">${s.icon}</span>
                            <span class="sn-where-item-text">
                                <span class="sn-where-item-title">${s.title}</span>
                                <span class="sn-where-item-sub">${s.sub}</span>
                            </span>
                        </li>
                    `).join("")}
                </ul>
                ${state.whereQuery ? "" : `
                    <button type="button"
                            class="sn-where-expand${state.whereExpanded ? " is-open" : ""}"
                            data-sn-where-toggle
                            aria-label="${state.whereExpanded ? 'Toon minder bestemmingen' : 'Toon meer bestemmingen'}"
                            aria-expanded="${state.whereExpanded}">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>`}
            </div>
        `;
    }

    function whenSectionHTML(state) {
        const hasDates = state.dateRange.start || state.dateRange.end;
        if (state.activeSection !== "when") {
            const summary = hasDates
                ? `${state.dateRange.start || "…"} → ${state.dateRange.end || "…"}`
                : "Data toevoegen";
            return `
                <div class="sn-card collapsed" data-sn-toggle-section="when" role="button" tabindex="0">
                    <span class="sn-card-label">Wanneer</span>
                    <span class="sn-card-value" data-empty="${!hasDates}">${summary}</span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                ${expandedHeaderHTML("when", "Wanneer?")}
                <div class="sn-when-row">
                    <label class="sn-when-field">
                        <span class="sn-when-label">Van</span>
                        <input type="date" class="sn-when-input" data-sn-when-start value="${escapeAttr(state.dateRange.start)}" max="${escapeAttr(state.dateRange.end || '')}" />
                    </label>
                    <label class="sn-when-field">
                        <span class="sn-when-label">Tot</span>
                        <input type="date" class="sn-when-input" data-sn-when-end value="${escapeAttr(state.dateRange.end)}" min="${escapeAttr(state.dateRange.start || '')}" />
                    </label>
                </div>
            </div>
        `;
    }

    function modalHTML(state) {
        return `
            <div class="sn-modal" data-sn-modal role="dialog" aria-modal="true" aria-label="Vakantie zoeken">
                <div class="sn-modal-panel" role="document">
                    <div class="sn-modal-top">
                        <div class="sn-modal-tabs" role="tablist">
                            ${modalTabsHTML(state.category)}
                        </div>
                        <button type="button" class="sn-modal-close" data-sn-close aria-label="Sluiten">×</button>
                    </div>
                    <div class="sn-modal-body" data-sn-body>
                        ${whoSectionHTML(state)}
                        ${whatSectionHTML(state)}
                        ${whereSectionHTML(state)}
                        ${whenSectionHTML(state)}
                    </div>
                    <div class="sn-modal-footer">
                        <button type="button" class="sn-clear" data-sn-clear>Alles wissen</button>
                        <button type="button" class="sn-cta" data-sn-submit>
                            <svg class="sn-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            Zoeken
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // -------- Mount --------
    function renderSearchNavigation(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const state = createState();
        let modalEl = null;

        function renderBar() {
            container.innerHTML = collapsedBarHTML(state);
            bindBarEvents();
        }

        function ensureModal() {
            if (modalEl && document.body.contains(modalEl)) return;
            modalEl = el(modalHTML(state));
            document.body.appendChild(modalEl);
            bindModalEvents();
        }

        function renderModalBody() {
            if (!modalEl) return;
            const tabs = modalEl.querySelector(".sn-modal-tabs");
            const body = modalEl.querySelector("[data-sn-body]");
            if (tabs) tabs.innerHTML = modalTabsHTML(state.category);
            if (body) {
                body.innerHTML = `
                    ${whoSectionHTML(state)}
                    ${whatSectionHTML(state)}
                    ${whereSectionHTML(state)}
                    ${whenSectionHTML(state)}
                `;
                // Scroll de uitgeklapte sectie in beeld zodat de inhoud
                // (vooral de Waar-lijst op desktop) altijd zichtbaar is.
                if (state.activeSection) {
                    const expanded = body.querySelector(".sn-card.expanded");
                    if (expanded) {
                        // RAF zodat de browser eerst layout doet.
                        requestAnimationFrame(() => {
                            const top = expanded.offsetTop - 8;
                            body.scrollTo({ top, behavior: "smooth" });
                        });
                    }
                }
            }
            const barTabs = container.querySelector(".sn-tabs");
            if (barTabs) barTabs.innerHTML = barTabsHTML(state.category);
        }

        // iOS Safari respecteert `overflow:hidden` op <body> niet betrouwbaar.
        // We gebruiken de position:fixed-truc en herstellen de scrollpositie
        // bij sluiten zodat de gebruiker terugkomt waar hij was.
        let savedScrollY = 0;
        function lockBody() {
            savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
            document.body.style.position = "fixed";
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
            document.body.classList.add("sn-no-scroll");
        }
        function unlockBody() {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.classList.remove("sn-no-scroll");
            window.scrollTo(0, savedScrollY);
        }

        function openModal() {
            ensureModal();
            state.modalOpen = true;
            // Bij iedere opening starten we met "Wie?" open zodat de gebruiker
            // direct iets kan invullen. Selecties blijven bewaard in state.
            if (!state.activeSection) state.activeSection = "who";
            renderModalBody();
            requestAnimationFrame(() => modalEl.classList.add("open"));
            lockBody();
            document.addEventListener("keydown", onKey);
        }

        function closeModal() {
            if (!modalEl) return;
            state.modalOpen = false;
            modalEl.classList.remove("open");
            unlockBody();
            document.removeEventListener("keydown", onKey);
        }

        function onKey(e) {
            if (e.key === "Escape") closeModal();
        }

        function bindBarEvents() {
            container.querySelectorAll("[data-sn-open]").forEach(b => {
                b.addEventListener("click", openModal);
            });
            // Bar tabs zijn <a> met href — browser-navigatie regelt zich zelf.
            // Geen JS-handler nodig.
        }

        function bindModalEvents() {
            modalEl.addEventListener("click", (e) => {
                // Klik op de overlay (buiten panel) sluit de modal.
                if (e.target === modalEl) { closeModal(); return; }

                if (e.target.closest("[data-sn-close]")) { closeModal(); return; }

                const modalTab = e.target.closest("[data-sn-modal-tab]");
                if (modalTab) {
                    const next = modalTab.dataset.snModalTab;
                    if (state.category !== next) {
                        state.category = next;
                        // "Wat?"-opties verschillen per categorie — selecties wissen
                        // om niet met onbestaande values te eindigen.
                        state.whatSelection = [];
                    }
                    renderModalBody();
                    return;
                }

                const sectionToggle = e.target.closest("[data-sn-toggle-section]");
                if (sectionToggle) {
                    const section = sectionToggle.dataset.snToggleSection;
                    state.activeSection = state.activeSection === section ? null : section;
                    renderModalBody();
                    return;
                }

                const whoBtn = e.target.closest("[data-sn-who]");
                if (whoBtn) {
                    toggleInArray(state.whoSelection, whoBtn.dataset.snWho);
                    renderModalBody();
                    return;
                }

                const whatBtn = e.target.closest("[data-sn-what]");
                if (whatBtn) {
                    toggleInArray(state.whatSelection, whatBtn.dataset.snWhat);
                    renderModalBody();
                    return;
                }

                if (e.target.closest("[data-sn-where-toggle]")) {
                    state.whereExpanded = !state.whereExpanded;
                    renderModalBody();
                    const inp = modalEl.querySelector("[data-sn-where-input]");
                    if (state.whereExpanded && inp) inp.focus();
                    return;
                }

                const whereItem = e.target.closest("[data-sn-where]");
                if (whereItem) {
                    // Selecteren slaat op én klapt door naar Wanneer; de
                    // CTA "Zoeken" stuurt later alle filters mee naar
                    // /accommodaties. (Country-landings (/spanje etc.)
                    // zijn los bereikbaar — geen auto-navigate vanaf
                    // hier omdat de gebruiker mogelijk eerst nog Wie /
                    // Wat / Wanneer wil instellen.)
                    state.whereSelected = whereItem.dataset.snWhere;
                    state.whereQuery = "";
                    state.activeSection = "when";
                    renderModalBody();
                    return;
                }

                if (e.target.closest("[data-sn-clear]")) {
                    state.whoSelection = [];
                    state.whatSelection = [];
                    state.whereQuery = "";
                    state.whereSelected = null;
                    state.whereExpanded = false;
                    state.dateRange = { start: "", end: "" };
                    state.activeSection = "who";
                    renderModalBody();
                    return;
                }

                if (e.target.closest("[data-sn-submit]")) { submitSearch(); return; }
            });

            modalEl.addEventListener("input", (e) => {
                if (e.target.matches("[data-sn-where-input]")) {
                    state.whereQuery = e.target.value;
                    // Live filter op suggesties zonder de input te re-renderen
                    // (anders verliest het veld z'n focus).
                    const list = modalEl.querySelector(".sn-where-list");
                    if (list) {
                        const q = state.whereQuery.toLowerCase();
                        const filtered = q
                            ? WHERE_SUGGESTIONS.filter(s => s.title.toLowerCase().includes(q))
                            : (state.whereExpanded ? WHERE_SUGGESTIONS : WHERE_SUGGESTIONS.slice(0, 1));
                        list.innerHTML = filtered.map(s => `
                            <li class="sn-where-item${state.whereSelected === s.value ? " active" : ""}" data-sn-where="${s.value}" role="button" tabindex="0">
                                <span class="sn-where-item-icon" aria-hidden="true">${s.icon}</span>
                                <span class="sn-where-item-text">
                                    <span class="sn-where-item-title">${s.title}</span>
                                    <span class="sn-where-item-sub">${s.sub}</span>
                                </span>
                            </li>`).join("");
                    }
                    return;
                }
                if (e.target.matches("[data-sn-when-start]")) {
                    state.dateRange.start = e.target.value;
                    // Update min van de "tot" input zonder re-render zodat de
                    // gebruiker niet uit de focus klapt.
                    const endInp = modalEl.querySelector("[data-sn-when-end]");
                    if (endInp) endInp.min = state.dateRange.start || "";
                    return;
                }
                if (e.target.matches("[data-sn-when-end]")) {
                    state.dateRange.end = e.target.value;
                    const startInp = modalEl.querySelector("[data-sn-when-start]");
                    if (startInp) startInp.max = state.dateRange.end || "";
                    return;
                }
            });
        }

        function submitSearch() {
            // Bouw de querystring voor /accommodaties volgens het schema:
            //   type        — primaire what-key (afgeleid van categorie-tab)
            //   doelgroep   — CSV van Who-keys vertaald via WHO_TO_DATA
            //   land        — country-slug (bijv. spanje, frankrijk)
            //   q           — vrije zoekterm als geen suggestie gekozen
            //   van/tot     — start/end datum
            //   wat         — CSV met sub-types (informatief, voor chips)
            const params = new URLSearchParams();

            // Type leiden we af van de categorie-tab; geen filter als we
            // niet eenduidig kunnen mappen.
            const type = CATEGORY_TYPE_MAP[state.category];
            if (type) params.set("type", type);

            // Doelgroep — vertaal Wie-chips naar bestaande SITE_DATA-keys.
            const doelgroep = state.whoSelection
                .map(v => WHO_TO_DATA[v])
                .filter(Boolean);
            if (doelgroep.length) params.set("doelgroep", doelgroep.join(","));

            if (state.whatSelection.length) params.set("wat", state.whatSelection.join(","));

            // Land afleiden uit selectie → suggestie → land-slug.
            if (state.whereSelected) {
                const sugg = WHERE_SUGGESTIONS.find(s => s.value === state.whereSelected);
                if (sugg?.land) params.set("land", sugg.land);
                else if (state.whereSelected === "near") params.set("land", "in-de-buurt");
            } else if (state.whereQuery) {
                params.set("q", state.whereQuery);
            }

            if (state.dateRange.start) params.set("van", state.dateRange.start);
            if (state.dateRange.end)   params.set("tot", state.dateRange.end);

            const qs = params.toString();
            window.location.href = "accommodaties.html" + (qs ? "?" + qs : "");
        }

        renderBar();
    }

    window.renderSearchNavigation = renderSearchNavigation;
})();
