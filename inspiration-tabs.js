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

    // ============================================================
    //  TAG-STYLE LABELS
    // ============================================================
    //  Inspiratie-buttons gebruiken nu een compacte "X + Y + Z"
    //  vorm i.p.v. volzinnen. De maps hieronder mappen elke
    //  dimensie naar een korte, scanbare tag — DATA-labels zijn
    //  vaak te lang voor visueel compacte cards.
    //
    //  Conventie tag-volgorde:
    //    1. WAT of sub (de "wat zoek ik"-tag)
    //    2. WAAR (de "waar"-tag)
    //    3. WIE (de "voor wie"-tag)
    //  Niet alle items hebben alle drie — _tagJoin filtert lege uit.
    // ============================================================
    const TAG_WHO = {
        'couples':         'Koppels',
        'friends':         'Vrienden',
        'seniors':         'Senioren',
        'solo':            'Solo',
        'pets':            'Huisdier',
        'families-kids':   'Familie',
        'families-babies': "Baby's",
        'families-teens':  'Tieners',
    };
    const TAG_WHAT = {
        'hotel':          'Hotel',
        'camping':        'Camping',
        'holiday-park':   'Vakantiepark',
        'glamping':       'Glamping',
        'wellness':       'Wellness',
        'sun':            'Zonvakantie',
        'winter':         'Wintersport',
        'city-trip':      'Citytrip',
        'adventure-trip': 'Avontuur',
    };
    const TAG_SUB = {
        hotel: {
            'boutique':      'Boutique',
            'adult-only':    'Adult Only',
            'wellness':      'Wellness',
            'all-inclusive': 'All-inclusive',
            'design':        'Design',
            'city':          'Centrum',
            'resort':        'Resort',
        },
        camping: {
            'glamping':      'Glamping',
            'waterpark':     'Waterpark',
            'natuur':        'Natuur',
            'kids':          'Kindercamping',
            'honden':        'Hondvriendelijk',
            'zee':           'Aan zee',
        },
        'holiday-park': {
            'zwemparadijs':  'Zwemparadijs',
            'attractiepark': 'Attractiepark',
            'luxe':          'Luxe',
            'kids':          'Kindvriendelijk',
            'natuur':        'Natuur',
            'themaparken':   'Themaparken',
        },
    };
    const TAG_REGION = {
        'europa':      'Europa',
        'azie':        'Azië',
        'afrika':      'Afrika',
        'scandinavie': 'Scandinavië',
        'bergen':      'Bergen',
        'aan-zee':     'Aan zee',
    };
    function tagWho(who)      { return TAG_WHO[who]  || (typeof DATA !== 'undefined' ? DATA.label('who', who) : who) || who; }
    function tagWhat(what)    { return TAG_WHAT[what] || (typeof DATA !== 'undefined' ? DATA.label('what', what) : what) || what; }
    function tagWhere(whereKey, regionKey) {
        if (regionKey) return TAG_REGION[regionKey] || (typeof DATA !== 'undefined' ? DATA.regionDisplayName(regionKey) : regionKey) || regionKey;
        if (whereKey)  return (typeof DATA !== 'undefined' ? DATA.label('where', whereKey) : whereKey) || whereKey;
        return '';
    }
    function tagSub(what, sub) {
        if (!what || !sub) return '';
        if (TAG_SUB[what] && TAG_SUB[what][sub]) return TAG_SUB[what][sub];
        if (typeof window !== 'undefined' && typeof window.safeSubLabel === 'function') return window.safeSubLabel(what, sub) || '';
        if (typeof DATA !== 'undefined' && typeof DATA.subLabel === 'function')          return DATA.subLabel(what, sub) || '';
        return '';
    }
    function _tagJoin(parts) { return parts.filter(Boolean).join(' + '); }

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
    function bestemmingenForWat(what /*, articleLabel */) {
        // Tag-style: "<WAT-tag> + <Bestemming>". Concrete landen →
        // Niveau3-WaarWat met ?where=; aggregaten (continenten +
        // bergen + aan-zee) → ?region=.
        const N3  = (where)  => `Niveau3-WaarWat.html?what=${what}&where=${where}`;
        const N3R = (region) => `Niveau3-WaarWat.html?what=${what}&region=${region}`;
        const w = tagWhat(what);
        return [
            { icon: "🌍",  title: _tagJoin([w, "Europa"]),     href: N3R("europa") },
            { icon: "🌏",  title: _tagJoin([w, "Azië"]),       href: N3R("azie") },
            { icon: "🍺",  title: _tagJoin([w, "Duitsland"]),  href: N3("duitsland") },
            { icon: "🇳🇱",  title: _tagJoin([w, "Nederland"]),  href: N3("netherlands") },
            { icon: "⛰️",  title: _tagJoin([w, "Bergen"]),     href: N3R("bergen") },
            { icon: "🗼",  title: _tagJoin([w, "Frankrijk"]),  href: N3("frankrijk") },
            { icon: "⛵",  title: _tagJoin([w, "Kroatië"]),    href: N3("kroatie") },
            { icon: "🍝",  title: _tagJoin([w, "Italië"]),     href: N3("italie") },
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
    function reisgezelschapForWat(what /*, articleLabel */) {
        // Tag-style: "<WIE-fullLabel> + <WAT-tag>".
        // Voorbeeld: "Gezinnen met tieners + Hotel".
        const w = tagWhat(what);
        return [
            { who: "families-teens",  icon: "🧑",      whoLabel: "Gezinnen met tieners" },
            { who: "couples",         icon: "💑",      whoLabel: "Koppels" },
            { who: "friends",         icon: "👫",      whoLabel: "Vrienden" },
            { who: "families-kids",   icon: "👨‍👩‍👧", whoLabel: "Gezinnen met kinderen" },
            { who: "solo",            icon: "🚶",      whoLabel: "Alleen reizend" },
            { who: "pets",            icon: "🐕",      whoLabel: "Met huisdier" },
            { who: "seniors",         icon: "👴",      whoLabel: "Senioren" },
            { who: "families-babies", icon: "👶",      whoLabel: "Gezinnen met baby's" },
            { who: "families-kids",   icon: "👧",      whoLabel: "Gezinnen met jonge kinderen" },
        ].map(it => ({
            icon: it.icon,
            title: _tagJoin([it.whoLabel, w]),
            href: LVL3_WIEWAT(it.who, what),
        }));
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

    function reisgezelschapForSubContext(what, sub /*, subLabel */) {
        // Tag-style: "<sub-tag> + <WIE-fullLabel>"
        // Voorbeeld: "Wellness + Koppels", "Boutique + Senioren"
        const subTag = tagSub(what, sub);
        const items = [
            { who: "families-teens",  icon: "🧑",      whoLabel: "Gezinnen met tieners" },
            { who: "couples",         icon: "💑",      whoLabel: "Koppels" },
            { who: "friends",         icon: "👫",      whoLabel: "Vrienden" },
            { who: "families-kids",   icon: "👨‍👩‍👧", whoLabel: "Gezinnen met kinderen" },
            { who: "solo",            icon: "🚶",      whoLabel: "Alleen reizend" },
            { who: "pets",            icon: "🐕",      whoLabel: "Met huisdier" },
            { who: "seniors",         icon: "👴",      whoLabel: "Senioren" },
            { who: "families-babies", icon: "👶",      whoLabel: "Gezinnen met baby's" },
            { who: "families-kids",   icon: "👧",      whoLabel: "Gezinnen met jonge kinderen" },
        ];
        return items.map(it => ({
            icon: it.icon,
            title: _tagJoin([subTag, it.whoLabel]),
            href: `Niveau3-WieWat.html?who=${it.who}&what=${what}&sub=${sub}`,
        }));
    }

    function bestemmingenForSubContext(what, sub /*, subLabel */) {
        // Tag-style: "<sub-tag> + <Bestemming>"
        // Voorbeeld: "Wellness + Italië", "Boutique + Bergen"
        const N3  = (where)  => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&where=${where}`;
        const N3R = (region) => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&region=${region}`;
        const s = tagSub(what, sub);
        return [
            { icon: "🌍",  title: _tagJoin([s, "Europa"]),     href: N3R("europa") },
            { icon: "🌏",  title: _tagJoin([s, "Azië"]),       href: N3R("azie") },
            { icon: "🍺",  title: _tagJoin([s, "Duitsland"]),  href: N3("duitsland") },
            { icon: "🇳🇱",  title: _tagJoin([s, "Nederland"]),  href: N3("netherlands") },
            { icon: "⛰️",  title: _tagJoin([s, "Bergen"]),     href: N3R("bergen") },
            { icon: "🗼",  title: _tagJoin([s, "Frankrijk"]),  href: N3("frankrijk") },
            { icon: "⛵",  title: _tagJoin([s, "Kroatië"]),    href: N3("kroatie") },
            { icon: "🍝",  title: _tagJoin([s, "Italië"]),     href: N3("italie") },
        ];
    }

    function populairForSubContext(what, sub /*, subLabel */) {
        // 9 curated combos. 2-dim items: "<sub> + <WIE>" of "<sub> +
        // <WAAR>". 3-dim items (Niveau 4): "<sub> + <WAAR> + <WIE-short>".
        // Voorbeeld: "Wellness + Italië + Koppels".
        const N3WIE  = (who)   => `Niveau3-WieWat.html?who=${who}&what=${what}&sub=${sub}`;
        const N3WAAR = (where) => `Niveau3-WaarWat.html?what=${what}&sub=${sub}&where=${where}`;
        const N4     = (who, where) =>
            `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}&sub=${sub}`;
        const s = tagSub(what, sub);
        return [
            { icon: "💑",      title: _tagJoin([s, "Koppels"]),                 href: N3WIE("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([s, "Familie"]),                 href: N3WIE("families-kids") },
            { icon: "👴",      title: _tagJoin([s, "Senioren"]),                href: N3WIE("seniors") },
            { icon: "🍝",      title: _tagJoin([s, "Italië"]),                  href: N3WAAR("italie") },
            { icon: "🗼",      title: _tagJoin([s, "Frankrijk"]),               href: N3WAAR("frankrijk") },
            { icon: "🇳🇱",      title: _tagJoin([s, "Nederland"]),               href: N3WAAR("netherlands") },
            { icon: "💑",      title: _tagJoin([s, "Italië", "Koppels"]),       href: N4("couples",       "italie") },
            { icon: "👨‍👩‍👧", title: _tagJoin([s, "Frankrijk", "Familie"]),    href: N4("families-kids", "frankrijk") },
            { icon: "👴",      title: _tagJoin([s, "Spanje", "Senioren"]),      href: N4("seniors",       "spanje") },
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
        // Tag-style: "<WAT-tag> + <WIE-fullLabel>"
        const N3 = (what) => `Niveau3-WieWat.html?who=${who}&what=${what}`;
        const wL = whoLabel || tagWho(who);
        return [
            { icon: "🏨",   title: _tagJoin(["Hotel",        wL]), href: N3("hotel") },
            { icon: "⛺",   title: _tagJoin(["Camping",      wL]), href: N3("camping") },
            { icon: "🎡",   title: _tagJoin(["Vakantiepark", wL]), href: N3("holiday-park") },
            { icon: "✨",   title: _tagJoin(["Glamping",     wL]), href: N3("glamping") },
            { icon: "💆",   title: _tagJoin(["Wellness",     wL]), href: N3("wellness") },
            { icon: "☀️",   title: _tagJoin(["Zonvakantie",  wL]), href: N3("sun") },
            { icon: "⛷️",   title: _tagJoin(["Wintersport",  wL]), href: N3("winter") },
            { icon: "🧗",   title: _tagJoin(["Avontuur",     wL]), href: N3("adventure-trip") },
            { icon: "🏙️",   title: _tagJoin(["Citytrip",     wL]), href: N3("city-trip") },
        ];
    }

    function bestemmingenForWieContext(who, whoLabel) {
        // Tag-style: "<Bestemming> + <WIE-fullLabel>"
        const N3W = (where)  => `Niveau3-WieWaar.html?who=${who}&where=${where}`;
        const N3R = (region) => `Niveau3-WieWaar.html?who=${who}&region=${region}`;
        const wL = whoLabel || tagWho(who);
        return [
            { icon: "🌍",   title: _tagJoin(["Europa",     wL]), href: N3R("europa") },
            { icon: "🇳🇱",   title: _tagJoin(["Nederland",  wL]), href: N3W("netherlands") },
            { icon: "🍝",   title: _tagJoin(["Italië",     wL]), href: N3W("italie") },
            { icon: "🗼",   title: _tagJoin(["Frankrijk",  wL]), href: N3W("frankrijk") },
            { icon: "🥘",   title: _tagJoin(["Spanje",     wL]), href: N3W("spanje") },
            { icon: "🍺",   title: _tagJoin(["Duitsland",  wL]), href: N3W("duitsland") },
            { icon: "⛰️",   title: _tagJoin(["Bergen",     wL]), href: N3R("bergen") },
            { icon: "🏖️",   title: _tagJoin(["Aan zee",    wL]), href: N3R("aan-zee") },
        ];
    }

    function populairForWieContext(who, whoLabel) {
        // 2-dim items gebruiken WIE-fullLabel; 3-dim items gebruiken
        // WIE-short tag voor compactheid. Voorbeeld 3-dim: "Hotel +
        // Italië + Senioren".
        const N3WIE  = (what)  => `Niveau3-WieWat.html?who=${who}&what=${what}`;
        const N3WAAR = (where) => `Niveau3-WieWaar.html?who=${who}&where=${where}`;
        const N3REG  = (region)=> `Niveau3-WieWaar.html?who=${who}&region=${region}`;
        const N4     = (what, where) =>
            `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}`;
        const wL = whoLabel || tagWho(who);
        const wS = tagWho(who);
        return [
            { icon: "🏨", title: _tagJoin(["Hotel",        wL]),               href: N3WIE("hotel") },
            { icon: "⛺", title: _tagJoin(["Camping",      wL]),               href: N3WIE("camping") },
            { icon: "💆", title: _tagJoin(["Wellness",     wL]),               href: N3WIE("wellness") },
            { icon: "🍝", title: _tagJoin(["Italië",       wL]),               href: N3WAAR("italie") },
            { icon: "🇳🇱", title: _tagJoin(["Nederland",    wL]),               href: N3WAAR("netherlands") },
            { icon: "🌍", title: _tagJoin(["Europa",       wL]),               href: N3REG("europa") },
            { icon: "🏨", title: _tagJoin(["Hotel",        "Italië", wS]),     href: N4("hotel",        "italie") },
            { icon: "🎡", title: _tagJoin(["Vakantiepark", "Nederland", wS]),  href: N4("holiday-park", "netherlands") },
            { icon: "⛺", title: _tagJoin(["Camping",      "Frankrijk", wS]),  href: N4("camping",      "frankrijk") },
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
        // Tag-style: "<WAT-tag> + <Bestemming>"
        const base = 'Niveau3-WaarWat.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3 = (what) => `${base}?what=${what}&${params}`;
        const dest = tagWhere(whereKey, regionKey);
        return [
            { icon: "🏨",   title: _tagJoin(["Hotel",        dest]), href: N3("hotel") },
            { icon: "⛺",   title: _tagJoin(["Camping",      dest]), href: N3("camping") },
            { icon: "🎡",   title: _tagJoin(["Vakantiepark", dest]), href: N3("holiday-park") },
            { icon: "✨",   title: _tagJoin(["Glamping",     dest]), href: N3("glamping") },
            { icon: "💆",   title: _tagJoin(["Wellness",     dest]), href: N3("wellness") },
            { icon: "☀️",   title: _tagJoin(["Zonvakantie",  dest]), href: N3("sun") },
            { icon: "⛷️",   title: _tagJoin(["Wintersport",  dest]), href: N3("winter") },
            { icon: "🧗",   title: _tagJoin(["Avontuur",     dest]), href: N3("adventure-trip") },
            { icon: "🏙️",   title: _tagJoin(["Citytrip",     dest]), href: N3("city-trip") },
        ];
    }

    function reisgezelschapForWaarContext(whereKey, regionKey) {
        // Tag-style: "<Bestemming> + <WIE-fullLabel>"
        const base = 'Niveau3-WieWaar.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3 = (who) => `${base}?who=${who}&${params}`;
        const dest = tagWhere(whereKey, regionKey);
        return [
            { icon: "💑",      title: _tagJoin([dest, "Koppels"]),                    href: N3("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([dest, "Gezinnen met kinderen"]),     href: N3("families-kids") },
            { icon: "👶",      title: _tagJoin([dest, "Gezinnen met baby's"]),       href: N3("families-babies") },
            { icon: "🧑",      title: _tagJoin([dest, "Gezinnen met tieners"]),      href: N3("families-teens") },
            { icon: "👫",      title: _tagJoin([dest, "Vrienden"]),                   href: N3("friends") },
            { icon: "👴",      title: _tagJoin([dest, "Senioren"]),                   href: N3("seniors") },
            { icon: "🚶",      title: _tagJoin([dest, "Alleen reizend"]),            href: N3("solo") },
            { icon: "🐕",      title: _tagJoin([dest, "Met huisdier"]),              href: N3("pets") },
        ];
    }

    function populairForWaarContext(whereKey, regionKey) {
        // 2-dim items: "<WAT> + <Bestemming>" of "<Bestemming> + <WIE>".
        // 3-dim items: "<WAT> + <Bestemming> + <WIE-short>".
        const baseW = 'Niveau3-WaarWat.html';
        const baseE = 'Niveau3-WieWaar.html';
        const params = regionKey ? `region=${regionKey}` : `where=${whereKey}`;
        const N3WAT = (what) => `${baseW}?what=${what}&${params}`;
        const N3WIE = (who)  => `${baseE}?who=${who}&${params}`;
        const N4    = (who, what) => {
            if (regionKey) return `${baseW}?what=${what}&region=${regionKey}`;
            return `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${whereKey}`;
        };
        const dest = tagWhere(whereKey, regionKey);
        return [
            { icon: "🏨",      title: _tagJoin(["Hotel",        dest]),                  href: N3WAT("hotel") },
            { icon: "⛺",      title: _tagJoin(["Camping",      dest]),                  href: N3WAT("camping") },
            { icon: "🎡",      title: _tagJoin(["Vakantiepark", dest]),                  href: N3WAT("holiday-park") },
            { icon: "💑",      title: _tagJoin([dest, "Koppels"]),                       href: N3WIE("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([dest, "Familie"]),                       href: N3WIE("families-kids") },
            { icon: "👴",      title: _tagJoin([dest, "Senioren"]),                      href: N3WIE("seniors") },
            { icon: "🏨",      title: _tagJoin(["Hotel",        dest, "Koppels"]),       href: N4("couples",       "hotel") },
            { icon: "⛺",      title: _tagJoin(["Camping",      dest, "Familie"]),       href: N4("families-kids", "camping") },
            { icon: "💆",      title: _tagJoin(["Wellness",     dest, "Koppels"]),       href: N4("couples",       "wellness") },
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
    // ---- GENERIC WAT GENERATORS ---------------------------------------
    // Voor WAT-keys zonder eigen entry in WHAT_REFINEMENTS / POPULAIR_BY_WAT
    // (bijv. sun / winter / glamping / adventure-trip / city-trip /
    // wellness) val je nu niet meer terug op de homepage-default tabs —
    // we genereren de tabs data-gestuurd op basis van de actieve WAT.
    function genericPopulairForWat(what /*, whatLabel */) {
        // 9 curated combo's: 3× WIE-only (WAT+WIE), 3× WAAR-only
        // (WAT+WAAR), 3× 3-dim (WIE+WAAR via Niveau 4).
        const w = tagWhat(what);
        const N3WIE  = (who)   => `Niveau3-WieWat.html?who=${who}&what=${what}`;
        const N3WAAR = (where) => `Niveau3-WaarWat.html?what=${what}&where=${where}`;
        const N3R    = (region)=> `Niveau3-WaarWat.html?what=${what}&region=${region}`;
        const N4     = (who, where) => `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${where}`;
        return [
            { icon: "💑",      title: _tagJoin([w, "Koppels"]),                  href: N3WIE("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([w, "Familie"]),                  href: N3WIE("families-kids") },
            { icon: "👴",      title: _tagJoin([w, "Senioren"]),                 href: N3WIE("seniors") },
            { icon: "🍝",      title: _tagJoin([w, "Italië"]),                   href: N3WAAR("italie") },
            { icon: "🇳🇱",      title: _tagJoin([w, "Nederland"]),                href: N3WAAR("netherlands") },
            { icon: "🗼",      title: _tagJoin([w, "Frankrijk"]),                href: N3WAAR("frankrijk") },
            { icon: "🌍",      title: _tagJoin([w, "Europa"]),                   href: N3R("europa") },
            { icon: "🏨",      title: _tagJoin([w, "Italië",    "Koppels"]),     href: N4("couples",       "italie") },
            { icon: "⛺",      title: _tagJoin([w, "Frankrijk", "Familie"]),     href: N4("families-kids", "frankrijk") },
        ];
    }
    // genericVakantietype: cross-suggesties naar andere WAT-types
    // wanneer de huidige WAT geen sub-refinements heeft.
    function genericVakantietypeForWat(what) {
        const sib = ['hotel','camping','holiday-park','glamping','wellness','sun','winter','adventure-trip','city-trip']
            .filter(k => k !== what);
        return sib.map(k => ({
            icon: _whatIcon(k),
            title: tagWhat(k),
            href: `Niveau2-Wat.html?what=${k}`,
        }));
    }

    // POPULAIR_BY_WAT — curated 9-item lijst per WAT-categorie.
    // Tag-style labels: "<sub-of-WAT-tag> + <Bestemming-of-WIE>".
    // 3-dim combinaties: "<sub> + <Bestemming> + <WIE-short>".
    const POPULAIR_BY_WAT = {
        hotel: [
            { icon: "💆",     title: _tagJoin(["Wellness",  "Koppels"]),                href: "Niveau3-WieWat.html?who=couples&what=hotel&sub=wellness" },
            { icon: "🍝",     title: _tagJoin(["Hotel",     "Italië", "Familie"]),      href: LVL4("families-kids", "hotel", "italie") },
            { icon: "🛎️",     title: _tagJoin(["Boutique",  "Frankrijk"]),              href: "Niveau3-WaarWat.html?what=hotel&where=frankrijk&sub=boutique" },
            { icon: "🍽️",     title: _tagJoin(["All-inclusive", "Spanje"]),             href: "Niveau3-WaarWat.html?what=hotel&where=spanje&sub=all-inclusive" },
            { icon: "🥂",     title: _tagJoin(["Adult Only", "Koppels"]),               href: "Niveau3-WieWat.html?who=couples&what=hotel&sub=adult-only" },
            { icon: "🏙️",     title: _tagJoin(["Centrum",   "Vrienden"]),               href: "Niveau3-WieWat.html?who=friends&what=hotel&sub=city" },
            { icon: "🎨",     title: _tagJoin(["Design",    "Nederland"]),              href: "Niveau3-WaarWat.html?what=hotel&where=netherlands&sub=design" },
            { icon: "👴",     title: _tagJoin(["Hotel",     "Kroatië", "Senioren"]),    href: LVL4("seniors", "hotel", "kroatie") },
            { icon: "🌴",     title: _tagJoin(["Resort",    "Familie"]),                href: "Niveau3-WieWat.html?who=families-kids&what=hotel&sub=resort" },
        ],
        camping: [
            { icon: "✨",     title: _tagJoin(["Glamping",        "Koppels"]),               href: "Niveau3-WieWat.html?who=couples&what=camping&sub=glamping" },
            { icon: "🍝",     title: _tagJoin(["Camping",         "Italië", "Familie"]),     href: LVL4("families-kids", "camping", "italie") },
            { icon: "🐕",     title: _tagJoin(["Hondvriendelijk", "Frankrijk"]),             href: "Niveau3-WaarWat.html?what=camping&where=frankrijk&sub=honden" },
            { icon: "🌲",     title: _tagJoin(["Natuur",          "Vrienden"]),              href: "Niveau3-WieWat.html?who=friends&what=camping&sub=natuur" },
            { icon: "🎠",     title: _tagJoin(["Kindercamping",   "Nederland"]),             href: "Niveau3-WaarWat.html?what=camping&where=netherlands&sub=kids" },
            { icon: "🏖️",     title: _tagJoin(["Aan zee",         "Familie"]),               href: "Niveau3-WieWat.html?who=families-kids&what=camping&sub=zee" },
            { icon: "⛵",     title: _tagJoin(["Glamping",        "Kroatië"]),                href: "Niveau3-WaarWat.html?what=camping&where=kroatie&sub=glamping" },
            { icon: "🏊",     title: _tagJoin(["Waterpark",       "Tieners"]),               href: "Niveau3-WieWat.html?who=families-teens&what=camping&sub=waterpark" },
            { icon: "🍺",     title: _tagJoin(["Camping",         "Duitsland", "Familie"]),  href: LVL4("families-kids", "camping", "duitsland") },
        ],
        "holiday-park": [
            { icon: "🏊",     title: _tagJoin(["Zwemparadijs",    "Familie"]),                  href: "Niveau3-WieWat.html?who=families-kids&what=holiday-park&sub=zwemparadijs" },
            { icon: "🇳🇱",     title: _tagJoin(["Vakantiepark",    "Nederland", "Familie"]),    href: LVL4("families-kids", "holiday-park", "netherlands") },
            { icon: "✨",     title: _tagJoin(["Luxe",            "Koppels"]),                  href: "Niveau3-WieWat.html?who=couples&what=holiday-park&sub=luxe" },
            { icon: "🎡",     title: _tagJoin(["Attractiepark",   "Tieners"]),                  href: "Niveau3-WieWat.html?who=families-teens&what=holiday-park&sub=attractiepark" },
            { icon: "👶",     title: _tagJoin(["Kindvriendelijk", "Duitsland"]),                href: "Niveau3-WaarWat.html?what=holiday-park&where=duitsland&sub=kids" },
            { icon: "🌲",     title: _tagJoin(["Natuur",          "Senioren"]),                 href: "Niveau3-WieWat.html?who=seniors&what=holiday-park&sub=natuur" },
            { icon: "🍫",     title: _tagJoin(["Vakantiepark",    "België", "Familie"]),       href: LVL4("families-kids", "holiday-park", "belgie") },
            { icon: "🎢",     title: _tagJoin(["Themaparken",     "Familie"]),                  href: "Niveau3-WieWat.html?who=families-kids&what=holiday-park&sub=themaparken" },
            { icon: "🗼",     title: _tagJoin(["Vakantiepark",    "Frankrijk", "Familie"]),    href: LVL4("families-kids", "holiday-park", "frankrijk") },
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
                { icon: "🧑",     title: "Met tieners",        sub: "Reisgezelschap", href: NIVWIE("families-teens") },
                { icon: "💑",     title: "Als koppel",         sub: "Reisgezelschap", href: NIVWIE("couples") },
                { icon: "👫",     title: "Met vrienden",       sub: "Reisgezelschap", href: NIVWIE("friends") },
                { icon: "👨‍👩‍👧", title: "Met familie",        sub: "Reisgezelschap", href: NIVWIE("families-kids") },
                { icon: "🚶",     title: "Alleen reizend",     sub: "Reisgezelschap", href: NIVWIE("solo") },
                { icon: "🐕",     title: "Met huisdieren",     sub: "Reisgezelschap", href: NIVWIE("pets") },
                { icon: "👴",     title: "Met senioren",       sub: "Reisgezelschap", href: NIVWIE("seniors") },
                { icon: "👶",     title: "Met baby's",         sub: "Reisgezelschap", href: NIVWIE("families-babies") },
                { icon: "👧",     title: "Met jonge kinderen", sub: "Reisgezelschap", href: NIVWIE("families-kids") },
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
                { icon: "⛺",     title: "Camping",       sub: "Vakantietype", href: NIVWAT("camping") },
                { icon: "🌴",     title: "Resort",        sub: "Vakantietype", href: NIVWAT_SUB("hotel", "resort") },
                { icon: "🏨",     title: "Hotel",         sub: "Vakantietype", href: NIVWAT("hotel") },
                { icon: "🎡",     title: "Vakantiepark",  sub: "Vakantietype", href: NIVWAT("holiday-park") },
                { icon: "✨",     title: "Glamping",      sub: "Vakantietype", href: NIVWAT("glamping") },
                { icon: "🌲",     title: "In de natuur",  sub: "Vakantietype", href: NIVWAT("adventure-trip") },
                { icon: "☀️",     title: "Zonvakantie",   sub: "Vakantietype", href: NIVWAT("sun") },
                { icon: "⛷️",     title: "Wintersport",   sub: "Vakantietype", href: NIVWAT("winter") },
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
                { icon: "🌍",     title: "Europa",       sub: "Bestemming", href: "Niveau2-Waar.html?region=europa" },
                { icon: "🌏",     title: "Azië",         sub: "Bestemming", href: "Niveau2-Waar.html?region=azie" },
                { icon: "🏡",     title: "Eigen land",   sub: "Bestemming", href: "Niveau2-Waar.html?where=netherlands" },
                { icon: "🇳🇱",     title: "Nederland",    sub: "Bestemming", href: "Niveau2-Waar.html?where=netherlands" },
                { icon: "🦁",     title: "Afrika",       sub: "Bestemming", href: "Niveau2-Waar.html?region=afrika" },
                { icon: "🏖️",     title: "Aan zee",      sub: "Bestemming", href: "Niveau2-Waar.html?region=aan-zee" },
                { icon: "⛰️",     title: "In de bergen", sub: "Bestemming", href: "Niveau2-Waar.html?region=bergen" },
                { icon: "❄️",     title: "Scandinavië",  sub: "Bestemming", href: "Niveau2-Waar.html?region=scandinavie" },
            ],
        },
    ];

    // ============================================================
    //  DUAL-CONTEXT GENERATORS (Niveau 3 — twee actieve dimensies)
    // ============================================================
    //  Op een Niveau 3 pagina heeft de bezoeker al twee dimensies
    //  vastgelegd. De Inspiratie-tabs voegen de derde dimensie toe of
    //  swappen sub-refinements binnen de huidige WAT. Iedere URL
    //  preserveert de actieve context (geen verlies van who/what/sub
    //  bij doorklik). De Populair-tab is met de hand gemodelleerd in
    //  9-item-blokken zodat de combo's curated en non-redundant zijn.
    //
    //  Tab-volgorde voor dual-context (zie renderInspirationTabs):
    //    1. Populaire zoekcombinaties   ← primaire discovery
    //    2. Reisgezelschap              (of WAT, afhankelijk van mix)
    //    3. Bestemmingen
    //    4. Vakantietype
    //
    //  De Populair-items zijn opgebouwd als 3-3-3 mix:
    //    • 3× derde dimensie toevoegen (preserveert beide actieve)
    //    • 3× sub-variant binnen huidige WAT (alleen voor WAT-context)
    //    • 3× cross-pollination (drop één dimensie, voeg andere toe)
    //  Hierdoor blijft de tab interessant ook als de actieve combinatie
    //  weinig Niveau-4 alternatieven heeft.

    function _safeSubKeys(what) {
        const map = (typeof SITE_DATA !== 'undefined' && SITE_DATA.subLabels && SITE_DATA.subLabels[what]) || {};
        return Object.keys(map);
    }
    function _resolveSubLabelGlobal(what, sub) {
        if (typeof window !== 'undefined' && typeof window.safeSubLabel === 'function') return window.safeSubLabel(what, sub) || '';
        if (typeof DATA !== 'undefined' && typeof DATA.subLabel === 'function') return DATA.subLabel(what, sub) || '';
        return '';
    }
    function _whatIcon(what)  { return (typeof SITE_DATA !== 'undefined' && SITE_DATA.icons && SITE_DATA.icons[what]) || '📌'; }
    function _whoIcon(who)    { return (typeof SITE_DATA !== 'undefined' && SITE_DATA.icons && SITE_DATA.icons[who])  || '👤'; }
    function _destSuffixDual(whereKey, regionKey) {
        // Reuse the existing _destSuffix definition (see WAAR-context
        // generators above). This local copy is intentional — keeps
        // the dual-context generators self-contained for refactoring.
        if (regionKey && typeof DATA.region === 'function') {
            const def = DATA.region(regionKey);
            if (def) return ` ${def.preposition} ${def.label}`;
        }
        if (whereKey) return ` in ${DATA.label('where', whereKey)}`;
        return '';
    }
    function _subParam(sub) { return sub ? `&sub=${sub}` : ''; }

    // ---- WIE + WAT dual-context (Niveau 3 — WieWat) ----
    function populairForWieWatContext(who, whoLabel, what, whatLabel, sub, subLabel) {
        // Tag-style. Primary tag = sub (kort, bv. "Boutique") of WAT
        // ("Hotel"). 3-dim items gebruiken WIE-short. Voorbeeld:
        // "Boutique + Italië + Solo".
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const wS = tagWho(who);
        const sp = _subParam(sub);
        const N4    = (w) => `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${w}${sp}`;
        const N3R   = (r) => `Niveau3-WaarWat.html?what=${what}&region=${r}${sp}`;
        const N3SUB = (s) => `Niveau3-WieWat.html?who=${who}&what=${what}&sub=${s}`;
        // 3 sub-varianten binnen huidige WAT (verander sub, hou WIE)
        const subItems = _safeSubKeys(what).filter(k => k !== sub).slice(0, 3).map(k => {
            const t = tagSub(what, k);
            return t ? { icon: _whatIcon(what), title: _tagJoin([t, wS]), href: N3SUB(k) } : null;
        }).filter(Boolean);
        return [
            { icon: "🍝", title: _tagJoin([primary, "Italië",    wS]),  href: N4("italie") },
            { icon: "🗼", title: _tagJoin([primary, "Frankrijk", wS]),  href: N4("frankrijk") },
            { icon: "🇳🇱", title: _tagJoin([primary, "Nederland", wS]),  href: N4("netherlands") },
            { icon: "🥘", title: _tagJoin([primary, "Spanje",    wS]),  href: N4("spanje") },
            { icon: "🏖️", title: _tagJoin([primary, "Aan zee",   wS]),  href: N3R("aan-zee") },
            { icon: "⛰️", title: _tagJoin([primary, "Bergen",    wS]),  href: N3R("bergen") },
            ...subItems,
        ].slice(0, 9);
    }
    function reisgezelschapForWieWatContext(who, what, whatLabel, sub, subLabel) {
        // Tag-style: "<sub-of-WAT> + <WIE-fullLabel>". Excludes huidige WIE.
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const sp = _subParam(sub);
        const N3 = (otherWho) => `Niveau3-WieWat.html?who=${otherWho}&what=${what}${sp}`;
        const allWho = [
            { who: "couples",         icon: "💑",      lbl: "Koppels" },
            { who: "families-kids",   icon: "👨‍👩‍👧", lbl: "Gezinnen met kinderen" },
            { who: "families-teens",  icon: "🧑",      lbl: "Gezinnen met tieners" },
            { who: "families-babies", icon: "👶",      lbl: "Gezinnen met baby's" },
            { who: "friends",         icon: "👫",      lbl: "Vrienden" },
            { who: "seniors",         icon: "👴",      lbl: "Senioren" },
            { who: "solo",            icon: "🚶",      lbl: "Alleen reizend" },
            { who: "pets",            icon: "🐕",      lbl: "Met huisdier" },
        ].filter(w => w.who !== who);
        return allWho.slice(0, 9).map(w => ({
            icon: w.icon, title: _tagJoin([primary, w.lbl]), href: N3(w.who),
        }));
    }
    function bestemmingenForWieWatContext(who, whoLabel, what, sub, subLabel) {
        // Tag-style 3-dim: "<sub-of-WAT> + <Bestemming> + <WIE-short>"
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const wS = tagWho(who);
        const sp = _subParam(sub);
        const N4  = (w) => `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${w}${sp}`;
        const N3R = (r) => `Niveau3-WaarWat.html?what=${what}&region=${r}${sp}`;
        return [
            { icon: "🌍", title: _tagJoin([primary, "Europa",    wS]), href: N3R("europa") },
            { icon: "🍝", title: _tagJoin([primary, "Italië",    wS]), href: N4("italie") },
            { icon: "🗼", title: _tagJoin([primary, "Frankrijk", wS]), href: N4("frankrijk") },
            { icon: "🥘", title: _tagJoin([primary, "Spanje",    wS]), href: N4("spanje") },
            { icon: "🍺", title: _tagJoin([primary, "Duitsland", wS]), href: N4("duitsland") },
            { icon: "🇳🇱", title: _tagJoin([primary, "Nederland", wS]), href: N4("netherlands") },
            { icon: "⛵", title: _tagJoin([primary, "Kroatië",   wS]), href: N4("kroatie") },
            { icon: "🏖️", title: _tagJoin([primary, "Aan zee",   wS]), href: N3R("aan-zee") },
            { icon: "⛰️", title: _tagJoin([primary, "Bergen",    wS]), href: N3R("bergen") },
        ];
    }
    function vakantietypeForWieWatContext(who, whoLabel, what) {
        // Sub-varianten met huidige WIE preserved.
        // Tag-style: "<sub-tag> + <WIE-fullLabel>"
        const subs = (typeof SITE_DATA !== 'undefined' && SITE_DATA.subLabels && SITE_DATA.subLabels[what]) || null;
        const wL = whoLabel || tagWho(who);
        if (subs) {
            return Object.entries(subs).map(([k]) => {
                const t = tagSub(what, k);
                return {
                    icon: _whatIcon(what),
                    title: _tagJoin([t, wL]),
                    href: `Niveau3-WieWat.html?who=${who}&what=${what}&sub=${k}`,
                };
            }).slice(0, 9);
        }
        return vakantietypeForWieContext(who, whoLabel);
    }

    // ---- WAT + WAAR dual-context (Niveau 3 — WaarWat) ----
    function populairForWatWaarContext(what, whatLabel, sub, subLabel, whereKey, regionKey) {
        // Tag-style: primary tag = sub of WAT. 3-dim: "<primary> +
        // <Bestemming> + <WIE-short>". 2-dim sub-varianten:
        // "<sub-variant> + <Bestemming>". Cross-pollination drops
        // WAAR: "<primary> + <WIE-full>".
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const dest = tagWhere(whereKey, regionKey);
        const sp = _subParam(sub);
        const destParam = whereKey ? `where=${whereKey}` : `region=${regionKey}`;
        const N4   = (w) => whereKey
            ? `Niveau4-WieWatWaar.html?who=${w}&what=${what}&where=${whereKey}${sp}`
            : `Niveau3-WaarWat.html?who=${w}&what=${what}&region=${regionKey}${sp}`;
        const N3SUB = (s) => `Niveau3-WaarWat.html?what=${what}&${destParam}&sub=${s}`;
        const N3WIE = (w) => `Niveau3-WieWat.html?who=${w}&what=${what}${sp}`;
        const subItems = _safeSubKeys(what).filter(k => k !== sub).slice(0, 3).map(k => {
            const t = tagSub(what, k);
            return t ? { icon: _whatIcon(what), title: _tagJoin([t, dest]), href: N3SUB(k) } : null;
        }).filter(Boolean);
        return [
            { icon: "💑",      title: _tagJoin([primary, dest, "Koppels"]),     href: N4("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([primary, dest, "Familie"]),     href: N4("families-kids") },
            { icon: "👴",      title: _tagJoin([primary, dest, "Senioren"]),    href: N4("seniors") },
            ...subItems,
            { icon: "👫", title: _tagJoin([primary, "Vrienden"]),        href: N3WIE("friends") },
            { icon: "🚶", title: _tagJoin([primary, "Alleen reizend"]),  href: N3WIE("solo") },
            { icon: "🐕", title: _tagJoin([primary, "Met huisdier"]),    href: N3WIE("pets") },
        ].slice(0, 9);
    }
    function reisgezelschapForWatWaarContext(what, whatLabel, sub, subLabel, whereKey, regionKey) {
        // Tag-style 3-dim: "<primary> + <Bestemming> + <WIE-fullLabel>"
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const dest = tagWhere(whereKey, regionKey);
        const sp = _subParam(sub);
        const N4 = (w) => whereKey
            ? `Niveau4-WieWatWaar.html?who=${w}&what=${what}&where=${whereKey}${sp}`
            : `Niveau3-WaarWat.html?who=${w}&what=${what}&region=${regionKey}${sp}`;
        return [
            { icon: "💑",      title: _tagJoin([primary, dest, "Koppels"]),                    href: N4("couples") },
            { icon: "👨‍👩‍👧", title: _tagJoin([primary, dest, "Gezinnen met kinderen"]),     href: N4("families-kids") },
            { icon: "🧑",      title: _tagJoin([primary, dest, "Gezinnen met tieners"]),      href: N4("families-teens") },
            { icon: "👶",      title: _tagJoin([primary, dest, "Gezinnen met baby's"]),       href: N4("families-babies") },
            { icon: "👫",      title: _tagJoin([primary, dest, "Vrienden"]),                   href: N4("friends") },
            { icon: "👴",      title: _tagJoin([primary, dest, "Senioren"]),                   href: N4("seniors") },
            { icon: "🚶",      title: _tagJoin([primary, dest, "Alleen reizend"]),            href: N4("solo") },
            { icon: "🐕",      title: _tagJoin([primary, dest, "Met huisdier"]),              href: N4("pets") },
        ];
    }
    function bestemmingenForWatWaarContext(what, whatLabel, sub, subLabel, whereKey, regionKey) {
        // Tag-style: "<primary> + <Andere bestemming>"
        const primary = sub ? tagSub(what, sub) : tagWhat(what);
        const sp = _subParam(sub);
        const N3 = (w) => `Niveau3-WaarWat.html?what=${what}&where=${w}${sp}`;
        const N3R = (r) => `Niveau3-WaarWat.html?what=${what}&region=${r}${sp}`;
        const allWhere = [
            { key: "italie",      icon: "🍝",  label: "Italië" },
            { key: "frankrijk",   icon: "🗼",  label: "Frankrijk" },
            { key: "spanje",      icon: "🥘",  label: "Spanje" },
            { key: "duitsland",   icon: "🍺",  label: "Duitsland" },
            { key: "kroatie",     icon: "⛵",  label: "Kroatië" },
            { key: "netherlands", icon: "🇳🇱",  label: "Nederland" },
            { key: "belgie",      icon: "🍫",  label: "België" },
            { key: "portugal",    icon: "🏖️",  label: "Portugal" },
        ].filter(w => w.key !== whereKey).slice(0, 6);
        const regionItems = [
            { key: "europa",  icon: "🌍",  label: "Europa" },
            { key: "bergen",  icon: "⛰️",  label: "Bergen" },
            { key: "aan-zee", icon: "🏖️",  label: "Aan zee" },
        ].filter(r => r.key !== regionKey).slice(0, 3);
        return [
            ...allWhere.map(w => ({
                icon: w.icon, title: _tagJoin([primary, w.label]), href: N3(w.key),
            })),
            ...regionItems.map(r => ({
                icon: r.icon, title: _tagJoin([primary, r.label]), href: N3R(r.key),
            })),
        ].slice(0, 9);
    }
    function vakantietypeForWatWaarContext(what, whereKey, regionKey) {
        // Tag-style: "<sub-tag> + <Bestemming>"
        const subs = (typeof SITE_DATA !== 'undefined' && SITE_DATA.subLabels && SITE_DATA.subLabels[what]) || null;
        const dest = tagWhere(whereKey, regionKey);
        const destParam = whereKey ? `where=${whereKey}` : `region=${regionKey}`;
        if (subs) {
            return Object.entries(subs).map(([k]) => {
                const t = tagSub(what, k);
                return {
                    icon: _whatIcon(what),
                    title: _tagJoin([t, dest]),
                    href: `Niveau3-WaarWat.html?what=${what}&${destParam}&sub=${k}`,
                };
            }).slice(0, 9);
        }
        return vakantietypeForWaarContext(whereKey, regionKey);
    }

    // ---- WIE + WAAR dual-context (Niveau 3 — WieWaar) ----
    function populairForWieWaarContext(who, whoLabel, whereKey, regionKey) {
        // 3-dim items: "<WAT> + <Bestemming> + <WIE-short>".
        // 2-dim items (drop WIE): "<WAT> + <Bestemming>".
        const dest = tagWhere(whereKey, regionKey);
        const wS = tagWho(who);
        const destParam = whereKey ? `where=${whereKey}` : `region=${regionKey}`;
        const N4 = (what) => whereKey
            ? `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${whereKey}`
            : `Niveau3-WaarWat.html?who=${who}&what=${what}&region=${regionKey}`;
        const N3WAARWAT = (what) => `Niveau3-WaarWat.html?what=${what}&${destParam}`;
        return [
            { icon: "🏨", title: _tagJoin(["Hotel",        dest, wS]), href: N4("hotel") },
            { icon: "⛺", title: _tagJoin(["Camping",      dest, wS]), href: N4("camping") },
            { icon: "🎡", title: _tagJoin(["Vakantiepark", dest, wS]), href: N4("holiday-park") },
            { icon: "💆", title: _tagJoin(["Wellness",     dest, wS]), href: N4("wellness") },
            { icon: "✨", title: _tagJoin(["Glamping",     dest, wS]), href: N4("glamping") },
            { icon: "☀️", title: _tagJoin(["Zonvakantie",  dest, wS]), href: N4("sun") },
            { icon: "🏨", title: _tagJoin(["Hotel",        dest]),     href: N3WAARWAT("hotel") },
            { icon: "⛺", title: _tagJoin(["Camping",      dest]),     href: N3WAARWAT("camping") },
            { icon: "🎡", title: _tagJoin(["Vakantiepark", dest]),     href: N3WAARWAT("holiday-park") },
        ];
    }
    function reisgezelschapForWieWaarContext(who, whereKey, regionKey) {
        // Tag-style: "<Bestemming> + <Andere WIE-fullLabel>". Excludes huidige WIE.
        const N3 = (otherWho) => whereKey
            ? `Niveau3-WieWaar.html?who=${otherWho}&where=${whereKey}`
            : `Niveau3-WieWaar.html?who=${otherWho}&region=${regionKey}`;
        const dest = tagWhere(whereKey, regionKey);
        const all = [
            { who: "couples",         icon: "💑",      lbl: "Koppels" },
            { who: "families-kids",   icon: "👨‍👩‍👧", lbl: "Gezinnen met kinderen" },
            { who: "families-teens",  icon: "🧑",      lbl: "Gezinnen met tieners" },
            { who: "families-babies", icon: "👶",      lbl: "Gezinnen met baby's" },
            { who: "friends",         icon: "👫",      lbl: "Vrienden" },
            { who: "seniors",         icon: "👴",      lbl: "Senioren" },
            { who: "solo",            icon: "🚶",      lbl: "Alleen reizend" },
            { who: "pets",            icon: "🐕",      lbl: "Met huisdier" },
        ].filter(w => w.who !== who);
        return all.slice(0, 9).map(w => ({
            icon: w.icon, title: _tagJoin([dest, w.lbl]), href: N3(w.who),
        }));
    }
    function bestemmingenForWieWaarContext(who, whoLabel, whereKey, regionKey) {
        // Tag-style: "<Andere bestemming> + <WIE-fullLabel>"
        const wL = whoLabel || tagWho(who);
        const N3W = (w)  => `Niveau3-WieWaar.html?who=${who}&where=${w}`;
        const N3R = (r)  => `Niveau3-WieWaar.html?who=${who}&region=${r}`;
        const allWhere = [
            { key: "italie",      icon: "🍝",  label: "Italië" },
            { key: "frankrijk",   icon: "🗼",  label: "Frankrijk" },
            { key: "spanje",      icon: "🥘",  label: "Spanje" },
            { key: "duitsland",   icon: "🍺",  label: "Duitsland" },
            { key: "kroatie",     icon: "⛵",  label: "Kroatië" },
            { key: "netherlands", icon: "🇳🇱",  label: "Nederland" },
        ].filter(w => w.key !== whereKey).slice(0, 6);
        const regionItems = [
            { key: "europa",  icon: "🌍",  label: "Europa" },
            { key: "bergen",  icon: "⛰️",  label: "Bergen" },
            { key: "aan-zee", icon: "🏖️",  label: "Aan zee" },
        ].filter(r => r.key !== regionKey).slice(0, 3);
        return [
            ...allWhere.map(w => ({
                icon: w.icon, title: _tagJoin([w.label, wL]), href: N3W(w.key),
            })),
            ...regionItems.map(r => ({
                icon: r.icon, title: _tagJoin([r.label, wL]), href: N3R(r.key),
            })),
        ].slice(0, 9);
    }
    function vakantietypeForWieWaarContext(who, whoLabel, whereKey, regionKey) {
        // Tag-style 3-dim: "<WAT> + <Bestemming> + <WIE-fullLabel>"
        const wL = whoLabel || tagWho(who);
        const dest = tagWhere(whereKey, regionKey);
        const N4 = (what) => whereKey
            ? `Niveau4-WieWatWaar.html?who=${who}&what=${what}&where=${whereKey}`
            : `Niveau3-WaarWat.html?who=${who}&what=${what}&region=${regionKey}`;
        return [
            { icon: "🏨", title: _tagJoin(["Hotel",        dest, wL]), href: N4("hotel") },
            { icon: "⛺", title: _tagJoin(["Camping",      dest, wL]), href: N4("camping") },
            { icon: "🎡", title: _tagJoin(["Vakantiepark", dest, wL]), href: N4("holiday-park") },
            { icon: "✨", title: _tagJoin(["Glamping",     dest, wL]), href: N4("glamping") },
            { icon: "💆", title: _tagJoin(["Wellness",     dest, wL]), href: N4("wellness") },
            { icon: "☀️", title: _tagJoin(["Zonvakantie",  dest, wL]), href: N4("sun") },
            { icon: "⛷️", title: _tagJoin(["Wintersport",  dest, wL]), href: N4("winter") },
            { icon: "🧗", title: _tagJoin(["Avontuur",     dest, wL]), href: N4("adventure-trip") },
            { icon: "🏙️", title: _tagJoin(["Citytrip",     dest, wL]), href: N4("city-trip") },
        ];
    }

    function escapeHTML(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function renderInspirationTabs(containerId, options) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const opts = options || {};
        // ---- CONTEXT RESOLUTION ----
        // Tot drie dimensies tegelijk ondersteund (Niveau 2 + Niveau 3).
        // Iedere dimensie wordt los geresolved — er is GEEN auto-nulling
        // van WIE/WAAR wanneer WAT óók aanwezig is, want Niveau 3
        // pagina's hebben juist meerdere dimensies tegelijk.
        //
        // De dispatchers detecteren single-context vs dual-context op
        // basis van de gecombineerde booleans (isDualWieWat etc.).
        const contextWhat   = opts.contextWhat   || null;
        const contextWho    = opts.contextWho    || null;
        const contextWhere  = opts.contextWhere  || null;
        const contextRegion = opts.contextRegion || null;

        // Booleans voor single- en dual-context scenario's.
        const hasContextWat  = !!contextWhat;
        const hasContextWie  = !!contextWho;
        const hasContextWaar = !!contextWhere || !!contextRegion;

        // Dual-context = Niveau 3 (precies 2 dimensies aan). Drie 3-
        // way combinaties; ene uitsluitend, dus mutex via && !...
        const isDualWieWat   = hasContextWie  && hasContextWat  && !hasContextWaar;
        const isDualWatWaar  = hasContextWat  && hasContextWaar && !hasContextWie;
        const isDualWieWaar  = hasContextWie  && hasContextWaar && !hasContextWat;
        const isDual         = isDualWieWat || isDualWatWaar || isDualWieWaar;

        // Single-context = Niveau 2 (exact 1 dimensie aan).
        const isSingleWat  = hasContextWat  && !hasContextWie  && !hasContextWaar;
        const isSingleWie  = hasContextWie  && !hasContextWat  && !hasContextWaar;
        const isSingleWaar = hasContextWaar && !hasContextWat  && !hasContextWie;

        // Labels die hieronder door alle generators worden gebruikt.
        const contextWhoLabel    = contextWho   ? DATA.label('who', contextWho)        : '';
        const contextWhatLabel   = contextWhat  ? DATA.label('what', contextWhat)      : '';
        const contextWhereLabel  = contextWhere ? DATA.label('where', contextWhere)    : '';
        const contextRegionLabel = contextRegion ? DATA.regionDisplayName(contextRegion) : '';
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
        //   • Niveau 3 dual-context (WIE+WAT / WAT+WAAR / WIE+WAAR):
        //     Populaire zoekcombinaties EERST → primaire discovery
        //     ("Boutique Hotels voor solo in Italië"). Dan Reisgezel-
        //     schap / Bestemmingen / Vakantietype voor verdieping.
        //   • Niveau 2 — Wat (single WAT-context): Vakantietype eerst
        //     (sub-refinements), dán Reisgezelschap / Bestemmingen /
        //     Populair.
        //   • Niveau 2 — Wie: Reisgezelschap weg (al gekozen). Tabs:
        //     Vakantietype / Bestemmingen / Populair.
        //   • Niveau 2 — Waar: Bestemmingen weg (al gekozen). Tabs:
        //     Vakantietype / Reisgezelschap / Populair.
        //   • Homepage (geen context): standaard 4 tabs.
        //
        // Populair-tab krijgt op iedere context-pagina de label
        // "Populaire zoekcombinaties" om duidelijk te maken dat het
        // combinatorische verfijningen zijn van de huidige context.
        let orderedTabIds;
        if (isDual) {
            // Niveau 3 — Populair first (discovery-driven)
            orderedTabIds = ["populair", "reisgezelschap", "bestemmingen", "vakantietype"];
        } else if (isSingleWat && contextSub) {
            // Niveau 2 — Wat met sub (bv. Boutique Hotels, Glamping,
            // Kindercampings): zelfde discovery-driven volgorde als
            // Niveau 3. Vakantietype gaat naar achteren — de bezoeker
            // heeft de sub al gekozen, dus refinement-tab is minder
            // primair dan combinatie-exploration.
            orderedTabIds = ["populair", "reisgezelschap", "bestemmingen", "vakantietype"];
        } else if (isSingleWat && !WHAT_REFINEMENTS[contextWhat]) {
            // Niveau 2 — Wat voor "leaf"-categorieën (sun / winter /
            // glamping / wellness / adventure-trip / city-trip):
            // geen sub-refinements beschikbaar, dus Vakantietype-tab is
            // niet een refinement-keuze maar een cross-suggestion naar
            // andere WAT-types. Populair-first voelt dan
            // discovery-driven, net als op subtype-pagina's.
            orderedTabIds = ["populair", "reisgezelschap", "bestemmingen", "vakantietype"];
        } else if (isSingleWat) {
            // Niveau 2 — Wat met sub-refinements (Alle hotels / Alle
            // campings / Alle vakantieparken): Vakantietype eerst zodat
            // de bezoeker direct naar een sub kan verfijnen.
            orderedTabIds = ["vakantietype", "reisgezelschap", "bestemmingen", "populair"];
        } else if (isSingleWie) {
            orderedTabIds = ["vakantietype", "bestemmingen", "populair"];
        } else if (isSingleWaar) {
            orderedTabIds = ["vakantietype", "reisgezelschap", "populair"];
        } else {
            orderedTabIds = TABS.map(t => t.id);
        }
        const hasAnyContext = isDual || isSingleWat || isSingleWie || isSingleWaar;
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

            // ---- NIVEAU 3 DUAL-CONTEXT ----
            // Twee dimensies actief — Populair toont curated 9-item
            // combo's met derde dimensie of sub-twist; overige tabs
            // preserveren beide actieve dimensies in elke URL.
            if (isDualWieWat) {
                if (activeTab === "populair")       return populairForWieWatContext(contextWho, contextWhoLabel, contextWhat, contextWhatLabel, contextSub, contextSubLabel);
                if (activeTab === "reisgezelschap") return reisgezelschapForWieWatContext(contextWho, contextWhat, contextWhatLabel, contextSub, contextSubLabel);
                if (activeTab === "bestemmingen")   return bestemmingenForWieWatContext(contextWho, contextWhoLabel, contextWhat, contextSub, contextSubLabel);
                if (activeTab === "vakantietype")   return vakantietypeForWieWatContext(contextWho, contextWhoLabel, contextWhat);
                return tab.items;
            }
            if (isDualWatWaar) {
                if (activeTab === "populair")       return populairForWatWaarContext(contextWhat, contextWhatLabel, contextSub, contextSubLabel, contextWhere, contextRegion);
                if (activeTab === "reisgezelschap") return reisgezelschapForWatWaarContext(contextWhat, contextWhatLabel, contextSub, contextSubLabel, contextWhere, contextRegion);
                if (activeTab === "bestemmingen")   return bestemmingenForWatWaarContext(contextWhat, contextWhatLabel, contextSub, contextSubLabel, contextWhere, contextRegion);
                if (activeTab === "vakantietype")   return vakantietypeForWatWaarContext(contextWhat, contextWhere, contextRegion);
                return tab.items;
            }
            if (isDualWieWaar) {
                if (activeTab === "populair")       return populairForWieWaarContext(contextWho, contextWhoLabel, contextWhere, contextRegion);
                if (activeTab === "reisgezelschap") return reisgezelschapForWieWaarContext(contextWho, contextWhere, contextRegion);
                if (activeTab === "bestemmingen")   return bestemmingenForWieWaarContext(contextWho, contextWhoLabel, contextWhere, contextRegion);
                if (activeTab === "vakantietype")   return vakantietypeForWieWaarContext(contextWho, contextWhoLabel, contextWhere, contextRegion);
                return tab.items;
            }

            // ---- NIVEAU 2 SINGLE-CONTEXT ----
            if (isSingleWie) {
                if (activeTab === "vakantietype") return vakantietypeForWieContext(contextWho, contextWhoLabel);
                if (activeTab === "bestemmingen") return bestemmingenForWieContext(contextWho, contextWhoLabel);
                if (activeTab === "populair")     return populairForWieContext(contextWho, contextWhoLabel);
                return tab.items;
            }
            if (isSingleWaar) {
                if (activeTab === "vakantietype")  return vakantietypeForWaarContext(contextWhere, contextRegion);
                if (activeTab === "reisgezelschap") return reisgezelschapForWaarContext(contextWhere, contextRegion);
                if (activeTab === "populair")      return populairForWaarContext(contextWhere, contextRegion);
                return tab.items;
            }
            if (isSingleWat) {
                // WAT-SUB-CONTEXT (bijv. "Wellness Hotels"): álle
                // dynamische tabs preserveren het sub-niveau in label
                // én URL. Vakantietype blijft de refinement-lijst
                // tonen zodat de gebruiker naar een andere sub kan
                // overstappen.
                if (contextSub) {
                    if (activeTab === "populair")       return populairForSubContext(contextWhat, contextSub, contextSubLabel);
                    if (activeTab === "reisgezelschap") return reisgezelschapForSubContext(contextWhat, contextSub, contextSubLabel);
                    if (activeTab === "bestemmingen")   return bestemmingenForSubContext(contextWhat, contextSub, contextSubLabel);
                    if (activeTab === "vakantietype" && WHAT_REFINEMENTS[contextWhat]) return WHAT_REFINEMENTS[contextWhat];
                    return tab.items;
                }
                // WAT-CONTEXT zonder sub.
                //   Hotel / Camping / Vakantiepark → curated WAT-maps.
                //   Andere WAT-keys (sun / winter / glamping / wellness /
                //   adventure-trip / city-trip) → generieke generators
                //   zodat ze nooit meer terugvallen op de homepage
                //   default tab-items.
                if (activeTab === "populair") {
                    return POPULAIR_BY_WAT[contextWhat]     || genericPopulairForWat(contextWhat, contextWhatLabel);
                }
                if (activeTab === "vakantietype") {
                    return WHAT_REFINEMENTS[contextWhat]    || genericVakantietypeForWat(contextWhat);
                }
                if (activeTab === "bestemmingen") {
                    return BESTEMMINGEN_BY_WAT[contextWhat] || bestemmingenForWat(contextWhat);
                }
                if (activeTab === "reisgezelschap") {
                    return REISGEZELSCHAP_BY_WAT[contextWhat] || reisgezelschapForWat(contextWhat);
                }
                return tab.items;
            }

            // ---- HOMEPAGE / GEEN CONTEXT ----
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
