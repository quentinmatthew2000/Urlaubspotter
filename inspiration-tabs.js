/* ============================================================
   inspiration-tabs.js — homepage-component "Inspiratie voor
   toekomstige uitstapjes". Vier tabs (Populair / Reisgezelschap
   / Vakantietype / Bestemmingen) met elk een geordende lijst
   items die direct doorlinken naar bestaande paginas.

   Usage:
       <div id="inspiration-tabs"></div>
       <script src="inspiration-tabs.js"></script>
       <script>renderInspirationTabs('inspiration-tabs');</script>
   ============================================================ */

(function () {
    "use strict";

    // Routing-helpers — alle URL's hieronder bestaan al in de site.
    // Wie+Wat combinaties (Tab "Populair") landen op de Niveau 3
    // pagina (Wie+Wat); single-dimensie items op Niveau 2.
    const LVL3_WIEWAT = (who, what) => `Niveau3-WieWat.html?who=${who}&what=${what}`;
    const LVL3_WAT_SUB = (what, sub) => `Niveau3-WieWat.html?what=${what}&sub=${sub}`;
    const NIVWIE      = (who)       => `Niveau2-Wie.html?who=${who}`;
    const NIVWAT      = (what)      => `Niveau2-Wat.html?what=${what}`;
    const NIVWAAR     = (where)     => `Niveau2-Waar.html?where=${where}`;
    const NIVWAAR_ALL               = `Niveau2-Waar.html`;

    // Vakantietype-tab is context-aware: op een Niveau 2 — Wat pagina
    // tonen we hier alleen sub-types van het huidige WAT-type, zodat
    // we de gebruiker niet "kies een vakantietype" laten kiezen
    // terwijl die al gekozen is. Items linken door naar Niveau 3 met
    // ?what=&sub= zodat het URL-intent voor SEO behouden blijft.
    const WHAT_REFINEMENTS = {
        hotel: [
            { icon: "🛎️",  title: "Boutique hotels",              href: LVL3_WAT_SUB("hotel", "boutique") },
            { icon: "🥂",  title: "Adult Only hotels",            href: LVL3_WAT_SUB("hotel", "adult-only") },
            { icon: "💆",  title: "Wellness hotels",              href: NIVWAT("wellness") },
            { icon: "🍽️",  title: "All-inclusive hotels",         href: LVL3_WAT_SUB("hotel", "all-inclusive") },
            { icon: "🎨",  title: "Design hotels",                href: LVL3_WAT_SUB("hotel", "design") },
            { icon: "🏙️",  title: "Hotels midden in het centrum", href: LVL3_WAT_SUB("hotel", "city") },
            { icon: "🌴",  title: "Resorts",                      href: LVL3_WAT_SUB("hotel", "resort") },
        ],
        camping: [
            { icon: "✨",  title: "Glamping",                     href: NIVWAT("glamping") },
            { icon: "🏊",  title: "Camping met waterpark",        href: LVL3_WAT_SUB("camping", "waterpark") },
            { icon: "🌲",  title: "Camping in de natuur",         href: LVL3_WAT_SUB("camping", "natuur") },
            { icon: "🎠",  title: "Kindercampings",               href: LVL3_WAT_SUB("camping", "kids") },
            { icon: "🐕",  title: "Hondvriendelijke campings",    href: LVL3_WAT_SUB("camping", "honden") },
            { icon: "🏖️", title: "Campings aan zee",              href: LVL3_WAT_SUB("camping", "zee") },
        ],
        "holiday-park": [
            { icon: "🏊",      title: "Vakantieparken met zwemparadijs",  href: LVL3_WAT_SUB("holiday-park", "zwemparadijs") },
            { icon: "🎡",      title: "Vakantieparken met attractiepark", href: LVL3_WAT_SUB("holiday-park", "attractiepark") },
            { icon: "✨",      title: "Luxe vakantieparken",              href: LVL3_WAT_SUB("holiday-park", "luxe") },
            { icon: "👨‍👩‍👧", title: "Kindvriendelijke vakantieparken",    href: LVL3_WAT_SUB("holiday-park", "kids") },
            { icon: "🌲",      title: "Vakantieparken in de natuur",      href: LVL3_WAT_SUB("holiday-park", "natuur") },
        ],
    };

    // Iedere item krijgt een emoji-icon links zodat de pills visueel
    // aansluiten op het bestaande "Populaire combinaties" blok.
    const TABS = [
        {
            id: "populair",
            label: "Populair",
            items: [
                { icon: "👨‍👩‍👧", title: "Gezin + Camping",                    sub: "Populaire combinatie", href: LVL3_WIEWAT("families-kids", "camping") },
                { icon: "👫",     title: "Vrienden + Weekendje weg",            sub: "Populaire combinatie", href: LVL3_WIEWAT("friends",        "city-trip") },
                { icon: "💑",     title: "Koppels + Wellness",                  sub: "Populaire combinatie", href: LVL3_WIEWAT("couples",        "wellness") },
                { icon: "👴",     title: "Senioren + Hotel",                    sub: "Populaire combinatie", href: LVL3_WIEWAT("seniors",        "hotel") },
                { icon: "🐕",     title: "Huisdier + Camping",                  sub: "Populaire combinatie", href: LVL3_WIEWAT("pets",           "camping") },
                { icon: "🌊",     title: "Gezinnen met tieners + Aquapark",     sub: "Populaire combinatie", href: LVL3_WIEWAT("families-teens", "camping") },
                { icon: "⛷️",     title: "Familie + Wintersport",               sub: "Populaire combinatie", href: LVL3_WIEWAT("families-kids",  "winter") },
                { icon: "🧗",     title: "Alleen reizend + Actief / Avontuur",  sub: "Populaire combinatie", href: LVL3_WIEWAT("solo",           "adventure-trip") },
            ],
        },
        {
            id: "reisgezelschap",
            label: "Reisgezelschap",
            items: [
                { icon: "🧑",     title: "Op vakantie met tieners",             sub: "Reisgezelschap", href: NIVWIE("families-teens") },
                { icon: "💑",     title: "Op vakantie als koppel",              sub: "Reisgezelschap", href: NIVWIE("couples") },
                { icon: "👫",     title: "Met vrienden op vakantie",            sub: "Reisgezelschap", href: NIVWIE("friends") },
                { icon: "👨‍👩‍👧", title: "Met familie op vakantie",             sub: "Reisgezelschap", href: NIVWIE("families-kids") },
                { icon: "🚶",     title: "Alleen op vakantie",                  sub: "Reisgezelschap", href: NIVWIE("solo") },
                { icon: "🐕",     title: "Met huisdieren op vakantie",          sub: "Reisgezelschap", href: NIVWIE("pets") },
                { icon: "👴",     title: "Met senioren op vakantie",            sub: "Reisgezelschap", href: NIVWIE("seniors") },
                { icon: "👶",     title: "Met baby's op vakantie",              sub: "Reisgezelschap", href: NIVWIE("families-babies") },
                { icon: "👧",     title: "Met jonge kinderen op vakantie",      sub: "Reisgezelschap", href: NIVWIE("families-kids") },
            ],
        },
        {
            id: "vakantietype",
            label: "Vakantietype",
            items: [
                { icon: "⛺",     title: "Op vakantie naar de Camping",         sub: "Vakantietype", href: "campings.html" },
                { icon: "🌴",     title: "Op vakantie in een resort",           sub: "Vakantietype", href: "hotels.html" },
                { icon: "🏨",     title: "Op vakantie in een hotel",            sub: "Vakantietype", href: NIVWAT("hotel") },
                { icon: "🎡",     title: "Op vakantie in een vakantiepark",     sub: "Vakantietype", href: "vakantieparken.html" },
                { icon: "✨",     title: "Op vakantie in een glamping",         sub: "Vakantietype", href: NIVWAT("glamping") },
                { icon: "🌲",     title: "Op vakantie in de natuur",            sub: "Vakantietype", href: NIVWAT("adventure-trip") },
                { icon: "☀️",     title: "De leukste zonvakanties",             sub: "Vakantietype", href: NIVWAT("sun") },
                { icon: "⛷️",     title: "De leukste vakanties voor wintersport", sub: "Vakantietype", href: NIVWAT("winter") },
            ],
        },
        {
            id: "bestemmingen",
            label: "Bestemmingen",
            items: [
                // Continenten zonder eigen pagina linken naar de generieke
                // Niveau2-Waar-pagina; geen 404's.
                { icon: "🌍",     title: "Op vakantie in Europa",              sub: "Bestemming", href: NIVWAAR_ALL },
                { icon: "🌏",     title: "Op vakantie in Azië",                sub: "Bestemming", href: NIVWAAR_ALL },
                { icon: "🏡",     title: "Op vakantie in eigen land",          sub: "Bestemming", href: NIVWAAR_ALL },
                { icon: "🇳🇱",     title: "Op vakantie in Nederland",           sub: "Bestemming", href: "nederland.html" },
                { icon: "🦁",     title: "Op vakantie in Afrika",              sub: "Bestemming", href: NIVWAAR_ALL },
                { icon: "🏖️",     title: "Vakanties aan zee",                  sub: "Bestemming", href: NIVWAAR("zeeland") },
                { icon: "⛰️",     title: "Vakantie in de bergen",              sub: "Bestemming", href: NIVWAAR("oostenrijk") },
                { icon: "❄️",     title: "Op vakantie in Scandinavië",         sub: "Bestemming", href: NIVWAAR_ALL },
            ],
        },
    ];

    function escapeHTML(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function renderInspirationTabs(containerId, options) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const opts = options || {};
        // contextWhat = 'hotel' | 'camping' | 'holiday-park' | null. Wanneer
        // gezet vervangen we de Vakantietype-tab door refinement-items
        // specifiek voor dat WAT-type, zodat we de gebruiker niet
        // dezelfde keuze opnieuw laten maken.
        const contextWhat = opts.contextWhat && WHAT_REFINEMENTS[opts.contextWhat]
            ? opts.contextWhat
            : null;

        let activeTab = TABS[0].id;

        function tabsHTML() {
            return TABS.map(t => `
                <button type="button"
                        class="it-tab${t.id === activeTab ? ' active' : ''}"
                        data-it-tab="${t.id}"
                        role="tab"
                        aria-selected="${t.id === activeTab}">${escapeHTML(t.label)}</button>
            `).join("");
        }

        function gridHTML() {
            const tab = TABS.find(t => t.id === activeTab) || TABS[0];
            // In WAT-context vervangen we de Vakantietype-items door
            // de refinement-set voor het huidige WAT-type. Andere tabs
            // blijven hun standaard-items tonen.
            const items = (activeTab === "vakantietype" && contextWhat)
                ? WHAT_REFINEMENTS[contextWhat]
                : tab.items;
            // Sublabels (Populaire combinatie / Reisgezelschap / etc.)
            // worden niet meer gerenderd — pills tonen alleen de titel.
            return items.map(it => `
                <a class="it-item" href="${it.href}">
                    <span class="it-item-icon" aria-hidden="true">${it.icon || ""}</span>
                    <span class="it-item-title">${escapeHTML(it.title)}</span>
                </a>
            `).join("");
        }

        function render() {
            container.innerHTML = `
                <section class="it-section" aria-label="Inspiratie voor jou">
                    <h2 class="it-title">Inspiratie voor jou</h2>
                    <div class="it-tabs">
                        <div class="it-tabs-track" role="tablist" data-it-track>
                            ${tabsHTML()}
                        </div>
                    </div>
                    <div class="it-grid" data-it-grid role="tabpanel" aria-labelledby="${activeTab}">
                        ${gridHTML()}
                    </div>
                </section>
            `;
            updateOverflowHint();
        }

        function updateOverflowHint() {
            const tabs  = container.querySelector(".it-tabs");
            const track = container.querySelector("[data-it-track]");
            if (!tabs || !track) return;
            const overflowing = track.scrollWidth > track.clientWidth + 2;
            tabs.classList.toggle("has-overflow", overflowing);
        }

        function bindEvents() {
            container.addEventListener("click", (e) => {
                const tab = e.target.closest("[data-it-tab]");
                if (!tab) return;
                const next = tab.dataset.itTab;
                if (next === activeTab) return;
                activeTab = next;
                // Re-render alleen tab-states + grid; geen page reload.
                container.querySelectorAll(".it-tab").forEach(b => {
                    const isActive = b.dataset.itTab === activeTab;
                    b.classList.toggle("active", isActive);
                    b.setAttribute("aria-selected", isActive ? "true" : "false");
                });
                const grid = container.querySelector("[data-it-grid]");
                if (grid) grid.innerHTML = gridHTML();
            });

            // Update overflow-hint bij resize zodat de chevron alleen
            // verschijnt wanneer de tabs daadwerkelijk overlopen.
            window.addEventListener("resize", updateOverflowHint, { passive: true });
        }

        render();
        bindEvents();
    }

    window.renderInspirationTabs = renderInspirationTabs;
})();
