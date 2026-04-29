/* ============================================================
   search-navigation.js — geïsoleerde homepage zoek-component.
   Rendert een ingeklapte zoekbalk + categorie-tabs onder de
   header, en opent een fullscreen modal met Wie / Wat / Waar /
   Wanneer (multi-select chips voor Wie en Wat, zoekveld +
   bestemmingenlijst voor Waar, datepicker voor Wanneer).

   Usage:
       <div id="hero-searchbar"></div>
       <script src="search-navigation.js"></script>
       <script>renderSearchNavigation('hero-searchbar');</script>
   ============================================================ */

(function () {
    "use strict";

    const WHO_OPTIONS = [
        { value: "volwassenen", label: "Volwassenen" },
        { value: "vrienden",    label: "Vrienden" },
        { value: "alleen",      label: "Alleen" },
        { value: "gezinnen",    label: "Gezinnen" },
        { value: "senioren",    label: "Senioren" },
        { value: "koppels",     label: "Koppels" },
        { value: "huisdieren",  label: "Met huisdieren" },
    ];

    const WHAT_OPTIONS = [
        { value: "hotel",          label: "Hotel" },
        { value: "camping",        label: "Camping" },
        { value: "weekend",        label: "Weekendje weg" },
        { value: "zon",            label: "Zonvakantie" },
        { value: "winter",         label: "Wintervakantie" },
        { value: "vakantieparken", label: "Vakantieparken" },
    ];

    const WHERE_SUGGESTIONS = [
        { value: "near",      title: "In de buurt",            sub: "Rondkijken in je omgeving",                          icon: "🧭" },
        { value: "parijs",    title: "Parijs, Frankrijk",      sub: "Voor bezienswaardigheden zoals Eiffeltoren",         icon: "🗼" },
        { value: "londen",    title: "Londen, Verenigd Koninkrijk", sub: "Voor het bruisende nachtleven",                icon: "🌉" },
        { value: "maastricht", title: "Maastricht, Limburg",   sub: "Populaire bestemming",                               icon: "🏙️" },
        { value: "antwerpen", title: "Antwerpen, België",      sub: "Voor bezienswaardigheden zoals MAS - Museum aan de Stroom", icon: "🏛️" },
        { value: "valencia",  title: "Valencia, Spanje",       sub: "Voor de verbluffende architectuur",                  icon: "🏟️" },
    ];

    const CATEGORIES = [
        { value: "homes",       label: "Homes",       emoji: "🏠", badge: null },
        { value: "experiences", label: "Experiences", emoji: "🎈", badge: "NIEUW" },
        { value: "services",    label: "Services",    emoji: "🛎️", badge: "NIEUW" },
    ];

    // -------- State (per mount) --------
    function createState() {
        return {
            category: "homes",
            whoSelection: [],
            whatSelection: [],
            whereQuery: "",
            whereExpanded: false,
            whereSelected: null,
            dateSelection: "",
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

    // -------- Templates --------
    function tabsHTML(activeCategory, prefix) {
        return CATEGORIES.map(cat => `
            <button type="button"
                    class="sn-tab${cat.value === activeCategory ? " active" : ""}"
                    data-${prefix}-tab="${cat.value}">
                <span class="sn-tab-emoji" aria-hidden="true">${cat.emoji}</span>
                <span class="sn-tab-label">${cat.label}</span>
                ${cat.badge ? `<span class="sn-tab-badge">${cat.badge}</span>` : ""}
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
                    ${tabsHTML(state.category, "sn-bar")}
                </div>
            </div>
        `;
    }

    function whoSectionHTML(state) {
        if (state.activeSection !== "who") {
            return `
                <div class="sn-card collapsed" data-sn-section-toggle="who">
                    <span class="sn-card-label">Wie</span>
                    <span class="sn-card-value" data-empty="${state.whoSelection.length === 0}">
                        ${state.whoSelection.length ? labelsFor(state.whoSelection, WHO_OPTIONS) : "Voeg gezelschap toe"}
                    </span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                <h2 class="sn-card-title">Wie?</h2>
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
        if (state.activeSection !== "what") {
            return `
                <div class="sn-card collapsed" data-sn-section-toggle="what">
                    <span class="sn-card-label">Wat</span>
                    <span class="sn-card-value" data-empty="${state.whatSelection.length === 0}">
                        ${state.whatSelection.length ? labelsFor(state.whatSelection, WHAT_OPTIONS) : "Voeg vakantietype toe"}
                    </span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                <h2 class="sn-card-title">Wat?</h2>
                <div class="sn-chip-grid">
                    ${WHAT_OPTIONS.map(opt => `
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
            const valueLabel = state.whereSelected
                ? WHERE_SUGGESTIONS.find(s => s.value === state.whereSelected)?.title
                : (state.whereQuery || "Voeg bestemming toe");
            return `
                <div class="sn-card collapsed" data-sn-section-toggle="where">
                    <span class="sn-card-label">Waar</span>
                    <span class="sn-card-value" data-empty="${!state.whereSelected && !state.whereQuery}">${valueLabel}</span>
                </div>
            `;
        }

        // Expanded — laat altijd zoekveld + minstens "In de buurt" zien.
        // Klik op pijl → toon volledige lijst.
        const visible = state.whereExpanded
            ? WHERE_SUGGESTIONS
            : WHERE_SUGGESTIONS.slice(0, 1);

        const filtered = state.whereQuery
            ? WHERE_SUGGESTIONS.filter(s =>
                s.title.toLowerCase().includes(state.whereQuery.toLowerCase()))
            : visible;

        const inputIcon = state.whereExpanded
            ? `<button type="button" class="sn-where-input-back" data-sn-where-collapse aria-label="Terug"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button>`
            : `<svg class="sn-where-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

        const inputPaddingLeft = state.whereExpanded ? "padding-left: 14px;" : "";

        return `
            <div class="sn-card expanded">
                <h2 class="sn-card-title">Waar?</h2>
                <div class="sn-where-input-wrap">
                    ${inputIcon}
                    <input type="text"
                           class="sn-where-input"
                           data-sn-where-input
                           placeholder="Bestemmingen zoeken"
                           style="${inputPaddingLeft}"
                           value="${state.whereQuery.replace(/"/g, "&quot;")}" />
                </div>
                <p class="sn-where-suggest-label">Voorgestelde bestemmingen</p>
                <ul class="sn-where-list">
                    ${filtered.map(s => `
                        <li class="sn-where-item${state.whereSelected === s.value ? " active" : ""}" data-sn-where="${s.value}">
                            <span class="sn-where-item-icon" aria-hidden="true">${s.icon}</span>
                            <span class="sn-where-item-text">
                                <span class="sn-where-item-title">${s.title}</span>
                                <span class="sn-where-item-sub">${s.sub}</span>
                            </span>
                        </li>
                    `).join("")}
                </ul>
                ${!state.whereExpanded && !state.whereQuery ? `
                    <button type="button" class="sn-where-expand" data-sn-where-expand aria-label="Toon meer bestemmingen">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>` : ""}
            </div>
        `;
    }

    function whenSectionHTML(state) {
        if (state.activeSection !== "when") {
            return `
                <div class="sn-card collapsed" data-sn-section-toggle="when">
                    <span class="sn-card-label">Wanneer</span>
                    <span class="sn-card-value" data-empty="${!state.dateSelection}">
                        ${state.dateSelection || "Data toevoegen"}
                    </span>
                </div>
            `;
        }
        return `
            <div class="sn-card expanded">
                <h2 class="sn-card-title">Wanneer?</h2>
                <input type="date" class="sn-when-input" data-sn-when value="${state.dateSelection || ""}" />
                <p class="sn-when-helper">Kies een vertrekdatum (placeholder — uitbreiding naar bereik volgt).</p>
            </div>
        `;
    }

    function modalHTML(state) {
        return `
            <div class="sn-modal" data-sn-modal role="dialog" aria-modal="true" aria-label="Vakantie zoeken">
                <div class="sn-modal-panel" role="document">
                    <div class="sn-modal-top">
                        <div class="sn-modal-tabs" role="tablist">
                            ${tabsHTML(state.category, "sn-modal")}
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
        // Eerste sectie standaard open zodra modal opent.
        state.activeSection = "who";

        // Render alleen de bar in de container; modal wordt aan body
        // gehangen zodat hij over alle stacking-contexts valt.
        function renderBar() {
            container.innerHTML = collapsedBarHTML(state);
            bindBarEvents();
        }

        let modalEl = null;
        function ensureModal() {
            if (modalEl && document.body.contains(modalEl)) return;
            modalEl = el(modalHTML(state));
            document.body.appendChild(modalEl);
            bindModalEvents();
        }

        function renderModalBody() {
            if (!modalEl) return;
            const top = modalEl.querySelector(".sn-modal-tabs");
            const body = modalEl.querySelector("[data-sn-body]");
            if (top) top.innerHTML = tabsHTML(state.category, "sn-modal");
            if (body) {
                body.innerHTML = `
                    ${whoSectionHTML(state)}
                    ${whatSectionHTML(state)}
                    ${whereSectionHTML(state)}
                    ${whenSectionHTML(state)}
                `;
            }
            // Sync ook de bar-tabs (active category)
            const barTabs = container.querySelector(".sn-tabs");
            if (barTabs) barTabs.innerHTML = tabsHTML(state.category, "sn-bar");
        }

        function openModal() {
            ensureModal();
            state.modalOpen = true;
            state.activeSection = state.activeSection || "who";
            renderModalBody();
            requestAnimationFrame(() => modalEl.classList.add("open"));
            document.body.classList.add("sn-no-scroll");
            document.addEventListener("keydown", onKey);
        }

        function closeModal() {
            if (!modalEl) return;
            state.modalOpen = false;
            modalEl.classList.remove("open");
            document.body.classList.remove("sn-no-scroll");
            document.removeEventListener("keydown", onKey);
        }

        function onKey(e) {
            if (e.key === "Escape") closeModal();
        }

        function bindBarEvents() {
            container.querySelectorAll("[data-sn-open]").forEach(b => {
                b.addEventListener("click", openModal);
            });
            container.querySelectorAll("[data-sn-bar-tab]").forEach(t => {
                t.addEventListener("click", (e) => {
                    e.stopPropagation();
                    state.category = t.dataset.snBarTab;
                    renderBar();
                    if (modalEl) renderModalBody();
                    // Klikken op tab opent ook de modal — dat is de UX uit de design
                    openModal();
                });
            });
        }

        function bindModalEvents() {
            modalEl.addEventListener("click", (e) => {
                // Klik op overlay (buiten panel) → sluiten
                if (e.target === modalEl) closeModal();
            });

            modalEl.addEventListener("click", (e) => {
                const closeBtn = e.target.closest("[data-sn-close]");
                if (closeBtn) { closeModal(); return; }

                const tab = e.target.closest("[data-sn-modal-tab]");
                if (tab) {
                    state.category = tab.dataset.snModalTab;
                    renderModalBody();
                    return;
                }

                const sectionToggle = e.target.closest("[data-sn-section-toggle]");
                if (sectionToggle) {
                    state.activeSection = sectionToggle.dataset.snSectionToggle;
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

                const whereExpand = e.target.closest("[data-sn-where-expand]");
                if (whereExpand) {
                    state.whereExpanded = true;
                    renderModalBody();
                    // Focus terug op input
                    const inp = modalEl.querySelector("[data-sn-where-input]");
                    if (inp) inp.focus();
                    return;
                }

                const whereCollapse = e.target.closest("[data-sn-where-collapse]");
                if (whereCollapse) {
                    state.whereExpanded = false;
                    state.whereQuery = "";
                    renderModalBody();
                    return;
                }

                const whereItem = e.target.closest("[data-sn-where]");
                if (whereItem) {
                    state.whereSelected = whereItem.dataset.snWhere;
                    state.whereQuery = "";
                    state.activeSection = "when";
                    renderModalBody();
                    return;
                }

                const clearBtn = e.target.closest("[data-sn-clear]");
                if (clearBtn) {
                    state.whoSelection = [];
                    state.whatSelection = [];
                    state.whereQuery = "";
                    state.whereSelected = null;
                    state.whereExpanded = false;
                    state.dateSelection = "";
                    state.activeSection = "who";
                    renderModalBody();
                    return;
                }

                const submitBtn = e.target.closest("[data-sn-submit]");
                if (submitBtn) { submitSearch(); return; }
            });

            modalEl.addEventListener("input", (e) => {
                if (e.target.matches("[data-sn-where-input]")) {
                    state.whereQuery = e.target.value;
                    // Live filteren — render de lijst opnieuw maar laat focus staan
                    const list = modalEl.querySelector(".sn-where-list");
                    if (list) {
                        const q = state.whereQuery.toLowerCase();
                        const filtered = q
                            ? WHERE_SUGGESTIONS.filter(s => s.title.toLowerCase().includes(q))
                            : (state.whereExpanded ? WHERE_SUGGESTIONS : WHERE_SUGGESTIONS.slice(0, 1));
                        list.innerHTML = filtered.map(s => `
                            <li class="sn-where-item${state.whereSelected === s.value ? " active" : ""}" data-sn-where="${s.value}">
                                <span class="sn-where-item-icon" aria-hidden="true">${s.icon}</span>
                                <span class="sn-where-item-text">
                                    <span class="sn-where-item-title">${s.title}</span>
                                    <span class="sn-where-item-sub">${s.sub}</span>
                                </span>
                            </li>`).join("");
                    }
                    return;
                }
                if (e.target.matches("[data-sn-when]")) {
                    state.dateSelection = e.target.value;
                }
            });
        }

        function submitSearch() {
            // Map naar bestaande alle-vakanties.html querystring.
            // Pak de eerste keuze van Wie en Wat (URL-conventie van de site).
            const params = new URLSearchParams();
            if (state.whoSelection[0])  params.set("who", state.whoSelection[0]);
            if (state.whatSelection[0]) params.set("what", state.whatSelection[0]);
            if (state.whereSelected && state.whereSelected !== "near") params.set("where", state.whereSelected);
            if (state.whereQuery && !state.whereSelected) params.set("q", state.whereQuery);
            if (state.dateSelection) params.set("date", state.dateSelection);
            window.location.href = "alle-vakanties.html" + (params.toString() ? "?" + params.toString() : "");
        }

        renderBar();
    }

    // Public API
    window.renderSearchNavigation = renderSearchNavigation;
})();
