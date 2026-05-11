// context-copy.js — contextuele intro-copy generator voor Niveau 2/3/4
// pagina's. window.buildContextLead({ what, sub, who, where, region })
// retourneert een NL-zin die past bij de gekozen filter-combinatie.
//
// Aanpak: per sub-type een eigen "voice" + een matrix van WIE-tone-
// variaties. Bij wegvallend sub-niveau valt de helper terug op een
// WAT-default. De templates zijn bewust gevariëerd zodat opeenvolgende
// paginas niet als elkaars kopie aanvoelen.

(function () {
    "use strict";

    // sub-key → { default + per-WIE overrides }. Niet elke combinatie
    // hoeft een eigen template; ontbreekt een WIE-key dan valt het
    // terug op `default`. Houd dit synchroon met SITE_DATA.subLabels.
    const SUB_COPY = {
        wellness: {
            default: "Onze selectie wellness hotels brengt spa's, sauna's en massages naar één plek — pure ontspanning op een bijzondere bestemming.",
            couples: "Toe aan quality time samen? Bekijk sfeervolle wellness hotels voor koppels en geniet van spa's, infinity pools en romantische overnachtingen op bijzondere bestemmingen.",
            'families-kids': "Wellness voor het hele gezin — kindvriendelijke kuren, ruime gezinskamers en spa-faciliteiten waar iedereen op adem komt.",
            'families-babies': "Wellness die rekening houdt met je baby — rustige kamers, babyvoorzieningen en stoombaden voor ouders.",
            seniors: "Wellness in alle rust — milde behandelingen, persoonlijke begeleiding en comfortabele kamers voor wie het rustig aan wil doen.",
            friends: "Een wellness-weekend met je vrienden — sauna, massages en gezamenlijke spa-tijd voor pure ontlading.",
            solo: "Helemaal jezelf op een wellness-retreat — persoonlijke kuren, rust en aandacht in stijlvolle hotels.",
            pets: "Wellness met je hond erbij — diervriendelijke wellness hotels waar jullie samen tot rust komen.",
        },
        boutique: {
            default: "Karaktervolle boutique hotels in onderscheidende stijl — persoonlijke service, lokale charme en geen massa.",
            couples: "Een boutique hotel voor twee — sfeervolle kamers, attente service en bijzondere ontbijten op een romantische bestemming.",
            'families-kids': "Boutique hotels met ruimte voor het hele gezin — persoonlijke service, hartelijke ontvangst en geen ketenervaring.",
            seniors: "Karaktervolle boutique hotels op rustige plekken — persoonlijke aandacht en veel charme.",
            friends: "Een boutique hotel met je vrienden — stijlvolle gemeenschappelijke ruimtes en kamers vol karakter.",
            solo: "Een boutique hotel als jouw uitvalsbasis — persoonlijke service en lokale charme zonder hotelketen-gevoel.",
        },
        'adult-only': {
            default: "Adult-only hotels — pure rust zonder kinderen, perfect voor onbezorgde vakanties op zonnige bestemmingen.",
            couples: "Onbezorgd ontspannen samen — adult-only hotels met spa, infinity pools en kindvrije zwemzones voor pure tijd met z'n tweeën.",
            seniors: "Adult-only hotels in alle rust — ideale comfortvakanties voor senioren zonder gezinsdrukte.",
            friends: "Adult-only escape met je vrienden — pure rust, faciliteiten op niveau en zon op het terras.",
            solo: "Een adult-only hotel als solo traveller — pure rust, kindvrij en op je eigen tempo.",
        },
        design: {
            default: "Design hotels — iconische architectuur en doordachte details voor wie verblijven én belevenis combineert.",
            couples: "Een design hotel voor twee — fotogenieke kamers en bijzondere details voor jullie weekend weg.",
            friends: "Design hotels met je vrienden — instagrammable interieurs en stijlvol gezelschap.",
            solo: "Een design hotel waar elk hoekje inspireert — perfect voor solo travellers met smaak.",
        },
        'all-inclusive': {
            default: "All-inclusive hotels — alles inbegrepen, jij hoeft alleen te genieten. Eten, drinken, faciliteiten en activiteiten in één pakket.",
            couples: "All-inclusive voor twee — onbezorgd ontspannen samen, alles is geregeld zodat jullie niets meer hoeven.",
            'families-kids': "All-inclusive voor het hele gezin — eten, drinken, kids clubs en zwembaden, alles inbegrepen voor zorgeloze dagen.",
            seniors: "All-inclusive zonder zorgen — alles geregeld, jij hoeft alleen te genieten.",
            friends: "All-inclusive met je vrienden — eten, drinken en feest, allemaal inbegrepen.",
        },
        city: {
            default: "Centrumgelegen hotels — middenin de stad, alles op loopafstand. Restaurants, winkels en bezienswaardigheden voor de deur.",
            couples: "Een citytrip voor twee in een centrumgelegen hotel — alles op loopafstand voor een spontaan weekend.",
            friends: "Centrumgelegen hotels voor een stedentrip met vrienden — stappen, eten en cultuur direct om de hoek.",
            solo: "Een centrumgelegen hotel als uitvalsbasis — alles op loopafstand voor solo ontdekkers.",
        },
        resort: {
            default: "Resorts — een complete vakantie-ervaring met restaurants, faciliteiten, entertainment en activiteiten op één terrein.",
            couples: "Resortvakantie voor twee — alles aan boord voor een onbezorgde week samen.",
            'families-kids': "Resorts voor het hele gezin — zwembaden, animatie, restaurants en kindvriendelijke faciliteiten op één plek.",
            friends: "Resorts met je vrienden — entertainment, bar, zwembaden en niets meer dan genieten.",
        },

        glamping: {
            default: "Glamping — kamperen met al het comfort van een hotel. Luxe tenten, comfortabele bedden en een natuurlijke tuin om jou heen.",
            couples: "Glamping voor twee — luxe in de natuur, weg van het lawaai, en samen sterren kijken.",
            'families-kids': "Glamping voor gezinnen — comfortabel kamperen met kinderen, ruime safaritenten en speelparadijs in de natuur.",
            'families-babies': "Glamping met je baby — ruime tenten, veilige omgeving en kampvuren onder de sterren.",
            'families-teens': "Glamping voor gezinnen met tieners — avontuur in de natuur, sport en eigen privacy in de tent.",
            seniors: "Glamping in alle rust — comfortabel kamperen zonder concessies, dichtbij de natuur.",
            friends: "Glamping met je vrienden — kampvuur, sterren en een luxe tent als uitvalsbasis.",
            solo: "Solo glamping — een luxe tent als jouw eigen plek midden in de natuur.",
            pets: "Hondvriendelijk glampen — jouw hond rent vrij rond, jij ontspant in de luxe tent.",
        },
        waterpark: {
            default: "Campings met aquapark — glijbanen, wildwaterbanen en zwembaden voor onbeperkt waterplezier.",
            'families-kids': "Spetterende familievakantie op een camping met aquapark — kinderen vermaken zich uren in de glijbanen.",
            'families-teens': "Campings met aquapark voor tieners — wildwaterbanen, hoge glijbanen en eindeloos waterplezier.",
            friends: "Camping met aquapark voor vriendengroepen — sportieve glijbanen en gezellige zwembaden.",
        },
        natuur: {
            default: "Camping in de natuur — wakker worden tussen bomen, vogelgezang en pure rust.",
            'families-kids': "Camping in de natuur voor het hele gezin — kinderen ontdekken bos en beekjes, ouders ontspannen.",
            couples: "Camping in de natuur voor twee — stilte, sterren en de bossen om jullie heen.",
            seniors: "Camping in de natuur in alle rust — bospaden, vogels en een comfortabele plek.",
            friends: "Natuurcamping met vrienden — kampvuur, wandelen en gezelligheid in het groen.",
            solo: "Solo natuurcamping — alleen jij, de natuur en stilte.",
            pets: "Natuurcamping voor jou en je hond — eindeloze wandelpaden direct vanaf de tent.",
        },
        kids: {
            default: "Kindercampings — speelparadijs voor kinderen, ontspanning voor ouders. Animatie, kids clubs en eindeloos plezier.",
            'families-kids': "Kindercampings voor gezinnen met kinderen — speeltuinen, animatie en kids clubs zodat iedereen geniet.",
            'families-babies': "Kindvriendelijke campings voor gezinnen met baby's — rustige hoekjes en babyvoorzieningen.",
            'families-teens': "Kindercampings met activiteiten voor tieners — sport, water en avontuur.",
        },
        honden: {
            default: "Hondvriendelijke campings — jouw hond is net zo welkom als jij. Eindeloze wandelpaden direct vanaf je staanplaats.",
            pets: "Hondvriendelijke campings voor jou en je viervoeter — losloopgebieden, hondenstrand en wandelpaden voor de deur.",
            couples: "Hondvriendelijke campings voor twee — samen op vakantie met je hond, zonder gedoe.",
            'families-kids': "Hondvriendelijke campings voor gezinnen — kinderen én honden komen aan hun trekken.",
            seniors: "Hondvriendelijke campings in alle rust — rustige paden voor jou en je hond.",
            solo: "Solo op de camping met je hond — vrijheid, natuur en jouw maatje.",
        },
        zee: {
            default: "Campings aan zee — strand op loopafstand, zon op het terras en zilte zeebries om jou heen.",
            'families-kids': "Campings aan zee voor gezinnen — strand voor de tent, baby pools en eindeloos waterplezier in de zomerzon.",
            'families-teens': "Campings aan zee voor gezinnen met tieners — surf, beach volley en eigen vrijheid bij het water.",
            couples: "Een strandcamping voor twee — zon, zee en zonsondergangen samen.",
            friends: "Campings aan zee met je vrienden — strand, zon en gezelligheid op het terras.",
            seniors: "Campings aan zee in alle rust — een wandeling langs het water en zon op het terras.",
            solo: "Solo strandcamping — zee, zon en jouw eigen ritme.",
        },

        zwemparadijs: {
            default: "Vakantieparken met zwemparadijs — glijbanen, wildwaterbanen en baby-pools voor uren waterplezier.",
            'families-kids': "Vakantieparken met zwemparadijs voor gezinnen — kinderen vermaken zich uren in het water.",
            'families-teens': "Vakantieparken met zwemparadijs voor tieners — wildwaterbanen en spannende glijbanen.",
        },
        attractiepark: {
            default: "Vakantieparken met attractiepark — achtbanen en attracties direct op het terrein.",
            'families-kids': "Vakantieparken met attractiepark voor gezinnen — pretpark én bungalow op één plek.",
            'families-teens': "Vakantieparken met attractiepark voor tieners — achtbanen, water en avontuur.",
        },
        luxe: {
            default: "Luxe vakantieparken — premium accommodaties met spa, zwembad en uitgebreide voorzieningen.",
            couples: "Luxe vakantiepark voor twee — premium suites en spa-faciliteiten voor pure ontspanning.",
            'families-kids': "Luxe vakantieparken voor het hele gezin — premium comfort met kindvriendelijke faciliteiten.",
            seniors: "Luxe vakantieparken in alle rust — premium comfort en uitgebreide voorzieningen.",
        },
        themaparken: {
            default: "Themaparken — verblijf met een doorlopend thema, van piratenavontuur tot ridderkastelen.",
            'families-kids': "Themaparken voor gezinnen — kinderen leven zich uit in het thema-verhaal.",
        },
    };

    // WAT-default copy (zonder sub). Bij gemiste sub-templates valt
    // de helper hierop terug.
    const WAT_COPY = {
        hotel: {
            default: "Onze selectie hotels — van budget tot luxe, in de stad of aan zee.",
            couples: "Hotels voor een weekend weg met z'n tweeën — sfeer, service en bijzondere bestemmingen.",
            'families-kids': "Familievriendelijke hotels — ruime kamers, kindvriendelijke faciliteiten en zwembad.",
            seniors: "Hotels in alle rust en comfort — persoonlijke service en geen gedoe.",
            friends: "Hotels voor een stedentrip of weekend met vrienden — centraal en sfeervol.",
            solo: "Hotels voor solo travellers — comfortabel, centraal en passende prijs.",
            pets: "Hondvriendelijke hotels — jouw viervoeter mag mee.",
        },
        camping: {
            default: "Onze selectie campings — kamperen voor iedere stijl en elk reisgezelschap.",
            couples: "Campings voor twee — natuur, sterren en samen tijd voor elkaar.",
            'families-kids': "Familievriendelijke campings — speeltuinen, zwembad en animatie voor de kinderen.",
            seniors: "Campings in alle rust — comfortabel kamperen op rustige plekken.",
            friends: "Campings met vrienden — gezelligheid, kampvuur en eigen ritme.",
            solo: "Solo campings — vrijheid, natuur en je eigen tempo.",
            pets: "Hondvriendelijke campings — jouw hond is net zo welkom als jij.",
        },
        'holiday-park': {
            default: "Onze selectie vakantieparken — comfortabel verblijf met voorzieningen voor het hele gezin.",
            couples: "Vakantieparken voor twee — kleinere parken met spa en rust voor jullie samen.",
            'families-kids': "Vakantieparken voor gezinnen — zwembad, animatie en speeltuinen waar de kinderen het naar hun zin hebben.",
            'families-teens': "Vakantieparken voor gezinnen met tieners — sport, avontuur en eigen ruimte.",
            seniors: "Vakantieparken in alle rust — comfortabel verblijf en geen drukte.",
            friends: "Vakantieparken met je vrienden — bungalow voor de groep en gezelligheid.",
        },
    };

    function buildContextLead(opts) {
        opts = opts || {};
        const { what, sub, who } = opts;
        const whoFirst = Array.isArray(who) ? who[0] : who;

        // Sub × WIE — meest specifieke template
        if (sub && SUB_COPY[sub]) {
            const subCopy = SUB_COPY[sub];
            if (whoFirst && subCopy[whoFirst]) return subCopy[whoFirst];
            return subCopy.default;
        }
        // WAT × WIE — fallback voor pages zonder sub
        if (what && WAT_COPY[what]) {
            const watCopy = WAT_COPY[what];
            if (whoFirst && watCopy[whoFirst]) return watCopy[whoFirst];
            return watCopy.default;
        }
        return '';
    }

    window.buildContextLead = buildContextLead;
})();
