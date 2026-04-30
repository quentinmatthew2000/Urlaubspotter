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
    // WAT refinements (boutique / adult-only / kindercampings / etc.)
    // blijven binnen Niveau 2 — het zijn sub-categorieën van het
    // huidige WAT-type, niet WIE-combinaties. De pagina herkent `sub`
    // en past titel/eyebrow aan (zie Niveau2-Wat.html).
    const NIVWAT_SUB  = (what, sub) => `Niveau2-Wat.html?what=${what}&sub=${sub}`;
    const NIVWIE      = (who)       => `Niveau2-Wie.html?who=${who}`;
    const NIVWAT      = (what)      => `Niveau2-Wat.html?what=${what}`;
    const NIVWAAR     = (where)     => `Niveau2-Waar.html?where=${where}`;
    const NIVWAAR_ALL               = `Niveau2-Waar.html`;

    // Niveau 4 helper voor 3-dimensionale combinaties (Wie + Wat + Waar)
    // — gebruikt door de Populair-tab in WAT-context.
    const LVL4 = (who, what, where, extra) =>
        `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}` +
        (extra ? `&${extra}` : "");

    // Vakantietype-tab is context-aware: op een Niveau 2 — Wat pagina
    // tonen we hier alleen sub-types van het huidige WAT-type. Iedere
    // refinement linkt naar zijn EIGEN Niveau 2 pagina met ?sub=
    // (Niveau2-Wat.html herkent dat en past titel/eyebrow aan).
    // Wellness en Glamping hebben hun eigen what-key in SITE_DATA en
    // gebruiken daarom de directe `?what=...` route.
    const WHAT_REFINEMENTS = {
        hotel: [
            { icon: "🛎️",  title: "Boutique hotels",              href: NIVWAT_SUB("hotel", "boutique") },
            { icon: "🥂",  title: "Adult Only hotels",            href: NIVWAT_SUB("hotel", "adult-only") },
            // Wellness/Glamping zijn ook eigen what-keys in SITE_DATA.
            // We linken bewust met what=hotel&sub=wellness zodat de Hotel-
            // parent context behouden blijft (i.p.v. ?what=wellness wat
            // de WAT generaliseert naar "Wellness voor koppels").
            { icon: "💆",  title: "Wellness hotels",              href: NIVWAT_SUB("hotel", "wellness") },
            { icon: "🍽️",  title: "All-inclusive hotels",         href: NIVWAT_SUB("hotel", "all-inclusive") },
            { icon: "🎨",  title: "Design hotels",                href: NIVWAT_SUB("hotel", "design") },
            { icon: "🏙️",  title: "Hotels midden in het centrum", href: NIVWAT_SUB("hotel", "city") },
            { icon: "🌴",  title: "Resorts",                      href: NIVWAT_SUB("hotel", "resort") },
        ],
        camping: [
            { icon: "✨",  title: "Glamping",                     href: NIVWAT_SUB("camping", "glamping") },
            { icon: "🏊",  title: "Camping met waterpark",        href: NIVWAT_SUB("camping", "waterpark") },
            { icon: "🌲",  title: "Camping in de natuur",         href: NIVWAT_SUB("camping", "natuur") },
            { icon: "🎠",  title: "Kindercampings",               href: NIVWAT_SUB("camping", "kids") },
            { icon: "🐕",  title: "Hondvriendelijke campings",    href: NIVWAT_SUB("camping", "honden") },
            { icon: "🏖️", title: "Campings aan zee",              href: NIVWAT_SUB("camping", "zee") },
        ],
        "holiday-park": [
            { icon: "🏊",      title: "Vakantieparken met zwemparadijs",  href: NIVWAT_SUB("holiday-park", "zwemparadijs") },
            { icon: "🎡",      title: "Vakantieparken met attractiepark", href: NIVWAT_SUB("holiday-park", "attractiepark") },
            { icon: "✨",      title: "Luxe vakantieparken",              href: NIVWAT_SUB("holiday-park", "luxe") },
            { icon: "👨‍👩‍👧", title: "Kindvriendelijke vakantieparken",    href: NIVWAT_SUB("holiday-park", "kids") },
            { icon: "🌲",      title: "Vakantieparken in de natuur",      href: NIVWAT_SUB("holiday-park", "natuur") },
        ],
    };

    // Bestemmingen-tab in WAT-context: iedere item heeft zijn EIGEN
    // landing — geen generieke "Waar wil je heen?" fallback.
    //   • Concrete landen → Niveau3-WaarWat.html?what=&where=
    //   • "bij de bergen" → Niveau3-WaarWat met where=oostenrijk
    //     (de bergachtige bestemming in de dataset)
    //   • Continenten → eigen continent-landing (europa.html / azie.html)
    //     met ?what= zodat de pagina kan filteren op het huidige type.
    function bestemmingenForWat(what, articleLabel) {
        const N3 = (where) => `Niveau3-WaarWat.html?what=${what}&where=${where}`;
        const CONT = (slug) => `${slug}.html?what=${what}`;
        return [
            { icon: "🌍",  title: `Naar ${articleLabel} in Europa`,     href: CONT("europa") },
            { icon: "🌏",  title: `Naar ${articleLabel} in Azië`,       href: CONT("azie") },
            { icon: "🍺",  title: `Naar ${articleLabel} in Duitsland`,  href: N3("duitsland") },
            { icon: "🇳🇱",  title: `Naar ${articleLabel} in Nederland`,  href: N3("netherlands") },
            { icon: "⛰️",  title: `Naar ${articleLabel} bij de bergen`, href: N3("oostenrijk") },
            { icon: "🗼",  title: `Naar ${articleLabel} in Frankrijk`,  href: N3("frankrijk") },
            { icon: "⛵",  title: `Naar ${articleLabel} in Kroatië`,    href: N3("kroatie") },
            { icon: "🍝",  title: `Naar ${articleLabel} in Italië`,     href: N3("italie") },
        ];
    }

    const BESTEMMINGEN_BY_WAT = {
        hotel:           bestemmingenForWat("hotel",        "een hotel"),
        camping:         bestemmingenForWat("camping",      "de camping"),
        "holiday-park":  bestemmingenForWat("holiday-park", "een vakantiepark"),
    };

    // Reisgezelschap-tab labels in WAT-context: gebruiker leest direct
    // "Naar een hotel met tieners" / "Met vrienden naar een camping"
    // i.p.v. de generieke "Op vakantie met tieners". Iedere item link
    // naar Niveau3-WieWat met who+what.
    function reisgezelschapForWat(what, articleLabel) {
        // articleLabel = bv. "een hotel" / "een camping" / "een vakantiepark"
        return [
            { who: "families-teens",  icon: "🧑",      title: `Naar ${articleLabel} met tieners` },
            { who: "couples",         icon: "💑",      title: `Naar ${articleLabel} als koppel` },
            { who: "friends",         icon: "👫",      title: `Met vrienden naar ${articleLabel}` },
            { who: "families-kids",   icon: "👨‍👩‍👧", title: `Met familie naar ${articleLabel}` },
            { who: "solo",            icon: "🚶",      title: `Alleen naar ${articleLabel}` },
            { who: "pets",            icon: "🐕",      title: `Met huisdieren naar ${articleLabel}` },
            { who: "seniors",         icon: "👴",      title: `Met senioren naar ${articleLabel}` },
            { who: "families-babies", icon: "👶",      title: `Met baby's naar ${articleLabel}` },
            { who: "families-kids",   icon: "👧",      title: `Met jonge kinderen naar ${articleLabel}` },
        ].map(it => ({ ...it, href: LVL3_WIEWAT(it.who, what) }));
    }

    const REISGEZELSCHAP_BY_WAT = {
        hotel:          reisgezelschapForWat("hotel",        "een hotel"),
        camping:        reisgezelschapForWat("camping",      "een camping"),
        "holiday-park": reisgezelschapForWat("holiday-park", "een vakantiepark"),
    };

    // Populair-tab in WAT-context: 2-variabele combinaties bovenop de
    // pagina-context. Iedere item combineert twee van de drie:
    //   • Reisgezelschap (WIE)
    //   • Vakantietype refinement (WAT-sub)
    //   • Bestemming (WAAR)
    // Drie-variabele combinaties zijn bewust uitgesloten — de WAT van
    // de pagina is een gegeven, niet een keuze. Routes:
    //   WAT-ref + WIE          → Niveau3-WieWat.html?who=&what= (of &sub=)
    //   WAT-ref + WAAR         → Niveau3-WaarWat.html?what=&where=&sub=
    //   WIE + WAAR (page WAT)  → Niveau4-WieWatWaar.html?who=&what=&where=
    const POPULAIR_BY_WAT = {
        hotel: [
            // WAT-parent (hotel) blijft staan; wellness komt als sub mee
            // zodat de pagina "Wellness hotels voor koppels" rendert
            // i.p.v. te degenereren tot "Wellness voor koppels".
            { icon: "💆",     title: "Wellness hotels voor koppels",          href: "Niveau3-WieWat.html?who=couples&what=hotel&sub=wellness" },
            { icon: "🍝",     title: "Hotel in Italië met kinderen",          href: LVL4("families-kids", "hotel", "italie") },
            { icon: "🛎️",     title: "Boutique hotels in Frankrijk",          href: "Niveau3-WaarWat.html?what=hotel&where=frankrijk&sub=boutique" },
            { icon: "🍽️",     title: "All-inclusive hotels in Spanje",        href: "Niveau3-WaarWat.html?what=hotel&where=spanje&sub=all-inclusive" },
            { icon: "🥂",     title: "Adult Only hotels voor koppels",        href: "Niveau3-WieWat.html?who=couples&what=hotel&sub=adult-only" },
            { icon: "🏙️",     title: "Hotels in het centrum met vrienden",    href: "Niveau3-WieWat.html?who=friends&what=hotel&sub=city" },
            { icon: "🎨",     title: "Design hotels in Nederland",            href: "Niveau3-WaarWat.html?what=hotel&where=zeeland&sub=design" },
            { icon: "👴",     title: "Hotel in Kroatië voor senioren",        href: LVL4("seniors", "hotel", "kroatie") },
            { icon: "🌴",     title: "Resorts voor families",                 href: "Niveau3-WieWat.html?who=families-kids&what=hotel&sub=resort" },
        ],
        camping: [
            // Camping-parent behouden; glamping komt als sub mee zodat
            // de pagina "Glamping voor koppels (op camping)" toont
            // i.p.v. te degenereren tot een Glamping-only resultaat.
            { icon: "✨",     title: "Glamping met koppels",                       href: "Niveau3-WieWat.html?who=couples&what=camping&sub=glamping" },
            { icon: "🍝",     title: "Camping in Italië met kinderen",             href: LVL4("families-kids", "camping", "italie") },
            { icon: "🐕",     title: "Hondvriendelijke campings in Frankrijk",     href: "Niveau3-WaarWat.html?what=camping&where=frankrijk&sub=honden" },
            { icon: "🌲",     title: "Camping in de natuur met vrienden",          href: "Niveau3-WieWat.html?who=friends&what=camping&sub=natuur" },
            { icon: "🎠",     title: "Kindercamping in Nederland",                 href: "Niveau3-WaarWat.html?what=camping&where=zeeland&sub=kids" },
            { icon: "🏖️",     title: "Camping aan zee met gezinnen",               href: "Niveau3-WieWat.html?who=families-kids&what=camping&sub=zee" },
            { icon: "⛵",     title: "Glamping in Kroatië",                        href: "Niveau3-WaarWat.html?what=camping&where=kroatie&sub=glamping" },
            { icon: "🏊",     title: "Camping met waterpark voor tieners",         href: "Niveau3-WieWat.html?who=families-teens&what=camping&sub=waterpark" },
            { icon: "🍺",     title: "Camping in Duitsland met familie",           href: LVL4("families-kids", "camping", "duitsland") },
        ],
        "holiday-park": [
            { icon: "🏊",     title: "Vakantieparken met zwemparadijs voor gezinnen",   href: "Niveau3-WieWat.html?who=families-kids&what=holiday-park&sub=zwemparadijs" },
            { icon: "🇳🇱",     title: "Vakantieparken in Nederland met kinderen",        href: LVL4("families-kids", "holiday-park", "zeeland") },
            { icon: "✨",     title: "Luxe vakantieparken voor koppels",                 href: "Niveau3-WieWat.html?who=couples&what=holiday-park&sub=luxe" },
            { icon: "🎡",     title: "Vakantieparken met attractiepark voor tieners",    href: "Niveau3-WieWat.html?who=families-teens&what=holiday-park&sub=attractiepark" },
            { icon: "👶",     title: "Kindvriendelijke vakantieparken in Duitsland",     href: "Niveau3-WaarWat.html?what=holiday-park&where=duitsland&sub=kids" },
            { icon: "🌲",     title: "Vakantieparken in de natuur voor senioren",        href: "Niveau3-WieWat.html?who=seniors&what=holiday-park&sub=natuur" },
            { icon: "🍫",     title: "Vakantieparken in België met familie",             href: LVL4("families-kids", "holiday-park", "belgie") },
            { icon: "🎢",     title: "Themaparken voor gezinnen",                        href: "Niveau3-WieWat.html?who=families-kids&what=holiday-park&sub=themaparken" },
            { icon: "🗼",     title: "Vakantieparken in Frankrijk voor families",        href: LVL4("families-kids", "holiday-park", "frankrijk") },
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

        function itemsForCurrentTab() {
            const tab = TABS.find(t => t.id === activeTab) || TABS[0];
            if (!contextWhat) return tab.items;

            // Op een Niveau 2 — Wat pagina swappen we drie van de vier
            // tabs naar context-bewuste lijsten:
            //   • populair      → Wie+Wat+Waar combinaties uit POPULAIR_BY_WAT
            //   • vakantietype  → sub-types uit WHAT_REFINEMENTS
            //   • bestemmingen  → "<artikel> <wat> in <land>" uit BESTEMMINGEN_BY_WAT
            // De reisgezelschap-tab houdt zijn labels maar de href wordt
            // herschreven: NIVWIE(who) → LVL3_WIEWAT(who, contextWhat),
            // zodat klikken op "Met jonge kinderen op vakantie" vanaf
            // Kamperen leidt naar "Camping voor gezinnen met jonge
            // kinderen" (Niveau 3 Wie+Wat).
            if (activeTab === "populair"     && POPULAIR_BY_WAT[contextWhat])     return POPULAIR_BY_WAT[contextWhat];
            if (activeTab === "vakantietype" && WHAT_REFINEMENTS[contextWhat])    return WHAT_REFINEMENTS[contextWhat];
            if (activeTab === "bestemmingen" && BESTEMMINGEN_BY_WAT[contextWhat]) return BESTEMMINGEN_BY_WAT[contextWhat];
            if (activeTab === "reisgezelschap" && REISGEZELSCHAP_BY_WAT[contextWhat]) {
                return REISGEZELSCHAP_BY_WAT[contextWhat];
            }
            return tab.items;
        }

        function gridHTML() {
            const items = itemsForCurrentTab();
            // Sublabels worden niet gerenderd — pills tonen alleen titel + icoon.
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
