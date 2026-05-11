// site-data.js — gedeelde categorie- en accommodatie-data voor alle pagina's
// Houd in sync met navigatie.js labels.

const SITE_DATA = {
    labels: {
        who: {
            'families-babies': "Gezinnen met baby's",
            'families-kids': 'Gezinnen met kinderen',
            'families-teens': 'Gezinnen met tieners',
            'couples': 'Koppels',
            'friends': 'Vrienden',
            'seniors': 'Senioren',
            'pets': 'Met huisdieren',
            'solo': 'Alleen reizend'
        },
        what: {
            'camping': 'Kamperen',
            'hotel': 'Hotel',
            'holiday-park': 'Vakantiepark',
            'glamping': 'Glamping',
            'wellness': 'Wellness',
            'adventure-trip': 'Actief / Avontuur',
            'city-trip': 'Weekendje weg',
            'sun': 'Zonvakantie',
            'winter': 'Wintervakantie'
        },
        whereNL: {
            'drenthe': 'Drenthe',
            'gelderland': 'Gelderland',
            'limburg': 'Limburg',
            'zeeland': 'Zeeland',
            'noord-holland': 'Noord-Holland',
            'overijssel': 'Overijssel',
            'flevoland': 'Flevoland',
            'friesland': 'Friesland',
            'groningen': 'Groningen',
            'noord-brabant': 'Noord-Brabant',
            'zuid-holland': 'Zuid-Holland',
            'utrecht': 'Utrecht'
        },
        whereEU: {
            'belgie': 'België',
            'duitsland': 'Duitsland',
            'frankrijk': 'Frankrijk',
            'spanje': 'Spanje',
            'italie': 'Italië',
            'oostenrijk': 'Oostenrijk',
            'portugal': 'Portugal',
            'kroatie': 'Kroatië'
        },
        // Landen (hoog-niveau bestemmingen voor Niveau 3)
        countries: {
            'netherlands': 'Nederland',
            'belgie': 'België',
            'duitsland': 'Duitsland',
            'frankrijk': 'Frankrijk',
            'spanje': 'Spanje',
            'italie': 'Italië',
            'oostenrijk': 'Oostenrijk',
            'portugal': 'Portugal',
            'kroatie': 'Kroatië'
        },
        // Regio's — aggregaten boven landen heen voor de Bestemmingen-
        // tab. Een region groepeert meerdere where-keys (bijv. europa =
        // alle EU-landen) en draagt een eigen label + Nederlandse
        // preposition. Hierdoor kunnen we "Hotels in Europa" en
        // "Hotels nabij de bergen" laten renderen i.p.v. een
        // generieke continent-pagina of het verkeerde land.
        regions: {
            // displayName = wat in chips, eyebrow en breadcrumb staat.
            // label + preposition = wat in pagina-titels gerendeerd wordt
            //   (bv. "Vakantie in Europa", "Vakantie aan zee",
            //   "Hotels in de bergen").
            // wheres = welke individuele where-keys onder deze region
            //   vallen (gebruikt door DATA.filter voor de listing).
            'europa':      { label: 'Europa',      displayName: 'Europa',      preposition: 'in',  wheres: ['belgie','duitsland','frankrijk','spanje','italie','oostenrijk','portugal','kroatie'] },
            'azie':        { label: 'Azië',        displayName: 'Azië',        preposition: 'in',  wheres: [] },
            'afrika':      { label: 'Afrika',      displayName: 'Afrika',      preposition: 'in',  wheres: [] },
            'scandinavie': { label: 'Scandinavië', displayName: 'Scandinavië', preposition: 'in',  wheres: [] },
            // Bergen = bergachtige bestemmingen. Chip toont "Bergen",
            // title gebruikt "in de bergen" voor natuurlijke NL-zin.
            'bergen':      { label: 'de bergen',   displayName: 'Bergen',      preposition: 'in',  wheres: ['oostenrijk','italie','duitsland'] },
            // "Aan Zee" = NL/EU kustbestemmingen. Title: "Vakantie aan
            // zee" / "Hotels aan zee" — preposition+label match de
            // natuurlijke Nederlandse formulering.
            'aan-zee':     { label: 'zee',         displayName: 'Aan Zee',     preposition: 'aan', wheres: ['zeeland','noord-holland','friesland','zuid-holland','spanje','italie','kroatie','portugal'] },
        },

        // Sub-type labels per WAT-key — sturen Niveau 2/3/4 paginas
        // aan om bij ?sub= een specifieke ondertitel/breadcrumb te tonen.
        // Houdt in sync met inspiration-tabs WHAT_REFINEMENTS.
        subLabels: {
            'hotel': {
                'boutique':      'Boutique Hotels',
                'adult-only':    'Adult Only Hotels',
                'wellness':      'Wellness Hotels',
                'all-inclusive': 'All-inclusive Hotels',
                'design':        'Design Hotels',
                'city':          'Centrumgelegen Hotels',
                'resort':        'Resorts',
            },
            'camping': {
                'glamping':      'Glamping',
                'waterpark':     'Camping met Aquapark',
                'natuur':        'Camping in de natuur',
                'kids':          'Kindercampings',
                'honden':        'Hondvriendelijke campings',
                'zee':           'Campings aan zee',
            },
            'holiday-park': {
                'zwemparadijs':  'Vakantieparken met zwemparadijs',
                'attractiepark': 'Vakantieparken met attractiepark',
                'luxe':          'Luxe vakantieparken',
                'kids':          'Kindvriendelijke vakantieparken',
                'natuur':        'Vakantieparken in de natuur',
                'themaparken':   'Themaparken',
            },
        },
        // Camping-subtypes (Niveau 3 verdieping bij what=camping)
        campingTypes: {
            'camping-glamping': 'Glamping',
            'camping-waterpark': 'Camping met waterpark',
            'camping-holidaypark': 'Camping op vakantiepark',
            'camping-nature': 'Natuurcamping',
            'camping-beach': 'Camping aan zee',
            'camping-adult': 'Adult-only camping',
            'camping-farm': 'Boerencamping',
            'camping-kids': 'Kindercamping'
        }
    },
    icons: {
        // WIE
        'families-babies': '👶', 'families-kids': '👧', 'families-teens': '🧑',
        'couples': '💑', 'friends': '👫', 'seniors': '👴',
        'pets': '🐕', 'solo': '🧑',
        // WAT
        'camping': '⛺', 'hotel': '🏨', 'holiday-park': '🎡', 'glamping': '✨',
        'wellness': '💆', 'adventure-trip': '🧗', 'city-trip': '🏙️',
        'sun': '☀️', 'winter': '⛷️',
        // WAAR NL
        'drenthe': '🌲', 'gelderland': '🏞️', 'limburg': '⛰️', 'zeeland': '🏖️',
        'noord-holland': '🚴', 'overijssel': '💧', 'flevoland': '🌾',
        'friesland': '🚣', 'groningen': '🌌', 'noord-brabant': '🎭',
        'zuid-holland': '🌷', 'utrecht': '🏰',
        // WAAR EU
        'belgie': '🍫', 'duitsland': '🍺', 'frankrijk': '🗼', 'spanje': '🥘',
        'italie': '🍝', 'oostenrijk': '🎿', 'portugal': '🏖️', 'kroatie': '⛵',
        // LANDEN
        'netherlands': '🇳🇱',
        // CAMPING TYPES
        'camping-glamping': '✨', 'camping-waterpark': '🏊', 'camping-holidaypark': '🎡',
        'camping-nature': '🌲', 'camping-beach': '🏖️', 'camping-adult': '🥂',
        'camping-farm': '🐄', 'camping-kids': '🎠'
    },
    // Gradiënten voor placeholder-afbeeldingen (per categorie-type een andere kleur)
    gradients: {
        who: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
        what: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        where: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        combo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    // Uitgebreide accommodatielijst — sluit aan op tags in navigatie.js
    accommodations: [
        { id: 1, name: 'Sunny Beach Resort', location: 'Zeeland', price: 145, rating: 8.7, reviews: 412,
          who: ['families-kids','couples'], what: ['sun','hotel'], where: 'zeeland',
          tags: ['Aan zee','Comfort'], emoji: '🏖️' },
        { id: 2, name: 'Family Camping Paradise', location: 'Drenthe', price: 68, rating: 8.4, reviews: 287,
          who: ['families-kids','families-babies'], what: ['camping'], where: 'drenthe',
          tags: ['Camping','Kinderpret'], emoji: '⛺' },
        { id: 3, name: 'Alpine Mountain Lodge', location: 'Oostenrijk', price: 210, rating: 9.1, reviews: 198,
          who: ['couples','friends'], what: ['winter','adventure-trip'], where: 'oostenrijk',
          tags: ['Bergen','Luxe'], emoji: '⛰️' },
        { id: 4, name: 'Romantic Glamping Spot', location: 'Gelderland', price: 165, rating: 9.0, reviews: 142,
          who: ['couples'], what: ['glamping','wellness'], where: 'gelderland',
          tags: ['Glamping','Adult Only'], emoji: '✨' },
        { id: 5, name: 'Pet-Friendly Cottage', location: 'Noord-Holland', price: 98, rating: 8.6, reviews: 176,
          who: ['pets','couples','families-kids'], what: ['holiday-park'], where: 'noord-holland',
          tags: ['Diervriendelijk','Natuur'], emoji: '🏡' },
        { id: 6, name: 'Water Sports Haven', location: 'Friesland', price: 112, rating: 8.9, reviews: 231,
          who: ['friends','families-teens'], what: ['adventure-trip'], where: 'friesland',
          tags: ['Water','Sport'], emoji: '🏄' },
        { id: 7, name: 'City Break Parijs', location: 'Frankrijk', price: 185, rating: 8.8, reviews: 356,
          who: ['couples','solo','friends'], what: ['city-trip'], where: 'frankrijk',
          tags: ['Stad','Cultuur'], emoji: '🗼' },
        { id: 8, name: 'All-Inclusive Family Park', location: 'Noord-Brabant', price: 175, rating: 8.5, reviews: 489,
          who: ['families-kids','families-babies'], what: ['holiday-park'], where: 'noord-brabant',
          tags: ['All-in','Kinderpret'], emoji: '🎡' },
        { id: 9, name: 'Winter Ski Lodge', location: 'Oostenrijk', price: 245, rating: 9.2, reviews: 167,
          who: ['friends','couples'], what: ['winter','adventure-trip'], where: 'oostenrijk',
          tags: ['Wintersport','Bergen'], emoji: '⛷️' },
        { id: 10, name: 'Secluded Nature Retreat', location: 'Groningen', price: 125, rating: 8.7, reviews: 94,
          who: ['seniors','couples'], what: ['wellness'], where: 'groningen',
          tags: ['Natuur','Rust'], emoji: '🌲' },
        { id: 11, name: 'Costa Brava Beach Camping', location: 'Spanje', price: 82, rating: 8.3, reviews: 523,
          who: ['families-kids','families-teens'], what: ['camping','sun'], where: 'spanje',
          tags: ['Camping','Zee'], emoji: '🏕️' },
        { id: 12, name: 'Toscaanse Luxe Glamping', location: 'Italië', price: 220, rating: 9.3, reviews: 184,
          who: ['couples'], what: ['glamping','wellness'], where: 'italie',
          tags: ['Glamping','Luxe'], emoji: '🍷' },
        { id: 13, name: 'Ardennen Boutique Hotel', location: 'België', price: 135, rating: 8.6, reviews: 211,
          who: ['couples','seniors'], what: ['hotel','wellness'], where: 'belgie',
          tags: ['Boutique','Wellness'], emoji: '🏨' },
        { id: 14, name: 'Schwarzwald Chalet', location: 'Duitsland', price: 155, rating: 8.9, reviews: 267,
          who: ['families-teens','friends'], what: ['adventure-trip'], where: 'duitsland',
          tags: ['Bergen','Natuur'], emoji: '🌲' },
        { id: 15, name: 'Algarve Beachfront', location: 'Portugal', price: 168, rating: 9.0, reviews: 342,
          who: ['couples','families-teens'], what: ['sun','hotel'], where: 'portugal',
          tags: ['Zee','Zon'], emoji: '🌊' },
        { id: 16, name: 'Kroatische Kust-Villa', location: 'Kroatië', price: 195, rating: 9.1, reviews: 178,
          who: ['friends','couples'], what: ['sun'], where: 'kroatie',
          tags: ['Zee','Villa'], emoji: '⛵' },
        { id: 17, name: 'Veluwe Bungalow Park', location: 'Gelderland', price: 95, rating: 8.4, reviews: 298,
          who: ['families-kids','families-babies','pets'], what: ['holiday-park'], where: 'gelderland',
          tags: ['Bos','Bungalow'], emoji: '🌳' },
        { id: 18, name: 'Utrechtse Stadsapartement', location: 'Utrecht', price: 110, rating: 8.5, reviews: 189,
          who: ['couples','solo','friends'], what: ['city-trip'], where: 'utrecht',
          tags: ['Stad','Cultuur'], emoji: '🏰' },

        // --- Uitbreiding (19–48): dekking per who/what/where + kern-combinaties
        // Patroon volgt dezelfde vorm als hierboven; locations = slug-match where.
        // Doel: elk label heeft minstens 2–3 matches en combinaties als
        // families+camping+NL / couples+wellness+EU / friends+winter+oostenrijk
        // zijn expliciet aanwezig.

        // Limburg (NL)
        { id: 19, name: 'Limburgs Kasteelhotel', location: 'Limburg', price: 185, rating: 9.0, reviews: 221,
          who: ['couples','seniors'], what: ['hotel','wellness'], where: 'limburg',
          tags: ['Kasteel','Wellness'], emoji: '🏰' },
        { id: 20, name: 'Heuvelland Familie Camping', location: 'Limburg', price: 72, rating: 8.5, reviews: 314,
          who: ['families-kids','families-babies','pets'], what: ['camping'], where: 'limburg',
          tags: ['Camping','Natuur'], emoji: '⛺' },
        { id: 21, name: 'Maastricht Stadshotel', location: 'Limburg', price: 128, rating: 8.7, reviews: 267,
          who: ['couples','solo','friends'], what: ['city-trip','hotel'], where: 'limburg',
          tags: ['Stad','Cultuur'], emoji: '🏙️' },

        // Overijssel
        { id: 22, name: 'Twentse Natuurcamping', location: 'Overijssel', price: 65, rating: 8.4, reviews: 196,
          who: ['families-kids','pets','families-teens'], what: ['camping'], where: 'overijssel',
          tags: ['Natuur','Camping'], emoji: '🌲' },
        { id: 23, name: 'Salland Wellness Resort', location: 'Overijssel', price: 165, rating: 9.0, reviews: 182,
          who: ['couples','seniors'], what: ['wellness','hotel'], where: 'overijssel',
          tags: ['Wellness','Rust'], emoji: '💆' },

        // Flevoland
        { id: 24, name: 'Oostvaarders Eco-Glamping', location: 'Flevoland', price: 145, rating: 8.8, reviews: 118,
          who: ['couples','friends'], what: ['glamping'], where: 'flevoland',
          tags: ['Eco','Natuur'], emoji: '✨' },
        { id: 25, name: 'Markermeer Watersport Resort', location: 'Flevoland', price: 138, rating: 8.6, reviews: 203,
          who: ['friends','families-teens'], what: ['adventure-trip','holiday-park'], where: 'flevoland',
          tags: ['Water','Sport'], emoji: '🌊' },

        // Zuid-Holland
        { id: 26, name: 'Kinderdijk Fiets-B&B', location: 'Zuid-Holland', price: 98, rating: 8.7, reviews: 156,
          who: ['seniors','couples','solo'], what: ['hotel'], where: 'zuid-holland',
          tags: ['Fietsen','Erfgoed'], emoji: '🚴' },
        { id: 27, name: 'Scheveningen Beachhouse', location: 'Zuid-Holland', price: 155, rating: 8.5, reviews: 298,
          who: ['families-kids','couples','families-teens'], what: ['hotel','sun'], where: 'zuid-holland',
          tags: ['Aan zee','Gezinnen'], emoji: '🏖️' },
        { id: 28, name: 'Rotterdam Design Hotel', location: 'Zuid-Holland', price: 148, rating: 8.8, reviews: 341,
          who: ['couples','solo','friends'], what: ['city-trip','hotel'], where: 'zuid-holland',
          tags: ['Stad','Design'], emoji: '🏙️' },

        // Zeeland (extra)
        { id: 29, name: 'Zeeuwse Dijk Camping', location: 'Zeeland', price: 58, rating: 8.3, reviews: 412,
          who: ['families-babies','families-kids','pets'], what: ['camping'], where: 'zeeland',
          tags: ['Camping','Aan zee'], emoji: '⛺' },
        { id: 30, name: 'Veerse Meer Glamping', location: 'Zeeland', price: 168, rating: 9.1, reviews: 134,
          who: ['couples','friends'], what: ['glamping','wellness'], where: 'zeeland',
          tags: ['Glamping','Water'], emoji: '✨' },

        // Drenthe (extra)
        { id: 31, name: 'Drents Heide Chalet', location: 'Drenthe', price: 115, rating: 8.6, reviews: 177,
          who: ['seniors','couples'], what: ['holiday-park','wellness'], where: 'drenthe',
          tags: ['Natuur','Rust'], emoji: '🌳' },
        { id: 32, name: 'Hondsrug Boerencamping', location: 'Drenthe', price: 62, rating: 8.5, reviews: 224,
          who: ['pets','families-kids','families-babies'], what: ['camping'], where: 'drenthe',
          tags: ['Boerderij','Dierenvriendelijk'], emoji: '🐄' },

        // Noord-Holland (extra)
        { id: 33, name: 'Texel Duinen Villa', location: 'Noord-Holland', price: 178, rating: 9.0, reviews: 212,
          who: ['families-kids','pets','couples'], what: ['holiday-park'], where: 'noord-holland',
          tags: ['Eiland','Duinen'], emoji: '🏖️' },

        // Friesland (extra)
        { id: 34, name: 'Waddeneiland Beach Hotel', location: 'Friesland', price: 158, rating: 8.9, reviews: 189,
          who: ['couples','seniors','solo'], what: ['hotel','sun'], where: 'friesland',
          tags: ['Eiland','Rust'], emoji: '🏖️' },

        // Groningen (extra)
        { id: 35, name: 'Wadvogels Natuurretraite', location: 'Groningen', price: 132, rating: 8.8, reviews: 97,
          who: ['solo','seniors','couples'], what: ['wellness'], where: 'groningen',
          tags: ['Rust','Natuur'], emoji: '🌾' },

        // Noord-Brabant (extra)
        { id: 36, name: 'Efteling-gebied Familiehotel', location: 'Noord-Brabant', price: 182, rating: 8.7, reviews: 498,
          who: ['families-babies','families-kids','families-teens'], what: ['hotel','holiday-park'], where: 'noord-brabant',
          tags: ['Attracties','Kinderpret'], emoji: '🎡' },

        // Utrecht (extra)
        { id: 37, name: 'Heuvelrug Adventure Camping', location: 'Utrecht', price: 74, rating: 8.4, reviews: 168,
          who: ['families-teens','friends'], what: ['camping','adventure-trip'], where: 'utrecht',
          tags: ['Bos','Sport'], emoji: '⛺' },

        // Gelderland (extra – winter in NL is schaars, maar Veluwe-ski kan ✓)
        { id: 38, name: 'Veluwe Winter Lodge', location: 'Gelderland', price: 165, rating: 8.6, reviews: 142,
          who: ['couples','friends','families-teens'], what: ['winter','wellness'], where: 'gelderland',
          tags: ['Bos','Rust'], emoji: '❄️' },

        // België (extra)
        { id: 39, name: 'Antwerpen Boutique B&B', location: 'België', price: 122, rating: 8.7, reviews: 248,
          who: ['couples','solo','friends'], what: ['city-trip','hotel'], where: 'belgie',
          tags: ['Stad','Boutique'], emoji: '🍫' },

        // Duitsland (extra)
        { id: 40, name: 'Berlijn Design Loft', location: 'Duitsland', price: 138, rating: 8.8, reviews: 387,
          who: ['friends','solo','couples'], what: ['city-trip','hotel'], where: 'duitsland',
          tags: ['Stad','Design'], emoji: '🍺' },

        // Frankrijk (extra)
        { id: 41, name: 'Provence Wellness Gîte', location: 'Frankrijk', price: 192, rating: 9.2, reviews: 156,
          who: ['couples','seniors','families-kids'], what: ['glamping','wellness'], where: 'frankrijk',
          tags: ['Lavendel','Rust'], emoji: '🪻' },

        // Spanje (extra)
        { id: 42, name: 'Madrid Citytrip Hotel', location: 'Spanje', price: 132, rating: 8.6, reviews: 421,
          who: ['friends','solo','couples'], what: ['city-trip','hotel'], where: 'spanje',
          tags: ['Stad','Cultuur'], emoji: '🥘' },

        // Italië (extra)
        { id: 43, name: 'Amalfi Seaview Hotel', location: 'Italië', price: 245, rating: 9.3, reviews: 298,
          who: ['couples','seniors'], what: ['sun','hotel','wellness'], where: 'italie',
          tags: ['Zee','Luxe'], emoji: '🌊' },

        // Portugal (extra)
        { id: 44, name: 'Porto Surf Hostel', location: 'Portugal', price: 58, rating: 8.4, reviews: 512,
          who: ['friends','solo','families-teens'], what: ['adventure-trip','sun'], where: 'portugal',
          tags: ['Surf','Backpack'], emoji: '🏄' },

        // Kroatië (extra)
        { id: 45, name: 'Plitvice Wandel Lodge', location: 'Kroatië', price: 148, rating: 9.0, reviews: 187,
          who: ['couples','friends','seniors'], what: ['adventure-trip','wellness'], where: 'kroatie',
          tags: ['Wandelen','Natuur'], emoji: '🥾' },

        // Oostenrijk (extra) — families + winter combinatie
        { id: 46, name: 'Tirol Familie Chalet', location: 'Oostenrijk', price: 198, rating: 9.0, reviews: 234,
          who: ['families-kids','families-teens','pets'], what: ['winter','holiday-park'], where: 'oostenrijk',
          tags: ['Wintersport','Bergen'], emoji: '⛷️' },

        // Aanvullende pets + solo + extra camping-dekking
        { id: 47, name: 'Biesbosch Kano Camping', location: 'Noord-Brabant', price: 68, rating: 8.4, reviews: 145,
          who: ['solo','friends','pets'], what: ['camping','adventure-trip'], where: 'noord-brabant',
          tags: ['Water','Natuur'], emoji: '🛶' },
        { id: 48, name: 'Zuid-Franse Glamping Deluxe', location: 'Frankrijk', price: 215, rating: 9.2, reviews: 198,
          who: ['couples','families-kids'], what: ['glamping','sun'], where: 'frankrijk',
          tags: ['Glamping','Luxe'], emoji: '☀️' }
    ],
    // Uitgelichte redactionele teksten per categorie
    editorial: {
        who: {
            'families-babies': 'Op vakantie met een baby vraagt om rust, veilige voorzieningen en een flexibel ritme. Denk aan babyfaciliteiten, ruime accommodaties en groene omgevingen zonder al te veel prikkels.',
            'families-kids': 'Vakantie met kinderen betekent entertainment, kinderpret en voldoende ruimte om zich uit te leven. Vakantieparken, campings en resorts met kidsclub scoren hier het hoogst.',
            'families-teens': 'Tieners willen actie: sport, avontuur en sociale sfeer. Locaties aan het water of in de bergen met uitdagende activiteiten staan hier centraal.',
            'couples': 'Romantiek, rust en kwaliteit. Van boutique hotels in de stad tot glamping in de natuur — accommodaties voor twee met oog voor detail.',
            'friends': 'Samen weg met vrienden vraagt om ruimte, een goede sfeer en activiteiten voor iedereen. Villa\'s, chalets en actieve bestemmingen staan hoog op het lijstje.',
            'seniors': 'Comfort, toegankelijkheid en rust. Bestemmingen met milde klimaten, cultuur binnen handbereik en accommodaties die op elk gemak zijn ingericht.',
            'pets': 'Jouw viervoeter gaat mee op reis. Huisdiervriendelijke accommodaties met uitlaatgebieden, hondenstrand in de buurt en ruime tuinen.',
            'solo': 'Alleen op reis is vrijheid. Hostels, boutique hotels en actieve groepsreizen waar je makkelijk anderen ontmoet.'
        },
        what: {
            'camping': 'Terug naar de basis: tent opzetten, kampvuurtje en de sterren boven je. Van eenvoudige natuurkampeerplaatsen tot luxe campings met zwembad.',
            'hotel': 'Het gemak van een hotelverblijf: ontbijt, schoonmaak, concierge. Van boutique-adressen tot internationale ketens.',
            'holiday-park': 'Alles onder één dak: zwembaden, restaurants, speelattributen. Ideaal voor gezinnen die minimaal willen regelen.',
            'glamping': 'Kamperen met de luxe van een hotel: echte bedden, eigen badkamer en vaak een bubbelbad op het terras.',
            'wellness': 'Ontsnappen aan de drukte. Sauna, massage, stilteweides — hier kom je helemaal tot rust.',
            'adventure-trip': 'Mountainbiken, klimmen, raften, trekken. Voor wie actie en natuur combineert.',
            'city-trip': 'Een weekend cultuur, eten en slenteren. Van musea tot verborgen café\'s.',
            'sun': 'Zon, zee en strand. Van Costa Brava tot Algarve — gegarandeerde warmte en blauw water.',
            'winter': 'Skiën, snowboarden of après-ski. Van Oostenrijk tot Zwitserland.'
        }
    },

    // ============ BLOGS ============
    // Structuur: id, title, category, intro, content (markdown-lite), image
    // (gradient:c1,c2|emoji), date. Gebruikt door blogs.html + blog-detail.html.
    blogs: [
        { id: 1, title: '10 tips voor je eerste kampeervakantie', category: 'Kamperen',
          intro: 'Voor het eerst kamperen? Met deze tips voorkom je klassieke fouten en maak je van je trip meteen een succes.',
          content: 'Begin klein en dichtbij huis. Kies een camping met sanitair als je nog niet eerder onder de sterren sliep. Maak een paklijst en check tot 48u van tevoren het weer. Oefen je tent opzetten in de tuin. Neem koelelementen in plaats van losse ijsblokken — handiger en minder nat. Plan je eerste avondmaal eenvoudig: pasta met saus uit blik kost 10 minuten. Noord-Europese campings zijn rustiger in juni dan in augustus. Laat de spelletjes thuis en neem een kaartspel mee: kinderen zijn sneller tevreden dan je denkt. Altijd een zaklamp binnen handbereik. Plan één rustdag per vijf actiedagen. En: geniet van de traagheid.',
          image: 'gradient:#4facfe,#00c6ff|⛺', date: '2024-05-12' },
        { id: 2, title: 'Hidden gems in Zeeland', category: 'Bestemmingen',
          intro: 'Weg van de drukte van Domburg — deze Zeeuwse plekken kent bijna niemand, én ze zijn adembenemend.',
          content: 'Sint-Anna ter Muiden bij Sluis: kleinste stadje van Nederland, doe eerst middag-ijs op het pleintje. Het Verdronken Land van Saeftinghe voor een wandeling tussen zeedijken en slikken — alleen met gids, vooraf reserveren. Oostkapelle heeft de mooiste duinen van Walcheren; ga vroeg voor zonsopgang. Kamperland voor kitesurfers, rustiger dan Vrouwenpolder. En: eet mosselen ter plekke in Yerseke, niet in de havens van Domburg.',
          image: 'gradient:#43e97b,#38f9d7|🏖️', date: '2024-06-20' },
        { id: 3, title: 'Wellness weekend zonder vliegen', category: 'Wellness',
          intro: 'Van Drenthe tot de Ardennen: vijf wellness-adressen in eigen land of dichtbij. Geen vliegschaamte, wel pure rust.',
          content: 'Thermen Bussloo in Gelderland heeft 18 sauna\'s en een rustzone waar spreken niet mag. Thermae 2000 in Valkenburg: buitenbaden met uitzicht op het Heuvelland. De Zwaluwhoeve in Hierden combineert wellness met overnachten. Bij Bodysense in Warnsveld is het klein en persoonlijk. En in de Belgische Ardennen: Elysette bij Spa — fin de siècle-gebouw, moderne treatments. Tip: vraag altijd naar weekmiddag-arrangementen; zaterdag is overal druk.',
          image: 'gradient:#f093fb,#f5576c|💆', date: '2024-07-04' },
        { id: 4, title: 'Wintersport met gezin: waar naartoe?', category: 'Wintersport',
          intro: 'Tirol, Dolomieten of toch Frankrijk? We vergelijken drie populaire skigebieden voor families met kinderen.',
          content: 'Serfaus-Fiss-Ladis in Oostenrijk is dé familie-specialist: gratis kinderopvang vanaf 2.5 jaar, brede groene pistes. Alpe di Siusi in Italië is kleinschalig, uitzicht op Dolomieten, uitstekende Italiaanse keuken. Les Gets in Frankrijk heeft dorpsgevoel en hoort bij groot skigebied Portes du Soleil. Boek in de kerstvakantie minimaal 6 maanden vooruit. Zon-ski in maart is stressvrijer en vaak goedkoper. Huur ski\'s online vooraf — tot 30% korting.',
          image: 'gradient:#667eea,#764ba2|⛷️', date: '2024-11-15' },
        { id: 5, title: 'Zo pak je slim in voor een stedentrip', category: 'Reistips',
          intro: 'Handbagage only is geen straf, mits je slim inpakt. Onze complete checklist voor drie dagen weg.',
          content: 'Rol je kleding op in plaats van vouwen — bespaart ruimte en kreukt minder. Eén goede universele adapter is genoeg voor heel Europa. Neem twee paar schoenen: één om te lopen, één voor \'s avonds. Powerbank van 10.000 mAh voldoet voor drie dagen. Packing cubes helpen om sokken/ondergoed te scheiden. Doe je toilettas in een doorzichtig zakje voor vlotte security check. En: altijd één extra shirt meer dan je denkt nodig te hebben.',
          image: 'gradient:#fa709a,#fee140|🎒', date: '2024-03-08' },
        { id: 6, title: 'Waarom glamping de nieuwe hotelvakantie is', category: 'Inspiratie',
          intro: 'Luxe kamperen heet tegenwoordig glamping — en het aanbod is explosief gegroeid. Hier het waarom.',
          content: 'Glamping combineert de vrijheid van kamperen met het comfort van een hotel: echte bedden, eigen badkamer, vaak zelfs een bubbelbad. In Nederland vind je het op boerderijcampings en in Natuurgebieden; in de Provence op lavendelvelden. De prijs ligt tussen hotel en camping: vanaf €90 per nacht voor 2 personen. Duurzaamheid is een verkoopargument — zonnepanelen, composttoiletten, lokaal voedsel. Ideaal voor koppels die willen proberen of "buiten slapen" iets voor hen is.',
          image: 'gradient:#84fab0,#8fd3f4|✨', date: '2024-09-01' },
        // ----- Hotel-categorie blogs (id 7-10) — gelinkt vanuit de
        // premium "Tips per vakantietype" carousel op de Hotel-pagina.
        { id: 7, title: 'De mooiste boutique hotels in Europa', category: 'Hotels',
          intro: 'Karaktervolle suites, persoonlijke service en geen ketenervaring — onze pick van Europa\'s mooiste boutique hotels.',
          content: 'Boutique hotels zijn het antwoord op anonieme ketens. Onze redactie selecteerde er vijf die echt het verschil maken. In Parijs: Hôtel Particulier Montmartre — verstopt achter een poort, slechts vijf suites, eigen tuin. In Rome: G-Rough — vintage Italiaans design in een 17e-eeuws palazzo. In Lissabon: Memmo Alfama — rooftoppool met uitzicht over de oude stad. In Berlijn: Michelberger — speels en eigenwijs in Friedrichshain. In Wenen: Hotel Altstadt Vienna — kunstwerken in elke kamer, mompelend personeel dat alles weet. Wat ze gemeen hebben: minder dan 50 kamers, eigenaren die persoonlijk betrokken zijn, en een prijs die best te overzien is voor de ervaring.',
          image: 'gradient:#faf3e6,#d4b682|🛎️', date: '2025-02-15' },
        { id: 8, title: '5 wellness hotels voor een romantisch weekend', category: 'Wellness',
          intro: 'Spa, infinity pools en kaarslicht — vijf wellness hotels waar jullie samen tot rust komen.',
          content: 'Een wellness weekend met z\'n tweeën is de perfecte herstart. Onze top vijf wellness hotels in Europa, geselecteerd op privacy, kwaliteit van de spa én romantiek. Lefay Resort & Spa Lago di Garda — infinity pool boven het meer, koppels-rituelen en eigen suite-balkons. Aire Hotel & Ancient Baths in Sevilla — verlichte baden in een 12e-eeuws gebouw, alleen koppels. Therme Vals (Zwitserland) — Peter Zumthor-architectuur, intieme thermen. Six Senses Douro Valley — privé spa-suites met eigen kuipbad en wijnberg-uitzicht. Brenners Park-Hotel & Spa Baden-Baden — klassieke kuurgrandeur. Reserveer de spa-treatments altijd minstens twee weken vooruit.',
          image: 'gradient:#fde6e6,#c89292|💆', date: '2025-03-01' },
        { id: 9, title: 'De leukste citytrip hotels in Italië', category: 'Citytrip',
          intro: 'Van Romeinse rooftops tot Toscaanse stadssuites — Italiaanse hotels met die ene perfecte ligging.',
          content: 'Italiaanse steden zijn pas écht leuk als je hotel direct in het hart ligt. Onze favorieten per stad. Rome: Hotel Locarno bij Piazza del Popolo — art-déco, fietsverhuur en een rooftop bar voor zonsondergangen. Florence: Hotel Brunelleschi in een Byzantijnse toren — koepelview vanaf de dakterras-suite. Venetië: Hotel Flora — verstopte tuin pal naast San Marco, geen drukte. Milaan: Room Mate Giulia naast de Duomo — boetiekbutler en design die niet pocht. Napels: Decumani Hotel de Charme in het historisch centrum — pal boven de pizzeria-straat. Tip: in zomer altijd vragen om kamers boven de derde verdieping voor minder herrie en betere airco.',
          image: 'gradient:#e0eaf5,#6f8ca6|🏙️', date: '2025-02-20' },
        { id: 10, title: 'Hotels met infinity pools', category: 'Luxe',
          intro: 'Zwemmen tot aan de horizon — een selectie hotels met de meest spectaculaire infinity pools van Europa.',
          content: 'Een infinity pool maakt de vakantie. Onze pick van Europa\'s mooiste. Cap Rocat (Mallorca) — oude vesting boven de Middellandse Zee, pool lijkt zo in de baai te lopen. Belmond Hotel Caruso (Amalfikust) — historische pool die wereldberoemd werd door foto\'s; reserveer ontbijt aan de rand. La Réserve Genève (Zwitserland) — meer-uitzicht, jaarrond verwarmd. Six Senses Ibiza — moderne pool met natuurlijke rotsen, sunsetbar. The Pig at Combe (Engeland) — verrassend: heated infinity pool in een Devon-tuin. Boekingstip: vraag bij reservering naar pool-deck-toegang voor non-residenten — sommige hotels rekenen €60 dagpas.',
          image: 'gradient:#e8f0e8,#5d8a6a|🌴', date: '2025-01-12' },

        // ----- Camping-categorie blogs (id 11-14) — gelinkt vanuit
        // de premium "Tips per vakantietype" carousel op de Camping-
        // pagina + de Glamping-sub.
        { id: 11, title: 'De mooiste natuurcampings van Europa', category: 'Kamperen',
          intro: 'Tussen olijfbomen, bergmeren of in een dichtbeboste vallei — vijf natuurcampings waar de plek zelf de bestemming is.',
          content: 'Niet elke camping hoeft een waterglijbaan te hebben. Onze redactie selecteerde vijf natuurcampings waar je vooral wakker wordt van vogels in plaats van animatie-microfoons. Huttopia Sud Ardèche (Frankrijk) — tenten tussen pijnbomen, rivier op vijf minuten lopen. Sea Star (Kroatië) — directe baai-toegang en een nudisten-tolerant beleid in de noordhoek. Sägi-Camping (Zwitserland) — bergmeer, 18 staanplaatsen, geen wifi. Trento Camping Village (Italië) — Dolomieten-uitzicht en avondkok. Vlieland Stortemelk (Nederland) — duinkamperen op een eilandcamping, fiets is de norm. Tip: boek natuurcampings buiten de Nederlandse schoolvakantie — ze zijn dan vaak nóg stiller én tot 30% goedkoper.',
          image: 'gradient:#d8e8c0,#5d8a3f|🌲', date: '2025-02-10' },
        { id: 12, title: 'Glamping voor twee: 5 luxe spots', category: 'Glamping',
          intro: 'Echte bedden, eigen badkamer en vaak een bubbelbad op het terras — vijf glamping-adressen voor een romantisch weekend.',
          content: 'Glamping is de antwoord-vorm voor wie het kamperen-idee mooi vindt, maar liever niet op een matje. Onze top vijf voor koppels. The Original Treehouse Domaine (Frankrijk) — boomhutten met haard, sauna en privé-bubbelbad. Tenuta Stoccareddo (Italië) — yurts in de Toscaanse heuvels, eten van de boerderij. Pinedrops Glamping (Schotland) — safari-tent boven een loch, sterrenwachten vanuit bed. Geversduin Boomstammenhutten (Nederland) — duin-glamping op fietsafstand van Haarlem. Camping Bonelli (Gardameer) — luxe lodges met meeruitzicht, infinity-pool als upgrade. Boek minstens drie maanden vooruit voor zomerweekenden — de echt goede plekken zijn beperkt.',
          image: 'gradient:#f7ece1,#c89a73|✨', date: '2025-02-22' },
        { id: 13, title: 'Kindercampings: zo kies je de juiste', category: 'Kamperen',
          intro: 'Animatie, waterpark, kidsclub — kindercampings beloven veel, maar wat maakt nu echt het verschil?',
          content: 'Met kinderen op de camping kan je trip maken of breken. Vijf criteria die onze redactie altijd checkt voordat we een kindercamping aanraden. Eén: speelzone op loopafstand van staanplaats (kinderen verdwalen niet, ouders houden zicht). Twee: zwemvoorziening met aparte peuterbad én glijbaan-bad — twee leeftijdsgroepen, twee niveaus van geluid. Drie: animatie in eigen taal of in eenvoudige uitleg (Nederlandstalig is een plus, maar Duits/Engels werkt vaak ook). Vier: rustig moment ingebouwd — siesta of stille uren tussen 14-16u maakt de avond rustiger. Vijf: sanitair-blok dichtbij én met famille-douches. Onze favorieten: RCN Belledonne (Frankrijk), Camping Cisano (Italië), Roompot Beach Resort (Zeeland). Boekingstip: tijdens schoolvakanties altijd vroege of late shift in restaurant — middenshift is een mensen-vlecht.',
          image: 'gradient:#e6f0d8,#7ea84f|🎈', date: '2025-01-28' },
        { id: 14, title: 'Camping aan zee: 6 favoriete spots', category: 'Kamperen',
          intro: 'Tent uit, golven binnen handbereik — onze favoriete campings direct aan de Europese kust.',
          content: 'Een camping aan zee is op z\'n best als je vanuit de tent het zout kunt ruiken. Onze zes favorieten. Camping de la Plage (Bretagne) — Atlantische rotskust, vijf minuten lopen naar surfbreak. Sant Pol (Spanje, Costa Brava) — kleine baai, weinig animatie, mooie zonsondergangen. Vlieland Stortemelk (Nederland) — duincamping waar fietsen de norm is. Šimuni (Kroatië, eiland Pag) — kiezelstrand, kristalhelder water. Lanterna (Istrië) — vier zwembaden plus eigen privéstrand. Le Pinède (Corsica) — pijnbos tot aan het strand, vissersdorp om de hoek. Tip: vraag altijd naar pitch met "vue mer" (Frankrijk) of "fronte mare" (Italië) — verschil van €5-€10 per nacht, maar oneindig veel beter ontbijtuitzicht.',
          image: 'gradient:#cfe8f0,#3f7e8a|🏖️', date: '2025-02-14' },

        // ----- Vakantiepark blogs (id 15-17) — gelinkt vanuit de
        // premium carousel op de Vakantiepark-pagina.
        { id: 15, title: 'Vakantieparken met zwemparadijs: 5 toppers', category: 'Vakantiepark',
          intro: 'Tropisch zwembad, golfbaan, kinderbaden — vijf Europese vakantieparken waar het zwembad het hart van de vakantie is.',
          content: 'Een goed zwemparadijs maakt voor gezinnen het verschil tussen een redelijke en een geweldige vakantie. Onze top vijf. Center Parcs De Vossemeren (België) — Aqua Mundo met golfslagbad en buitenrivier. Landal Aelderholt (NL) — overdekt en buitenbad, ideaal voor wisselend weer. Hof van Saksen (Drenthe) — luxe en compleet met sauna voor de ouders. Roompot Bospark de Bikkels (NL) — kleinschalig met overdekte glijbanen. Sunparks Kempense Meren (België) — modernste park van de Sunparks-keten, eigen golfbaan. Tip: ga doordeweeks buiten schoolvakantie — het zwemparadijs is dan minder druk en je glijbaanrij is van 15 minuten naar 2 minuten.',
          image: 'gradient:#cfe3f4,#2d6fb0|🏊', date: '2025-02-18' },
        { id: 16, title: 'Luxe vakantieparken voor koppels', category: 'Vakantiepark',
          intro: 'Geen kidsclub of mini-disco — vier vakantieparken waar de focus juist op rust en luxe ligt.',
          content: 'Niet elk vakantiepark is volgebouwd met kinderspeeltoestellen. Vier parken die zich richten op koppels of senioren. Resort Hof van Saksen (Drenthe) — boerderijvilla\'s met privé-sauna en wellness-suites. Landal Resort Maastricht — kleinschalig, lekker in het Limburgse Heuvelland. Center Parcs Bostalsee (Duitsland) — adults-only zone en sterke restaurantkeuze. Roompot De Katjeskelder (NL) — focus op adults-only sectie met privé hot-tub. Wat ze gemeen hebben: minder dan 200 bungalows, geen schreeuwende animatie en restaurants die meer kunnen dan friet. Boek midweek voor de beste rust.',
          image: 'gradient:#e8e0f0,#7e5d8b|🛁', date: '2025-03-05' },
        { id: 17, title: 'Vakantieparken in de natuur', category: 'Vakantiepark',
          intro: 'Tussen de bomen, naast een meertje of midden in een nationaal park — vakantieparken waar de natuur de hoofdrol speelt.',
          content: 'Een vakantiepark hoeft geen drukke speeltuin te zijn. Vijf parken waar je bungalow letterlijk in de natuur staat. Landal Coldenhove (Veluwe) — hertenkamp, bosrijke wandelpaden. Center Parcs De Eemhof (Flevoland) — aan het Eemmeer, watersport vanuit eigen jachthaven. Hof van Saksen Drenthe — boerderijhuisjes tussen weiden. Vakantiepark Slingerbos (NL) — boschalets op de Veluwe. Center Parcs Park Bostalsee (Duitsland) — direct aan een meer, nationaal park om de hoek. Tip: vraag bij boeking expliciet naar "bos-zicht" of "natuur-side" — vaak gratis upgrade als ze beschikbaar zijn.',
          image: 'gradient:#dceddc,#4a8a52|🌳', date: '2025-02-26' },
    ],

    // ============ REISVERSLAGEN (stories) ============
    // Structuur: id, title, author, content (paragraaf-tekst), image, date.
    // Gebruikt door reisverslagen.html + reisverslag-detail.html.
    stories: [
        { id: 1, title: '3 dagen op Camping De Lakens — eerlijke review', author: 'Lisa · Redacteur kamperen',
          content: 'We arriveerden op een zonnige vrijdag in juni. Onze Safaritent stond op een ruime plek met directe toegang tot het bos. Eerste indruk: netjes, geen rommel, goed onderhouden. Het zwembad was schoon, ruim, met apart peuterbad. De avondanimatie was verrassend goed — geen commercieel gedoe, echt leuke acts. Sanitair kreeg een 9: modern, warm water altijd beschikbaar, nergens een vieze hoek. Minpunt: de prijzen in de supermarkt zijn aan de pittige kant. Neem zelf ontbijt mee als je wilt besparen. Na drie dagen: wij komen zeker terug.',
          image: 'gradient:#4facfe,#00c6ff|🏕️', date: '2024-06-14' },
        { id: 2, title: 'Een week wandelen in Zuid-Tirol', author: 'Mark · Redacteur bergvakanties',
          content: 'Hotel, hut of appartement — de vraag voor elke bergvakantie. Ik testte alle drie in zeven dagen. De Rifugio Puez (berghut) was het avontuur: eenvoudig, samen eten met andere wandelaars, 2500m hoog. Appartement in Kastelruth: ideaal voor langere verblijven met eigen keuken. Hotel Adler in Ortisei: pure luxe maar duur. Mijn advies: hut voor dag 1-2 om hoog te komen, daarna afwisselen met appartement. En: reserveer huttenmaaltijden vooraf.',
          image: 'gradient:#43e97b,#38f9d7|⛰️', date: '2024-08-22' },
        { id: 3, title: 'Wellness-weekenden in Nederland getest', author: 'Anouk · Redacteur wellness',
          content: 'Vier wellness-hotels in één maand: Thermae 2000 (Limburg), Hotel Heerlickheijd (Ermelo), Sanadome (Nijmegen), Fletcher Epe (Veluwe). Verschillen: Thermae scoort op baden, Heerlickheijd op rust, Sanadome op medische behandelingen, Fletcher op prijs. Beste combinatie rust + kwaliteit: Hotel Heerlickheijd. Meest indrukwekkende saunalandschap: Thermae 2000. Budgetkeuze: Fletcher Epe. Nooit op zaterdag gaan — weekmiddag is de gouden tip.',
          image: 'gradient:#f093fb,#f5576c|🧖', date: '2024-09-05' },
        { id: 4, title: 'Vergelijking: Griekse eilanden voor gezinnen', author: 'Kevin · Redacteur zonvakanties',
          content: 'Kreta, Rhodos en Kos — alle drie binnen zes weken bezocht met twee kinderen (6 en 9). Kreta: meest variatie, van bergdorpen tot all-inclusive kust. Rhodos: beste voor geschiedenis én strand. Kos: kleinst, meest overzichtelijk, ideaal met jonge kinderen. Waterparken zijn op elk eiland te vinden. Eten: overal goed, Rhodos iets toeristischer geprijsd. Mijn eindoordeel: met peuters naar Kos, met lagere-schoolkinderen naar Kreta, met tieners naar Rhodos.',
          image: 'gradient:#fa709a,#fee140|🌴', date: '2024-07-18' },
        { id: 5, title: '5 onbekende skigebieden in Oostenrijk', author: 'Esther · Redacteur wintersport',
          content: 'Weg van Kitzbühel en Sölden. Ik zocht rust, betaalbare skipassen en sneeuwzekere gebieden. Top 5: Großarltal (Salzburgerland) — dorpsgevoel, ideaal voor gevorderden; Nauders aan de Reschenpas — mooie verbinding met Italië; Alpbachtal in Tirol — één van de mooiste dorpen; Kals-Matrei bij Grossglockner — hoge ligging, sneeuwzeker; Rauris — kleine skigebied, perfect voor families. Alle passen rond €50/dag — de helft van de bekende resorts.',
          image: 'gradient:#667eea,#764ba2|🎿', date: '2024-12-01' },
        { id: 6, title: 'Stedentrip Porto in een lang weekend', author: 'Tim · Redacteur city-trips',
          content: 'Donderdag aangekomen, zondag weer weg. Voldoende tijd voor Porto als je compact plant. Dag 1: Ribeira-wijk en port-proeverij in Vila Nova de Gaia (aan de overkant van de rivier). Dag 2: Livraria Lello (boekwinkel van Harry Potter — wel vroeg erbij zijn), Mercado do Bolhão en tram 1 langs de kust. Dag 3: Foz do Douro — surfwijk, visrestaurants. Hotel: Torel 1884 centraal, €150/nacht zonder ontbijt. Francesinha eten bij Cafe Santiago — beste van Porto.',
          image: 'gradient:#84fab0,#8fd3f4|🏙️', date: '2024-10-14' },
        // ----- Hotel-themed reisverslagen (id 7-11) — gelinkt vanuit de
        // premium "Reisverslagen van onze redactie" carousel op de
        // Hotel-pagina.
        { id: 7, title: '48 uur in een boutique hotel in Parijs', author: 'Sophie · Redacteur citytrips',
          content: 'Vrijdagavond aangekomen op Gare du Nord, met de metro tien minuten later in de Marais. Het hotel — een kleine boutique met slechts twaalf kamers — zat verstopt achter een binnenplaats. Geen receptiebalie, geen rij; de eigenaar verwelkomde ons persoonlijk met espresso. Kamer 4 was klein maar doordacht: balkonnetje op de straat, regendouche, kussens die ik mee naar huis wilde nemen. Zaterdag begonnen we met ontbijt onder de hand-getekende tegels in de eetzaal: croissants van de bakkerij om de hoek, vers fruit, koffie zonder bodem. Lunch bij Breizh Café (galettes), wandeling door Place des Vosges, koffie en een tentoonstelling in Musée Picasso. Diner in het hotel zelf — vier gangen, alleen voor gasten, één lange tafel. We aten naast een Spaans koppel uit Madrid en een Amerikaanse architect; gesprekken liepen tot middernacht door. Zondag een uur in het Marais-park, en met de Eurostar weer naar huis. Wat dit verblijf bijzonder maakte: niet de luxe, maar de schaal. Geen 200 kamers, geen lobby-buffet, geen anonieme service. Vermijd grote ketens als je twee dagen Parijs doet — een goed boutique hotel maakt de stad twee keer zo intiem.',
          image: 'gradient:#f3e7d2,#c19a5a|🥐', date: '2025-01-20' },
        { id: 8, title: 'Onze favoriete wellness hotels in Italië', author: 'Anouk · Redacteur wellness',
          content: 'In twee weken bezocht ik vier wellness hotels in Italië: van Toscaanse villa tot Comomeer-spa. Eerste stop: Adler Spa Resort Thermae (Bagno Vignoni, Toscane) — thermisch buitenbad in de Val d\'Orcia, beste massage van mijn leven. Tweede stop: Grand Hotel Tremezzo (Comomeer) — drie zwembaden, waarvan eentje drijvend op het meer. Derde stop: Borgo Egnazia (Puglia) — wellness in een nagebouwd Apulisch dorp, treatments in olijfgaarden. Vierde stop: Lefay Resort & Spa Lago di Garda — energy-balance behandelingen volgens Chinese geneeskunde. Mijn rangschikking: Lefay won op innovatie en oog voor detail, Tremezzo op locatie, Adler op authentieke thermale ervaring, Borgo Egnazia op architectuur. Welke past bij wie: koppels → Lefay, gezinnen → Tremezzo (familievriendelijk), pure thermenliefhebbers → Adler, romantische escape → Borgo Egnazia. Tip: rij niet zelf — laat het hotel je ophalen vanaf het station; in alle vier inbegrepen bij hogere arrangementen.',
          image: 'gradient:#f0e6d9,#b59b6a|🌿', date: '2025-02-05' },
        { id: 9, title: 'Een weekend in een design hotel in Kopenhagen', author: 'Mark · Redacteur design',
          content: 'Hotel Sanders zit verstopt naast het Koninklijk Theater. Eigenaar Alexander Kølpin is voormalig balletdanser én Quentin-Tarantino-fan, en dat zie je terug in elke kamer: weloverwogen Scandinavisch comfort met onverwachte details. Boekenkasten met curated titels, fluwelen banken in dieprood, brass armaturen die met de hand geblazen lijken. Mijn kamer (#42) had een loggia met uitzicht op binnenplaats en ontbijt-balkonnetje. Service was opvallend persoonlijk — de receptionist herinnerde mijn ontbijtwens op dag twee zonder te vragen. \'s Avonds in Bar Sanders: één van Kopenhagens beste cocktailbars, geen straat-bordje, je moet weten dat het er is. Dineerden bij Slurp Ramen (vijf minuten lopen) en sloten af met sterke koffie in de hotelbibliotheek. Wat ik leerde: Scandinavisch design is niet kil — als het goed gedaan is, is het juist warm. Sanders bewijst dat. Boek minimaal twee maanden vooruit, kamers vullen snel.',
          image: 'gradient:#e7e0d4,#806d4a|🖤', date: '2025-01-30' },
        { id: 10, title: 'De mooiste rooftop hotels van Europa', author: 'Esther · Redacteur luxe reizen',
          content: 'Twee weken, vijf rooftop hotels, één doel: de mooiste sunset bar van Europa vinden. Verloren over Rome bij The Hoxton (vlak bij Salita del Grillo) — pool boven de heuvel, betaalbaar voor de stad. Tegen de skyline van Barcelona bij The Serras vlakbij Plaça Reial — kleinste rooftop van de lijst maar wel iconisch. Athene: A for Athens — direct uitzicht op de verlichte Akropolis vanaf het kussen, mijn nummer 1. Lissabon: Memmo Alfama — gratis-toegankelijk voor diners, betaalbaar voor 2-personen-tafels. Wenen: 25hours Hotel beim MuseumsQuartier — circus-thema, hippe crowd. Wat ik leerde: een hotel rooftop is alleen écht goed als hij gratis is voor gasten, klein blijft (max 40 plekken), en sluit voor de massa rond 22u. Reserveer altijd vooruit, ook als gast — sunset slots zijn beperkt.',
          image: 'gradient:#f5dfc2,#c97a4a|🌅', date: '2025-02-18' },
        { id: 11, title: 'Hoe wij de perfecte citytrip hotels vonden', author: 'Lisa · Hoofdredacteur',
          content: 'Bij Urlaubspotter testen we jaarlijks honderden hotels. Hoe selecteren we de besten? Eerst de ligging: maximaal 15 minuten lopen vanaf het centrum, en absoluut niet vlak naast een nachtclub of busstation. Tweede criterium: gevel-én-kamer. Een mooi exterieur zonder doordachte kamer-indeling is niets waard. Derde: ontbijt — we noteren of broodjes vers gebakken zijn, of er fruit van het seizoen ligt, of de koffie van een lokale brander komt. Vierde: nachtgeluid. We slapen met openstaand raam om straatlawaai te meten. Vijfde: service onder druk. We checken bewust in op vrijdagavond rond 23u — dat is de échte test van hoe het personeel reageert. Zesde: prijs/sfeer-balans. Een €280-kamer moet drie keer beter aanvoelen dan een €110-kamer, anders zit het ergens scheef. Onze vijf top citytrip hotels van 2024 staan in de bijbehorende selectie — boek vroeg in de week, dan komen we niet tegen vol gepakte weekend-blokken.',
          image: 'gradient:#e6dccd,#8b6914|🗺️', date: '2025-02-28' },

        // ----- Camping-themed reisverslagen (id 12-14) — gelinkt
        // vanuit de premium "Reisverslagen" carousel op de Camping-
        // en Glamping-pagina's.
        { id: 12, title: 'Een week in een Toscaanse glamping-pod', author: 'Lisa · Redacteur kamperen',
          content: 'Eerste indruk telt: na vier uur rijden door olijfgaarden kwamen we op een heuveltop aan waar tien houten pods in een halve cirkel om een gemeenschappelijk vuurkuiltje stonden. Onze pod (nummer 7) had een king-size bed, eigen badkamer met regendouche en een terras met view over de Val d\'Orcia. Dag 1: tot rust komen, ontbijt op het terras (vers brood en seizoensfruit komt elke ochtend in een mandje), middagslaapje, avondmaal op de boerderij. Dag 3: dagtrip naar Pienza en Montepulciano. Dag 5: kookworkshop pasta met de boerin — twee uur, drie soorten verse pasta, daarna samen eten met andere gasten. Dag 7: vertrek met spijt. Wat dit van een gewone hotel-vakantie onderscheidt: de schaal én de stilte. Geen tv, geen lobby, geen toeristen — alleen tien koppels die hetzelfde landschap in zich opnemen. Boekingstip: vraag bij reservering om "pod 5, 7 of 9" — die staan het verst van de gedeelde keuken en hebben het beste uitzicht.',
          image: 'gradient:#f7ece1,#c89a73|🏕️', date: '2025-02-08' },
        { id: 13, title: '10 dagen in een natuurcamping in de Ardennen', author: 'Mark · Redacteur kamperen',
          content: 'Eerste keer met de eigen tent na drie jaar caravan-pauze. Camping La Roche-en-Ardenne, twee uur rijden vanaf Eindhoven. Geen animatie, geen restaurant op het terrein — bewuste keuze. Wat de camping wél heeft: een rivier waar je kunt zwemmen, schaduwrijke pitches, een eenvoudige sanitaire blok met warm water en een kleine speeltuin. Dag 1-3: regen. We aten en sliepen vooral in de tent en speelden eindeloze potjes UNO. Dag 4: zon. Vanaf dag 5 een ritme: ontbijt, fietsen of wandelen, lunch in een dorp, terug naar het kamp om in de rivier te springen, avondmaal bij de tent, vuurtje, sterren. We sliepen elke nacht negen uur. De kinderen hebben twee andere Nederlandse gezinnen ontdekt en speelden dagen achtereen verstoppertje in het bos. Wat ik leerde: een natuurcamping zonder animatie dwingt je tot een ander tempo. De eerste twee dagen voelen leeg; vanaf dag 3 verschuift er iets. Geen schermtijd, geen schema. Boeken: ga vóór 1 april voor de zomerweken — de échte natuurcampings worden snel volgeboekt.',
          image: 'gradient:#dceddc,#4a8a52|⛺', date: '2025-01-22' },
        { id: 14, title: 'Glamping aan zee in Kroatië: ons verslag', author: 'Sophie · Redacteur kamperen',
          content: 'Camping Šimuni op het eiland Pag, juni — net buiten de hoogseizoen-piek. We boekten een glamping-tent: vast onderbouwd, twee slaapkamers, eigen veranda, zee op twee minuten lopen. Wat we niet hadden verwacht: hoe stil het kan zijn als de hoofdvakantie nog niet begonnen is. \'s Ochtends opstaan tussen pijnbomen, ontbijt naast de tent, daarna direct zwemmen in kristalhelder water. Lunch op de camping-pizzeria (verrassend goed), siesta, middag op het strand, avondmaaltijd in het dichtstbijzijnde dorp Novalja (15 minuten met de auto, lekkere visrestaurants). De glamping-tent zelf: prima onderhouden, comfortabel bed, koelkast voldoende, alleen de douche moest soms even op warmwater wachten. Wat dit verblijf bijzonder maakte: de afwezigheid van het "hotel-gevoel". Geen receptie waar je elke ochtend langsmoest, geen ontbijtbuffet met 200 mensen. Alleen wij, de zee, en pijnbomen. Tip: vraag bij Šimuni naar tenten in zone B of D — die staan dichter bij het strand en zijn minder druk.',
          image: 'gradient:#cfe8f0,#3f7e8a|🌊', date: '2025-02-25' },

        // ----- Vakantiepark-themed reisverslagen (id 15-17).
        { id: 15, title: 'Een lang weekend op Center Parcs De Vossemeren', author: 'Kevin · Redacteur familievakanties',
          content: 'We trokken er met twee gezinnen op uit — vier volwassenen, zes kinderen tussen 4 en 12. Cottage met twee slaapkamers, basisuitrusting, prima ingericht. Dag 1 (vrijdag): aankomst, zwemmen in Aqua Mundo tot het sluit. Het golfslagbad was de hit; de kinderen wilden vier keer terug naar het wildwater. Dag 2: ochtend fietsen door het park, middag in Action Factory (klimwand, boogschieten). Avond: pannenkoeken-restaurant. Dag 3: zwemmen, lunch in het park, middag wandelen in het bos eromheen. Vertrek zondagmiddag. Wat goed werkte: alles zo dicht bij elkaar dat de kinderen zelfstandig konden bewegen tussen cottage, zwembad en speeltuin. Wat minder: de prijzen in het park (€10 voor een normale ijscoupe). Tip: doe boodschappen vooraf bij een supermarkt nét voor de poort — bespaart al snel €100 over een lang weekend.',
          image: 'gradient:#cfe3f4,#2d6fb0|🎡', date: '2025-02-04' },
        { id: 16, title: 'Wellness-weekend op Hof van Saksen', author: 'Anouk · Redacteur wellness',
          content: 'Hof van Saksen Drenthe lijkt qua opzet meer op een dorp dan op een vakantiepark — gerestaureerde Saksische boerderijen rondom een centraal plein met restaurants. Wij boekten een 6-persoons boerderij met privé-sauna en hot-tub op het terras. Dag 1: aankomst, sauna voor het diner, eten in het Saksisch restaurant op het plein (verrassend goed). Dag 2: ochtend in het wellness-centrum, lunch, middag wandelen door het Drentse landschap, avond in de hot-tub onder de sterren. Dag 3: ontbijt, nogmaals wellness, vertrek. Het wellness-centrum is groot maar nooit overvol — gasten zitten verspreid over zwembaden, sauna\'s, ligbedden. Personeel discreet en aanwezig op het juiste moment. Wat dit van een hotel-wellness onderscheidt: het schaalt mee met je groep. Met vrienden in dezelfde boerderij, sauna die je alleen met elkaar deelt, terras voor het ontbijt. Niet goedkoop (we betaalden €1.200 voor twee nachten met z\'n zessen) maar als verjaardags-cadeau onbetaalbaar.',
          image: 'gradient:#e8e0f0,#7e5d8b|🛁', date: '2025-03-08' },
        { id: 17, title: 'Een week op Landal Coldenhove met tieners', author: 'Mark · Redacteur familievakanties',
          content: 'Twee tieners (13 en 16) op vakantiepark — wordt vaak afgeraden. Wij probeerden het toch en het werkte. Landal Coldenhove ligt midden op de Veluwe, schoolvakantie meivakantie. Onze bungalow lag rustig aan de bosrand, twee slaapkamers, prima keuken. Dag 1: aankomst, fietsverhuur direct geregeld voor de week (€18/fiets). De jongens fietsten zelfstandig naar het zwembad en kwamen pas terug voor het avondeten. Dag 2: gezamenlijke fietstocht naar Apeldoorn (heen 20 km, terug per trein). Dag 3-5: tieners deden hun eigen ding (zwembad, wandelen met andere tieners die ze ontmoetten, eten halen op het park), wij wandelden in het bos. Avond 6: barbecue op het terras, kaartspelletjes daarna. Vertrek dag 7. Wat goed werkte: ruimte. De Veluwe is groot genoeg dat tieners zich nooit "klein" voelen op een vakantiepark. Wat minder: WiFi-snelheid in de bungalow — vraag bij boeking om een bungalow dichtbij het hoofdgebouw. Tip: meivakantie is goedkoper en rustiger dan zomervakantie maar het zwembad is volledig open.',
          image: 'gradient:#dceddc,#4a8a52|🌳', date: '2025-02-12' }
    ]
};

// Hulpfuncties
const DATA = {
    who: () => Object.entries(SITE_DATA.labels.who),
    what: () => Object.entries(SITE_DATA.labels.what),
    whereAll: () => [...Object.entries(SITE_DATA.labels.whereNL), ...Object.entries(SITE_DATA.labels.whereEU)],
    whereNL: () => Object.entries(SITE_DATA.labels.whereNL),
    whereEU: () => Object.entries(SITE_DATA.labels.whereEU),
    countries: () => Object.entries(SITE_DATA.labels.countries),
    campingTypes: () => Object.entries(SITE_DATA.labels.campingTypes),
    label(dim, key) {
        if (dim === 'where') {
            // 'netherlands' staat in SITE_DATA.labels.countries en moet
            // hier als "Nederland" oplossen zodat pagina-titels als
            // "Design Hotels in Nederland" correct renderen. Provincies
            // gaan via whereNL, EU-landen via whereEU.
            return SITE_DATA.labels.whereNL[key]
                || SITE_DATA.labels.whereEU[key]
                || SITE_DATA.labels.countries[key]
                || key;
        }
        return SITE_DATA.labels[dim]?.[key] || key;
    },
    icon(key) { return SITE_DATA.icons[key] || '📌'; },
    // Sub-type labels per WAT — gebruikt door Niveau 2/3/4 paginas om
    // de WAT-context te behouden i.p.v. te degenereren naar een
    // generieke titel. Resolve `?what=hotel&sub=wellness` als
    // "Wellness Hotels" zodat URLs altijd hun volle filter-intentie
    // tonen.
    subLabel(what, sub) {
        return (SITE_DATA.subLabels?.[what]?.[sub]) || '';
    },
    // Regio-helpers — gebruikt door Niveau3-WaarWat met ?region= zodat
    // continenten en bergachtige aggregaten ook context-bewust
    // renderen ("Hotels in Europa", "Hotels nabij de bergen") i.p.v.
    // te vallen op het generieke Niveau 2 — Waar overzicht of een
    // verkeerd land.
    region(key)            { return key ? (SITE_DATA.regions?.[key]) : null; },
    regionLabel(key)       { return this.region(key)?.label || ''; },
    // displayName = chip/breadcrumb-vorm (bijv. "Bergen", "Aan Zee");
    // valt terug op label wanneer geen displayName gezet is.
    regionDisplayName(key) { return this.region(key)?.displayName || this.region(key)?.label || ''; },
    regionPreposition(key) { return this.region(key)?.preposition || 'in'; },
    filter({ who, what, where, sub, region } = {}) {
        // Sub-niveau (bijv. wellness / boutique / glamping / waterpark)
        // bewaart de subtype-context op Niveau 3/4 paginas zodat de
        // listing daadwerkelijk overeenstemt met de paginatitel.
        // Twee match-strategieen:
        //   1. Sub IS een primary what-key (glamping, wellness, etc.)
        //      → require die what op de accommodatie. Hard filter.
        //   2. Sub is een descriptor (boutique, waterpark, design,
        //      adult-only, ...) → soft match tegen tags + name.
        //      Geen match? Val terug op WAT-only resultaat — beter
        //      dan een lege pagina.
        const subKey = sub ? String(sub).toLowerCase() : '';
        const subIsWat = subKey && SITE_DATA.labels.what[subKey];
        // Tag-haystack vooraf opbouwen per accommodatie zou efficienter
        // zijn maar de dataset is klein; .toLowerCase per call is OK.
        // 'netherlands' is een aggregaat-key (geen accommodatie heeft
        // where='netherlands') en moet matchen tegen alle NL-provincies.
        const NL_KEYS = Object.keys(SITE_DATA.labels.whereNL);
        const whereNL = where === 'netherlands';
        // Region-aggregaat (europa, bergen, etc.) — verzamel de where-
        // keys uit SITE_DATA.regions zodat een region matcht tegen
        // alle landen die eronder vallen.
        const regionDef = region ? SITE_DATA.regions?.[region] : null;
        const regionWheres = regionDef ? regionDef.wheres : null;
        return SITE_DATA.accommodations.filter(a => {
            if (who && !a.who.includes(who)) return false;
            if (what && !a.what.includes(what)) return false;
            if (where) {
                if (whereNL) {
                    if (!NL_KEYS.includes(a.where)) return false;
                } else if (a.where !== where) {
                    return false;
                }
            }
            if (regionWheres) {
                // Lege region (azie/afrika/scandinavie) → geen treffers,
                // wat correct is gegeven de huidige dataset.
                if (!regionWheres.includes(a.where)) return false;
            }
            if (subIsWat && !a.what.includes(subKey)) return false;
            return true;
        });
    },
    // Aparte sub-aware filter die de soft tag-match ook toepast voor
    // descriptor-subs. Geeft eerst een strict gefilterde lijst; als die
    // leeg is en sub een descriptor is, valt het terug op WAT-resultaat.
    filterWithSub({ who, what, where, sub, region } = {}) {
        const strict = this.filter({ who, what, where, sub, region });
        if (!sub) return strict;
        const subKey = String(sub).toLowerCase();
        const subIsWat = SITE_DATA.labels.what[subKey];
        if (subIsWat) return strict; // hard-match was al gedaan
        // Descriptor-sub: probeer een tag/name match
        const descriptorLabel = (this.subLabel(what, sub) || '').toLowerCase();
        const tagMatched = strict.filter(a => {
            const haystack = ((a.tags || []).join(' ') + ' ' + (a.name || ''))
                .toLowerCase();
            return haystack.includes(subKey) || (descriptorLabel && haystack.includes(descriptorLabel));
        });
        return tagMatched.length ? tagMatched : strict;
    },
    editorial(dim, key) { return SITE_DATA.editorial[dim]?.[key] || ''; }
};
