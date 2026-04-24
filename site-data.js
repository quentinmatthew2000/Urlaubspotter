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
          image: 'gradient:#84fab0,#8fd3f4|✨', date: '2024-09-01' }
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
          image: 'gradient:#84fab0,#8fd3f4|🏙️', date: '2024-10-14' }
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
        if (dim === 'where') return SITE_DATA.labels.whereNL[key] || SITE_DATA.labels.whereEU[key] || key;
        return SITE_DATA.labels[dim]?.[key] || key;
    },
    icon(key) { return SITE_DATA.icons[key] || '📌'; },
    filter({ who, what, where } = {}) {
        return SITE_DATA.accommodations.filter(a => {
            if (who && !a.who.includes(who)) return false;
            if (what && !a.what.includes(what)) return false;
            if (where && a.where !== where) return false;
            return true;
        });
    },
    editorial(dim, key) { return SITE_DATA.editorial[dim]?.[key] || ''; }
};
