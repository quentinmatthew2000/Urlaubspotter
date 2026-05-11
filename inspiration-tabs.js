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
            { icon: "🏙️",  title: "Centrumgelegen Hotels",        href: NIVWAT_SUB("hotel", "city") },
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
        // Concrete landen → Niveau3-WaarWat met ?where=. Aggregaten
        // (continenten + "bergen") → Niveau3-WaarWat met ?region=
        // zodat de WAT-context behouden blijft (Hotels in Europa,
        // Hotels nabij de bergen) i.p.v. te degenereren naar een
        // generieke Niveau 1 continentpagina of een toevallig land.
        const N3  = (where)  => `Niveau3-WaarWat.html?what=${what}&where=${where}`;
        const N3R = (region) => `Niveau3-WaarWat.html?what=${what}&region=${region}`;
        return [
            { icon: "🌍",  title: `Naar ${articleLabel} in Europa`,     href: N3R("europa") },
            { icon: "🌏",  title: `Naar ${articleLabel} in Azië`,       href: N3R("azie") },
            { icon: "🍺",  title: `Naar ${articleLabel} in Duitsland`,  href: N3("duitsland") },
            { icon: "🇳🇱",  title: `Naar ${articleLabel} in Nederland`,  href: N3("netherlands") },
            { icon: "⛰️",  title: `Naar ${articleLabel} bij de bergen`, href: N3R("bergen") },
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

    // ---- SUB-CONTEXT GENERATORS ----------------------------------------
    // Wanneer de gebruiker op een sub-pagina is (bijv. ?what=hotel&
    // sub=wellness → "Wellness Hotels") moet de Inspiratie-tab het
    // sub-niveau ALTIJD meeslepen. Geen fallback naar de generieke
    // WAT-pagina meer. Hieronder worden Reisgezelschap, Bestemmingen
    // en Populair items dynamisch opgebouwd met de subLabel als
    // titel-prefix en &sub= als URL-parameter, zodat doorklikken
    // bijvoorbeeld "Wellness Hotels voor koppels" wordt i.p.v.
    // "Hotels voor koppels".

    function reisgezelschapForSubContext(what, sub, subLabel) {
        const items = [
            { who: "families-teens",  icon: "🧑",      label: `${subLabel} voor tieners` },
            { who: "couples",         icon: "💑",      label: `${subLabel} voor koppels` },
            { who: "friends",         icon: "👫",      label: `${subLabel} met vrienden` },
            { who: "families-kids",   icon: "👨‍👩‍👧", label: `${subLabel} voor families` },
            { who: "solo",            icon: "🚶",      label: `${subLabel} voor solo-reizigers` },
            { who: "pets",            icon: "🐕",      label: `${subLabel} met huisdier` },
            { who: "seniors",         icon: "👴",      label: `${subLabel} voor senioren` },
            { who: "families-babies", icon: "👶",      label: `${subLabel} met baby's` },
            { who: "families-kids",   icon: "👧",      label: `${subLabel} voor jonge kinderen` },
        ];
        return items.map(it => ({
            icon: it.icon,
            title: it.label,
            href: `Niveau3-WieWat.html?who=${it.who}&what=${what}&sub=${sub}`,
        }));
    }

    function bestemmingenForSubContext(what, sub, subLabel) {
        // Idem als bestemmingenForWat maar met &sub= meegekoppeld
        // zodat we niet alleen Hotels in Europa zien maar
        // Wellness Hotels in Europa / Boutique Hotels nabij de
        // bergen / etc. Region wint van land voor aggregaten.
        const N3  = (where)  => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&where=${where}`;
        const N3R = (region) => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&region=${region}`;
        return [
            { icon: "🌍",  title: `${subLabel} in Europa`,     href: N3R("europa") },
            { icon: "🌏",  title: `${subLabel} in Azië`,       href: N3R("azie") },
            { icon: "🍺",  title: `${subLabel} in Duitsland`,  href: N3("duitsland") },
            { icon: "🇳🇱",  title: `${subLabel} in Nederland`,  href: N3("netherlands") },
            { icon: "⛰️",  title: `${subLabel} bij de bergen`, href: N3R("bergen") },
            { icon: "🗼",  title: `${subLabel} in Frankrijk`,  href: N3("frankrijk") },
            { icon: "⛵",  title: `${subLabel} in Kroatië`,    href: N3("kroatie") },
            { icon: "🍝",  title: `${subLabel} in Italië`,     href: N3("italie") },
        ];
    }

    function populairForSubContext(what, sub, subLabel) {
        const N3WIE  = (who)   => `Niveau3-WieWat.html?who=${who}&what=${what}&sub=${sub}`;
        const N3WAAR = (where) => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&where=${where}`;
        const N4     = (who, where) =>
            `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}&sub=${sub}`;
        // 9 items: 3× sub+WIE, 3× sub+WAAR, 3× sub+WIE+WAAR. Iedere
        // route houdt &sub= bij — geen verlies van het sub-niveau.
        return [
            { icon: "💑",      title: `${subLabel} voor koppels`,               href: N3WIE("couples") },
            { icon: "👨‍👩‍👧", title: `${subLabel} voor gezinnen`,              href: N3WIE("families-kids") },
            { icon: "👴",      title: `${subLabel} voor senioren`,              href: N3WIE("seniors") },
            { icon: "🍝",      title: `${subLabel} in Italië`,                  href: N3WAAR("italie") },
            { icon: "🗼",      title: `${subLabel} in Frankrijk`,               href: N3WAAR("frankrijk") },
            { icon: "🇳🇱",      title: `${subLabel} in Nederland`,               href: N3WAAR("netherlands") },
            { icon: "💑",      title: `${subLabel} voor koppels in Italië`,     href: N4("couples",        "italie") },
            { icon: "👨‍👩‍👧", title: `${subLabel} voor gezinnen in Frankrijk`, href: N4("families-kids",  "frankrijk") },
            { icon: "👴",      title: `${subLabel} voor senioren in Spanje`,    href: N4("seniors",        "spanje") },
        ];
    }

    // ---- WIE-CONTEXT GENERATORS ----------------------------------------
    // Niveau 2 — Wie › <gezelschap> krijgt zijn eigen contextuele
    // Inspiratie-tabs. De WIE is gegeven, dus we tonen tabs voor de
    // OVERIGE twee dimensies (Vakantietype en Bestemmingen) plus een
    // Populair-tab met combo's. Reisgezelschap-tab wordt verborgen —
    // die keuze is al gemaakt.
    function _whoLowerLabel(whoLabel) {
        // "Senioren" → "senioren", "Gezinnen met kinderen" → "gezinnen met kinderen"
        return (whoLabel || '').toLowerCase();
    }

    function vakantietypeForWieContext(who, whoLabel) {
        const N3 = (what) => `Niveau3-WieWat.html?who=${who}&what=${what}`;
        const lo = _whoLowerLabel(whoLabel);
        return [
            { icon: "🏨",   title: `Hotels voor ${lo}`,                href: N3("hotel") },
            { icon: "⛺",   title: `Camping voor ${lo}`,               href: N3("camping") },
            { icon: "🎡",   title: `Vakantieparken voor ${lo}`,        href: N3("holiday-park") },
            { icon: "✨",   title: `Glamping voor ${lo}`,              href: N3("glamping") },
            { icon: "💆",   title: `Wellness voor ${lo}`,              href: N3("wellness") },
            { icon: "☀️",   title: `Zonvakanties voor ${lo}`,          href: N3("sun") },
            { icon: "⛷️",   title: `Wintersport voor ${lo}`,           href: N3("winter") },
            { icon: "🧗",   title: `Avontuur voor ${lo}`,              href: N3("adventure-trip") },
            { icon: "🏙️",   title: `Weekendje weg voor ${lo}`,         href: N3("city-trip") },
        ];
    }

    function bestemmingenForWieContext(who, whoLabel) {
        const N3W = (where)  => `Niveau3-WieWaar.html?who=${who}&where=${where}`;
        const N3R = (region) => `Niveau3-WieWaar.html?who=${who}&region=${region}`;
        const lo = _whoLowerLabel(whoLabel);
        return [
            { icon: "🌍",   title: `Europa met ${lo}`,                 href: N3R("europa") },
            { icon: "🇳🇱",   title: `Nederland met ${lo}`,              href: N3W("netherlands") },
            { icon: "🍝",   title: `Italië met ${lo}`,                 href: N3W("italie") },
            { icon: "🗼",   title: `Frankrijk met ${lo}`,              href: N3W("frankrijk") },
            { icon: "🥘",   title: `Spanje met ${lo}`,                 href: N3W("spanje") },
            { icon: "🍺",   title: `Duitsland met ${lo}`,              href: N3W("duitsland") },
            { icon: "⛰️",   title: `Bergen met ${lo}`,                 href: N3R("bergen") },
            { icon: "🏖️",   title: `Aan zee met ${lo}`,                href: N3R("aan-zee") },
        ];
    }

    function populairForWieContext(who, whoLabel) {
        const N3WIE  = (what)  => `Niveau3-WieWat.html?who=${who}&what=${what}`;
        const N3WAAR = (where) => `Niveau3-WieWaar.html?who=${who}&where=${where}`;
        const N3REG  = (region)=> `Niveau3-WieWaar.html?who=${who}&region=${region}`;
        const N4     = (what, where) =>
            `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}`;
        const lo = _whoLowerLabel(whoLabel);
        return [
            { icon: "🏨", title: `Hotels voor ${lo}`,                href: N3WIE("hotel") },
            { icon: "⛺", title: `Camping met ${lo}`,                href: N3WIE("camping") },
            { icon: "💆", title: `Wellness voor ${lo}`,              href: N3WIE("wellness") },
            { icon: "🍝", title: `Italië met ${lo}`,                 href: N3WAAR("italie") },
            { icon: "🇳🇱", title: `Nederland met ${lo}`,              href: N3WAAR("netherlands") },
            { icon: "🌍", title: `Europa met ${lo}`,                 href: N3REG("europa") },
            { icon: "🏨", title: `Hotel in Italië voor ${lo}`,       href: N4("hotel",   "italie") },
            { icon: "🎡", title: `Vakantiepark in Nederland voor ${lo}`, href: N4("holiday-park", "netherlands") },
            { icon: "⛺", title: `Camping in Frankrijk met ${lo}`,   href: N4("camping", "frankrijk") },
        ];
    }

    // ---- WAAR-CONTEXT GENERATORS ---------------------------------------
    // Niveau 2 — Waar › <bestemming> krijgt contextuele tabs voor de
    // OVERIGE twee dimensies (Vakantietype, Reisgezelschap) plus een
    // Populair-tab. Bestemmingen-tab wordt verborgen — die is al gegeven.
    //
    // destLabel + destPrep komen uit DATA helpers zodat de NL-zin
    // natuurlijk loopt: "Hotels in Italië", "Camping aan zee",
    // "Wellness in de bergen", "Vakantieparken in Europa".
    function _destSuffix(whereKey, regionKey) {
        // Returns string als " in Italië" / " aan zee" / " in de bergen"
        // (met leading space) zodat de titel-template alleen
        // `Hotels${suffix}` doet.
        if (regionKey && typeof DATA.region === 'function') {
            const def = DATA.region(regionKey);
            if (def) return ` ${def.preposition} ${def.label}`;
        }
        if (whereKey) return ` in ${DATA.label('where', whereKey)}`;
        return '';
    }

    function _destinationRoute(base, whereKey, regionKey) {
        // base = "Niveau3-WaarWat.html" of "Niveau3-WieWaar.html"
        // Geeft "?where=italie" of "?region=europa" terug —
        // hoofdcontext kiest uit region of where.
        if (regionKey) return `${base}?region=${regionKey}`;
        return `${base}?where=${whereKey}`;
    }

    function vakantietypeForWaarContext(whereKey, regionKey) {
        const base = 'Niveau3-WaarWat.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3 = (what) => `${base}?what=${what}&${params}`;
        const suf = _destSuffix(whereKey, regionKey);
        return [
            { icon: "🏨",   title: `Hotels${suf}`,             href: N3("hotel") },
            { icon: "⛺",   title: `Camping${suf}`,            href: N3("camping") },
            { icon: "🎡",   title: `Vakantieparken${suf}`,     href: N3("holiday-park") },
            { icon: "✨",   title: `Glamping${suf}`,           href: N3("glamping") },
            { icon: "💆",   title: `Wellness${suf}`,           href: N3("wellness") },
            { icon: "☀️",   title: `Zonvakanties${suf}`,       href: N3("sun") },
            { icon: "⛷️",   title: `Wintersport${suf}`,        href: N3("winter") },
            { icon: "🧗",   title: `Avontuur${suf}`,           href: N3("adventure-trip") },
            { icon: "🏙️",   title: `Weekendje weg${suf}`,      href: N3("city-trip") },
        ];
    }

    function reisgezelschapForWaarContext(whereKey, regionKey) {
        const base = 'Niveau3-WieWaar.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3 = (who) => `${base}?who=${who}&${params}`;
        const suf = _destSuffix(whereKey, regionKey);
        return [
            { icon: "💑",      title: `Voor koppels${suf}`,                href: N3("couples") },
            { icon: "👨‍👩‍👧", title: `Voor gezinnen met kinderen${suf}`,  href: N3("families-kids") },
            { icon: "👶",      title: `Voor gezinnen met baby's${suf}`,    href: N3("families-babies") },
            { icon: "🧑",      title: `Voor gezinnen met tieners${suf}`,   href: N3("families-teens") },
            { icon: "👫",      title: `Met vrienden${suf}`,                href: N3("friends") },
            { icon: "👴",      title: `Voor senioren${suf}`,               href: N3("seniors") },
            { icon: "🚶",      title: `Alleen reizend${suf}`,              href: N3("solo") },
            { icon: "🐕",      title: `Met huisdier${suf}`,                href: N3("pets") },
        ];
    }

    function populairForWaarContext(whereKey, regionKey) {
        const baseW = 'Niveau3-WaarWat.html';
        const baseE = 'Niveau3-WieWaar.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3WAT = (what) => `${baseW}?what=${what}&${params}`;
        const N3WIE = (who)  => `${baseE}?who=${who}&${params}`;
        const N4    = (who, what) => {
            // Niveau 4 ondersteunt nog geen region-aggregaat in de
            // listing. Voor region context vallen we terug op de
            // Niveau 3 — WaarWat met &sub-less filtering.
            if (regionKey) return `${baseW}?what=${what}&region=${regionKey}`;
            return `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${whereKey}`;
        };
        const suf = _destSuffix(whereKey, regionKey);
        return [
            { icon: "🏨",      title: `Hotels${suf}`,                       href: N3WAT("hotel") },
            { icon: "⛺",      title: `Camping${suf}`,                      href: N3WAT("camping") },
            { icon: "🎡",      title: `Vakantieparken${suf}`,               href: N3WAT("holiday-park") },
            { icon: "💑",      title: `Voor koppels${suf}`,                 href: N3WIE("couples") },
            { icon: "👨‍👩‍👧", title: `Voor gezinnen${suf}`,                href: N3WIE("families-kids") },
            { icon: "👴",      title: `Voor senioren${suf}`,                href: N3WIE("seniors") },
            { icon: "🏨",      title: `Hotels voor koppels${suf}`,          href: N4("couples",       "hotel") },
            { icon: "⛺",      title: `Camping voor gezinnen${suf}`,        href: N4("families-kids", "camping") },
            { icon: "💆",      title: `Wellness voor koppels${suf}`,        href: N4("couples",       "wellness") },
        ];
    }

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
            { icon: "🏙️",     title: "Centrumgelegen Hotels voor vrienden",   href: "Niveau3-WieWat.html?who=friends&what=hotel&sub=city" },
            { icon: "🎨",     title: "Design hotels in Nederland",            href: "Niveau3-WaarWat.html?what=hotel&where=netherlands&sub=design" },
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
            { icon: "🎠",     title: "Kindercamping in Nederland",                 href: "Niveau3-WaarWat.html?what=camping&where=netherlands&sub=kids" },
            { icon: "🏖️",     title: "Camping aan zee met gezinnen",               href: "Niveau3-WieWat.html?who=families-kids&what=camping&sub=zee" },
            { icon: "⛵",     title: "Glamping in Kroatië",                        href: "Niveau3-WaarWat.html?what=camping&where=kroatie&sub=glamping" },
            { icon: "🏊",     title: "Camping met waterpark voor tieners",         href: "Niveau3-WieWat.html?who=families-teens&what=camping&sub=waterpark" },
            { icon: "🍺",     title: "Camping in Duitsland met familie",           href: LVL4("families-kids", "camping", "duitsland") },
        ],
        "holiday-park": [
            { icon: "🏊",     title: "Vakantieparken met zwemparadijs voor gezinnen",   href: "Niveau3-WieWat.html?who=families-kids&what=holiday-park&sub=zwemparadijs" },
            { icon: "🇳🇱",     title: "Vakantieparken in Nederland met kinderen",        href: LVL4("families-kids", "holiday-park", "netherlands") },
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
                // Iedere keuze landt op de NIEUWE Niveau 2 — Wat pagina
                // (eventueel met ?sub= voor refinements). Geen routing
                // meer naar de oude Niveau 1 hotels/campings/
                // vakantieparken landings — die zijn legacy.
                { icon: "⛺",     title: "Op vakantie naar de Camping",         sub: "Vakantietype", href: NIVWAT("camping") },
                { icon: "🌴",     title: "Op vakantie in een resort",           sub: "Vakantietype", href: NIVWAT_SUB("hotel", "resort") },
                { icon: "🏨",     title: "Op vakantie in een hotel",            sub: "Vakantietype", href: NIVWAT("hotel") },
                { icon: "🎡",     title: "Op vakantie in een vakantiepark",     sub: "Vakantietype", href: NIVWAT("holiday-park") },
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
                // Continenten + "aan zee" / "bergen" routen naar
                // Niveau2-Waar.html?region=<aggregaat> zodat de
                // destination als zichzelf gerendeerd wordt (Europa,
                // Azië, Bergen, Aan Zee) i.p.v. de generieke WHERE-
                // overzicht of een toevallig land.
                { icon: "🌍",     title: "Op vakantie in Europa",              sub: "Bestemming", href: "Niveau2-Waar.html?region=europa" },
                { icon: "🌏",     title: "Op vakantie in Azië",                sub: "Bestemming", href: "Niveau2-Waar.html?region=azie" },
                { icon: "🏡",     title: "Op vakantie in eigen land",          sub: "Bestemming", href: "Niveau2-Waar.html?where=netherlands" },
                { icon: "🇳🇱",     title: "Op vakantie in Nederland",           sub: "Bestemming", href: "Niveau2-Waar.html?where=netherlands" },
                { icon: "🦁",     title: "Op vakantie in Afrika",              sub: "Bestemming", href: "Niveau2-Waar.html?region=afrika" },
                { icon: "🏖️",     title: "Vakanties aan zee",                  sub: "Bestemming", href: "Niveau2-Waar.html?region=aan-zee" },
                { icon: "⛰️",     title: "Vakantie in de bergen",              sub: "Bestemming", href: "Niveau2-Waar.html?region=bergen" },
                { icon: "❄️",     title: "Op vakantie in Scandinavië",         sub: "Bestemming", href: "Niveau2-Waar.html?region=scandinavie" },
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
        // ---- CONTEXT RESOLUTION ----
        // Vier mutueel-exclusieve contexten ondersteund:
        //   1. contextWhat (+contextSub) → WAT-context (Niveau 2 — Wat)
        //   2. contextWho                → WIE-context (Niveau 2 — Wie)
        //   3. contextWhere/contextRegion → WAAR-context (Niveau 2 — Waar)
        //   4. (geen) → homepage default (Populair / Reisgezelschap /
        //               Vakantietype / Bestemmingen, generieke items)
        //
        // Eén-context-tegelijk policy: bij overlap wint WAT > WIE > WAAR.
        // De aanroeper hoort er maar één tegelijk te zetten — de override
        // hier is een vangnet.
        const contextWhat = opts.contextWhat && WHAT_REFINEMENTS[opts.contextWhat]
            ? opts.contextWhat
            : null;
        const contextWho    = (!contextWhat && opts.contextWho)
            ? opts.contextWho : null;
        const contextWhere  = (!contextWhat && !contextWho && opts.contextWhere)
            ? opts.contextWhere : null;
        const contextRegion = (!contextWhat && !contextWho && opts.contextRegion)
            ? opts.contextRegion : null;
        const hasContextWie  = !!contextWho;
        const hasContextWaar = !!contextWhere || !!contextRegion;
        const contextWhoLabel = contextWho ? DATA.label('who', contextWho) : '';
        // contextSub = sub-niveau binnen contextWhat (bijv. 'wellness',
        // 'boutique', 'glamping'). Wanneer gezet, regenereren we
        // Reisgezelschap / Bestemmingen / Populair zodat de
        // sub-context behouden blijft in álle URL's en titels.
        //
        // We gebruiken window.safeSubLabel (uit sub-context.js) i.p.v.
        // DATA.subLabel direct. safeSubLabel valt namelijk terug op een
        // inline labelmap wanneer een browser-cache nog een oude
        // site-data.js heeft zonder SITE_DATA.subLabels. Zonder die
        // fallback zou een verouderde site-data.js de sub-context-
        // detectie laten falen — contextSub zou null worden en het
        // blok zou degeneren naar generieke WAT-combinaties (bijv.
        // "Wellness hotels voor koppels" op een Boutique Hotels
        // pagina). Bewuste defensieve programmering.
        const _resolveSubLabel = (typeof window !== 'undefined' && typeof window.safeSubLabel === 'function')
            ? window.safeSubLabel
            : (typeof DATA !== 'undefined' && typeof DATA.subLabel === 'function'
                ? DATA.subLabel.bind(DATA)
                : function () { return ''; });
        const _resolvedSubLabel = (contextWhat && opts.contextSub)
            ? _resolveSubLabel(contextWhat, opts.contextSub)
            : '';
        const contextSub = (contextWhat && opts.contextSub && _resolvedSubLabel)
            ? opts.contextSub
            : null;
        const contextSubLabel = _resolvedSubLabel || '';
        // Diagnostic: zie in DevTools direct of de sub-context goed
        // wordt herkend ("contextSub: 'boutique'" / contextSubLabel:
        // 'Boutique Hotels'). Bij null is dat het smoking gun voor
        // een stale fallback-bug.
        console.log('[inspiration-tabs]', {
            contextWhat,
            inputContextSub: opts.contextSub,
            contextSub,
            contextSubLabel,
            contextWho,
            contextWhere,
            contextRegion,
            resolverUsed: (typeof window !== 'undefined' && typeof window.safeSubLabel === 'function') ? 'safeSubLabel' : 'DATA.subLabel',
        });

        // Tab-volgorde + label-override per context.
        //   • WAT-context: Vakantietype eerst (sub-refinements), dán
        //     Reisgezelschap / Bestemmingen / Populair.
        //   • WIE-context: Reisgezelschap weg (al gekozen). Tabs:
        //     Vakantietype / Bestemmingen / Populair.
        //   • WAAR-context: Bestemmingen weg (al gekozen). Tabs:
        //     Vakantietype / Reisgezelschap / Populair.
        //   • Homepage (geen context): standaard 4 tabs.
        //
        // Populair-tab krijgt op een context-pagina de label
        // "Populaire zoekcombinaties" om duidelijk te maken dat het
        // 2-dim combo's zijn binnen de huidige context.
        let orderedTabIds;
        if (contextWhat) {
            orderedTabIds = ["vakantietype", "reisgezelschap", "bestemmingen", "populair"];
        } else if (hasContextWie) {
            orderedTabIds = ["vakantietype", "bestemmingen", "populair"];
        } else if (hasContextWaar) {
            orderedTabIds = ["vakantietype", "reisgezelschap", "populair"];
        } else {
            orderedTabIds = TABS.map(t => t.id);
        }
        const hasAnyContext = !!contextWhat || hasContextWie || hasContextWaar;
        const TAB_LABEL_OVERRIDES = hasAnyContext
            ? { populair: "Populaire zoekcombinaties" }
            : {};
        function tabsInOrder() {
            return orderedTabIds.map(id => {
                const base = TABS.find(t => t.id === id) || { id, label: id };
                const label = TAB_LABEL_OVERRIDES[id] || base.label;
                return Object.assign({}, base, { label });
            });
        }

        let activeTab = orderedTabIds[0];

        function tabsHTML() {
            return tabsInOrder().map(t => `
                <button type="button"
                        class="it-tab${t.id === activeTab ? ' active' : ''}"
                        data-it-tab="${t.id}"
                        role="tab"
                        aria-selected="${t.id === activeTab}">${escapeHTML(t.label)}</button>
            `).join("");
        }

        function itemsForCurrentTab() {
            const tab = TABS.find(t => t.id === activeTab) || TABS[0];

            // ---- WIE-CONTEXT (Niveau 2 — Wie) ----
            if (hasContextWie) {
                if (activeTab === "vakantietype") return vakantietypeForWieContext(contextWho, contextWhoLabel);
                if (activeTab === "bestemmingen") return bestemmingenForWieContext(contextWho, contextWhoLabel);
                if (activeTab === "populair")     return populairForWieContext(contextWho, contextWhoLabel);
                return tab.items;
            }

            // ---- WAAR-CONTEXT (Niveau 2 — Waar) ----
            if (hasContextWaar) {
                if (activeTab === "vakantietype")  return vakantietypeForWaarContext(contextWhere, contextRegion);
                if (activeTab === "reisgezelschap") return reisgezelschapForWaarContext(contextWhere, contextRegion);
                if (activeTab === "populair")      return populairForWaarContext(contextWhere, contextRegion);
                return tab.items;
            }

            if (!contextWhat) return tab.items;

            // ---- WAT-SUB-CONTEXT (bijv. "Wellness Hotels") ----
            // Álle dynamische tabs preserveren het sub-niveau in
            // label én URL. Vakantietype blijft de refinement-lijst
            // tonen zodat de gebruiker eventueel naar een ander sub-
            // type kan overstappen — daar voegen we geen sub aan toe
            // omdat de refinements zelf al sub-keuzes zijn.
            if (contextSub) {
                if (activeTab === "populair")      return populairForSubContext(contextWhat, contextSub, contextSubLabel);
                if (activeTab === "reisgezelschap") return reisgezelschapForSubContext(contextWhat, contextSub, contextSubLabel);
                if (activeTab === "bestemmingen")   return bestemmingenForSubContext(contextWhat, contextSub, contextSubLabel);
                if (activeTab === "vakantietype" && WHAT_REFINEMENTS[contextWhat]) return WHAT_REFINEMENTS[contextWhat];
                return tab.items;
            }

            // ---- WAT-CONTEXT zonder sub ----
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
