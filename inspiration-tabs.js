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

    // Routing-helpers — alle URL's hieronder bestaan al in de site
    // (zie alle-vakanties.html, Niveau2-Wie/Wat/Waar.html en de nieuwe
    // Level 1 landings hotels/campings/vakantieparken).
    const COMBO   = (who, what) => `alle-vakanties.html?who=${who}&what=${what}`;
    const NIVWIE  = (who)       => `Niveau2-Wie.html?who=${who}`;
    const NIVWAT  = (what)      => `Niveau2-Wat.html?what=${what}`;
    const NIVWAAR = (where)     => `Niveau2-Waar.html?where=${where}`;
    const NIVWAAR_ALL           = `Niveau2-Waar.html`;

    const TABS = [
        {
            id: "populair",
            label: "Populair",
            items: [
                { title: "Gezin + Camping",                          sub: "Combinatie", href: COMBO("families-kids", "camping") },
                { title: "Vrienden + Weekendje weg",                 sub: "Combinatie", href: COMBO("friends",        "city-trip") },
                { title: "Koppels + Wellness",                       sub: "Combinatie", href: COMBO("couples",        "wellness") },
                { title: "Senioren + Hotel",                         sub: "Combinatie", href: COMBO("seniors",        "hotel") },
                { title: "Huisdier + Camping",                       sub: "Combinatie", href: COMBO("pets",           "camping") },
                { title: "Gezinnen met tieners + Aquapark",          sub: "Combinatie", href: COMBO("families-teens", "camping") },
                { title: "Familie + Wintersport",                    sub: "Combinatie", href: COMBO("families-kids",  "winter") },
                { title: "Alleen reizend + Actief / Avontuur",       sub: "Combinatie", href: COMBO("solo",           "adventure-trip") },
            ],
        },
        {
            id: "reisgezelschap",
            label: "Reisgezelschap",
            items: [
                { title: "Op vakantie met tieners",                  sub: "Reisgezelschap", href: NIVWIE("families-teens") },
                { title: "Op vakantie als koppel",                   sub: "Reisgezelschap", href: NIVWIE("couples") },
                { title: "Met vrienden op vakantie",                 sub: "Reisgezelschap", href: NIVWIE("friends") },
                { title: "Met familie op vakantie",                  sub: "Reisgezelschap", href: NIVWIE("families-kids") },
                { title: "Alleen op vakantie",                       sub: "Reisgezelschap", href: NIVWIE("solo") },
                { title: "Met huisdieren op vakantie",               sub: "Reisgezelschap", href: NIVWIE("pets") },
                { title: "Met senioren op vakantie",                 sub: "Reisgezelschap", href: NIVWIE("seniors") },
                { title: "Met baby's op vakantie",                   sub: "Reisgezelschap", href: NIVWIE("families-babies") },
                { title: "Met jonge kinderen op vakantie",           sub: "Reisgezelschap", href: NIVWIE("families-kids") },
            ],
        },
        {
            id: "vakantietype",
            label: "Vakantietype",
            items: [
                { title: "Op vakantie naar de Camping",              sub: "Vakantietype", href: "campings.html" },
                { title: "Op vakantie in een resort",                sub: "Vakantietype", href: "hotels.html" },
                { title: "Op vakantie in een hotel",                 sub: "Vakantietype", href: NIVWAT("hotel") },
                { title: "Op vakantie in een vakantiepark",          sub: "Vakantietype", href: "vakantieparken.html" },
                { title: "Op vakantie in een glamping",              sub: "Vakantietype", href: NIVWAT("glamping") },
                { title: "Op vakantie in de natuur",                 sub: "Vakantietype", href: NIVWAT("adventure-trip") },
                { title: "De leukste zonvakanties",                  sub: "Vakantietype", href: NIVWAT("sun") },
                { title: "De leukste vakanties voor wintersport",    sub: "Vakantietype", href: NIVWAT("winter") },
            ],
        },
        {
            id: "bestemmingen",
            label: "Bestemmingen",
            items: [
                // Continenten zonder eigen pagina linken naar de generieke
                // Niveau2-Waar-pagina; geen 404's.
                { title: "Op vakantie in Europa",                    sub: "Bestemming", href: NIVWAAR_ALL },
                { title: "Op vakantie in Azië",                      sub: "Bestemming", href: NIVWAAR_ALL },
                { title: "Op vakantie in eigen land",                sub: "Bestemming", href: NIVWAAR_ALL },
                { title: "Op vakantie in Nederland",                 sub: "Bestemming", href: "nederland.html" },
                { title: "Op vakantie in Afrika",                    sub: "Bestemming", href: NIVWAAR_ALL },
                { title: "Vakanties aan zee",                        sub: "Bestemming", href: NIVWAAR("zeeland") },
                { title: "Vakantie in de bergen",                    sub: "Bestemming", href: NIVWAAR("oostenrijk") },
                { title: "Op vakantie in Scandinavië",               sub: "Bestemming", href: NIVWAAR_ALL },
            ],
        },
    ];

    function escapeHTML(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function renderInspirationTabs(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

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
            return tab.items.map(it => `
                <a class="it-item" href="${it.href}">
                    <span class="it-item-title">${escapeHTML(it.title)}</span>
                    <span class="it-item-sub">${escapeHTML(it.sub)}</span>
                </a>
            `).join("");
        }

        function render() {
            container.innerHTML = `
                <section class="it-section" aria-label="Inspiratie voor toekomstige uitstapjes">
                    <h2 class="it-title">Inspiratie voor toekomstige uitstapjes</h2>
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
