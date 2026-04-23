// ===========================================================
// URLAUBSPOTTER — Navigatiestructuur (Niveau 2 → 5)
// Volledig Nederlands; gesynchroniseerd met Homepagina.html
// Deep-link via URL: ?filter=who|what|where&value=<slug>
// ===========================================================

const app = {
    // ========== STATE ==========
    state: {
        currentPage: 'listing',
        pageHistory: [],
        activeFilters: {
            who: [], what: [], where: [],
            accommodation: [], location: [], budget: [], facilities: []
        },
        currentDetailId: null,
        priceView: 'night'
    },

    // ========== LABELS ==========
    // Sleutels matchen de data-value op de homepagina.
    // Weergegeven labels zijn in het Nederlands.
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
            'adventure': 'Actief / Avontuur',
            'city-trip': 'Weekendje weg',
            'sun': 'Zonvakantie',
            'winter': 'Wintervakantie'
        },
        where: {
            'netherlands': 'Nederland',
            'belgium': 'België',
            'germany': 'Duitsland',
            'france': 'Frankrijk',
            'spain': 'Spanje',
            'italy': 'Italië',
            'austria': 'Oostenrijk',
            'portugal': 'Portugal',
            'croatia': 'Kroatië',
            'switzerland': 'Zwitserland'
        },
        accommodation: {
            'bungalow': 'Bungalow',
            'hotel-room': 'Hotelkamer',
            'safari-tent': 'Safaritent',
            'chalet': 'Chalet',
            'apartment': 'Appartement',
            'villa': 'Villa'
        },
        location: {
            'sea': 'Aan zee',
            'lake': 'Aan een meer',
            'mountains': 'In de bergen',
            'nature': 'Nabij natuur/bos',
            'city': 'In de stad',
            'remote': 'Afgelegen'
        },
        budget: {
            'budget': 'Budget (€ – €€)',
            'comfort': 'Comfort (€€ – €€€)',
            'luxury': 'Luxe (€€€ – €€€€)',
            'last-minute': 'Last Minutes',
            'discount': 'Korting',
            'offers': 'Aanbiedingen',
            'packages': 'Pakketreizen'
        },
        facilities: {
            'water': 'Wateractiviteiten',
            'kids-fun': 'Kinderpret',
            'all-inclusive': 'All inclusive',
            'sports-games': 'Sport en spel',
            'adventure': 'Avontuur',
            'relax': 'Ontspanning',
            'pet-friendly': 'Diervriendelijk',
            'adult-only': 'Adult Only',
            'luxe': 'Luxe',
            'nature': 'Natuur',
            'festive': 'Feestelijk'
        }
    },

    // ========== DATA ==========
    accommodations: [
        {
            id: 1,
            name: 'Camping Zonneschijn',
            location: 'Costa Brava, Spanje',
            whereKey: 'spain',
            whatKeys: ['camping'],
            whoKeys: ['families-kids', 'families-babies'],
            accommodationKeys: ['bungalow', 'safari-tent'],
            locationKeys: ['sea'],
            facilityKeys: ['water', 'kids-fun', 'sports-games', 'festive'],
            stars: 4,
            coords: { x: 70, y: 60 },
            idealFor: "Gezinnen met kinderen van 0–12 jaar, ook geschikt voor tieners.",
            situated: "Zonnig gelegen aan de Spaanse Middellandse Zeekust, op loopafstand van het strand.",
            editorial: "Camping Zonneschijn is een solide keuze voor gezinnen met jonge kinderen (0–10 jaar). Het aquapark en de kinderanimatie maken indruk, en de strandligging is een groot voordeel. De safaritenten zijn functioneel maar niet luxe—overweeg een comfort-upgrade voor een beter verblijf. Het animatieteam is enthousiast en creatief. Let op: in schoolvakanties is het park snel vol.",
            ratingFrame: { ligging: 9.2, schoon: 8.8, personeel: 9.0, voorzieningen: 8.5, 'prijs/kwaliteit': 8.2, eten: 7.8 },
            climate: [
                { month: 'Mei', temp: 22, rain: 6, sun: 8 },
                { month: 'Juni', temp: 26, rain: 4, sun: 10 },
                { month: 'Juli', temp: 29, rain: 2, sun: 11 },
                { month: 'Aug', temp: 28, rain: 3, sun: 10 },
                { month: 'Sept', temp: 25, rain: 5, sun: 8 }
            ],
            editorialStories: [
                {
                    rating: 7.5,
                    title: '"De welness was geweldig"',
                    author: 'Quentin',
                    role: 'Redactielid',
                    with: 'Met zijn vrouw',
                    when: 'Zomervakantie 2023',
                    excerpt: 'Ik en mijn vriendin waren op zoek naar een boutique hotel met wellness om even lekker tot rust te komen. Uiteindelijk zijn we uitgekomen op…',
                    replies: 1
                },
                {
                    rating: 7.2,
                    title: '"Ons kindje heeft een super tijd gehad!"',
                    author: 'Mardy',
                    role: 'Redactielid',
                    with: 'Met een baby en een peuter',
                    when: 'Meivakantie 2023',
                    excerpt: 'Wij waren in afgelopen meivakantie een bezoek gaan brengen aan landal. Ons kindje heeft erg kunnen genieten van de kidsclub terwijl papa en mama lekker…',
                    replies: 1
                }
            ],
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop'
            ],
            price: 85, rating: 8.5, reviews: 324,
            description: 'Bruisende familiecamping met waterpark en animatie aan de Spaanse kust.',
            longDescription: 'Camping Zonneschijn is dé topbestemming voor gezinnen die plezier en ontspanning zoeken. Een uitgebreid aquapark, professionele kinderanimatie en directe toegang tot het strand.',
            rooms: ['Strandbungalow', 'Safaritent', 'Familiechalet'],
            faq: [
                { q: 'Is er gratis WiFi?', a: 'Ja, snelle WiFi is gratis op het hele terrein.' },
                { q: 'Wat zijn de inchecktijden?', a: 'Inchecken vanaf 15:00, uitchecken vóór 11:00.' },
                { q: 'Is ontbijt inbegrepen?', a: 'Ontbijt is apart te boeken of bij het all-in pakket inbegrepen.' }
            ],
            hotspots: [
                { name: 'Strand Lloret de Mar', distance: '200m' },
                { name: 'Historisch Tossa de Mar', distance: '15 km' },
                { name: 'Wijnstreek Penedès', distance: '45 km' }
            ],
            providers: [
                { name: 'TUI', price: 85 },
                { name: 'Sunweb', price: 79 },
                { name: 'Corendon', price: 89 }
            ]
        },
        {
            id: 2,
            name: 'Resort Strand & Zee',
            location: 'Algarve, Portugal',
            whereKey: 'portugal',
            whatKeys: ['hotel'],
            whoKeys: ['couples'],
            accommodationKeys: ['hotel-room'],
            locationKeys: ['sea'],
            facilityKeys: ['relax', 'luxe', 'adult-only', 'all-inclusive'],
            stars: 5,
            coords: { x: 50, y: 70 },
            idealFor: "Koppels en stellen die luxe en rust zoeken, adult-only sfeer.",
            situated: "Aan de zuidkust van de Algarve met privéstrand en uitzicht op zee.",
            editorial: "Resort Strand & Zee biedt echte luxe voor koppels: attent personeel, een uitstekende spa en een privéstrand dat z’n naam waarmaakt. Het restaurant is een hoogtepunt; reserveer vooraf. Niet geschikt voor kleine kinderen—dit is bewust een rustige, volwassen omgeving.",
            ratingFrame: { ligging: 9.5, schoon: 9.3, personeel: 9.4, voorzieningen: 9.1, 'prijs/kwaliteit': 8.4, eten: 9.2 },
            climate: [
                { month: 'Mei', temp: 21, rain: 4, sun: 9 },
                { month: 'Juni', temp: 25, rain: 2, sun: 11 },
                { month: 'Juli', temp: 28, rain: 1, sun: 12 },
                { month: 'Aug', temp: 28, rain: 1, sun: 11 },
                { month: 'Sept', temp: 25, rain: 3, sun: 9 }
            ],
            editorialStories: [
                { rating: 8.6, title: '"Romantisch weekend aan zee"', author: 'Sanne', role: 'Redactielid', with: 'Met mijn partner', when: 'April 2024', excerpt: 'De spa is top en het eten was verfijnd. Een aanrader voor een romantisch weekend…', replies: 3 }
            ],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
            ],
            price: 180, rating: 9.0, reviews: 456,
            description: 'Luxe strandresort met wereldklasse faciliteiten aan de Algarve-kust.',
            longDescription: 'Een premium strandresort met spa-behandelingen, gourmet dining en privéstrand. Perfect voor koppels die luxe en romantiek zoeken.',
            rooms: ['Superior Room', 'Deluxe Suite', 'Zeezicht Suite'],
            faq: [
                { q: 'Is er roomservice?', a: 'Ja, 24 uur per dag.' },
                { q: 'Is er een spa?', a: 'Ja, volledige spa met lokale behandelingen.' }
            ],
            hotspots: [
                { name: 'Privéstrand', distance: '0 m' },
                { name: 'Golfbaan Lagos', distance: '10 km' }
            ],
            providers: [
                { name: 'TUI', price: 180 },
                { name: 'Sunweb', price: 175 },
                { name: 'Corendon', price: 189 }
            ]
        },
        {
            id: 3,
            name: 'Berghut Alpen',
            location: 'Tiroler Alpen, Oostenrijk',
            whereKey: 'austria',
            whatKeys: ['adventure', 'camping'],
            whoKeys: ['friends', 'couples'],
            accommodationKeys: ['chalet'],
            locationKeys: ['mountains', 'nature'],
            facilityKeys: ['adventure', 'sports-games', 'nature'],
            stars: 3,
            coords: { x: 60, y: 40 },
            idealFor: "Vriendengroepen en avonturiers die de bergen in willen.",
            situated: "Hoog in de Tiroolse Alpen, direct aan wandelroutes en skipistes.",
            editorial: "Berghut Alpen is rustiek, warm en authentiek. Perfect voor actieve vakanties—wandelen in de zomer, skiën in de winter. De gedeelde eettafel schept een gemoedelijke sfeer. Minpunt: het kan koud zijn in het tussenseizoen, neem warme kleding mee.",
            ratingFrame: { ligging: 9.4, schoon: 8.6, personeel: 9.1, voorzieningen: 7.9, 'prijs/kwaliteit': 8.7, eten: 8.5 },
            climate: [
                { month: 'Juni', temp: 17, rain: 9, sun: 7 },
                { month: 'Juli', temp: 20, rain: 8, sun: 8 },
                { month: 'Aug', temp: 19, rain: 8, sun: 7 },
                { month: 'Dec', temp: -3, rain: 12, sun: 3 },
                { month: 'Jan', temp: -5, rain: 11, sun: 3 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop'
            ],
            price: 95, rating: 8.7, reviews: 215,
            description: 'Rustieke berghut met adembenemende uitzichten in de Oostenrijkse Alpen.',
            longDescription: 'Authentieke berghut in het hart van de Alpen. Ideaal voor natuurliefhebbers, wandelaars en vriendengroepen.',
            rooms: ['Chalet standaard', 'Chalet met sauna'],
            faq: [
                { q: 'Zijn huisdieren toegestaan?', a: 'Ja, honden zijn welkom tegen een kleine toeslag.' },
                { q: 'Is er een restaurant?', a: 'Ja, met lokale Tiroolse keuken.' }
            ],
            hotspots: [
                { name: 'Wandelroute Zillertal', distance: '1 km' },
                { name: 'Hallstatt', distance: '60 km' }
            ],
            providers: [
                { name: 'TUI', price: 95 },
                { name: 'Sunweb', price: 92 },
                { name: 'Corendon', price: 99 }
            ]
        },
        {
            id: 4,
            name: 'Glamping Toscane',
            location: 'Toscane, Italië',
            whereKey: 'italy',
            whatKeys: ['glamping', 'camping'],
            whoKeys: ['couples', 'friends'],
            accommodationKeys: ['safari-tent'],
            locationKeys: ['nature'],
            facilityKeys: ['relax', 'luxe', 'nature', 'adult-only'],
            stars: 5,
            coords: { x: 55, y: 55 },
            idealFor: "Koppels en kleine vriendengroepen die van luxe natuur houden.",
            situated: "Midden tussen de glooiende heuvels van Chianti, omringd door wijngaarden.",
            editorial: "Glamping Toscane is een gedroomde luxe natuurbeleving. De infinity pool is magisch bij zonsondergang en de outdoor cinema is een unieke toevoeging. Tenten zijn ruim en stijlvol ingericht. Let op: bereikbaarheid is wisselend—een auto is echt nodig.",
            ratingFrame: { ligging: 9.6, schoon: 9.2, personeel: 9.0, voorzieningen: 8.9, 'prijs/kwaliteit': 8.0, eten: 9.3 },
            climate: [
                { month: 'Mei', temp: 22, rain: 5, sun: 9 },
                { month: 'Juni', temp: 26, rain: 3, sun: 11 },
                { month: 'Juli', temp: 30, rain: 2, sun: 12 },
                { month: 'Aug', temp: 29, rain: 3, sun: 11 },
                { month: 'Sept', temp: 25, rain: 5, sun: 9 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
            ],
            price: 250, rating: 9.2, reviews: 198,
            description: 'Weelderig glampen in het hart van Toscane met uitzicht op de heuvels.',
            longDescription: 'Unieke glamping ervaring met luxe tenten, infinity pool en outdoor cinema onder de sterren.',
            rooms: ['Luxe glamping tent', 'Safari lodge'],
            faq: [
                { q: 'Is er een zwembad?', a: 'Ja, een infinity pool met uitzicht op de heuvels.' }
            ],
            hotspots: [
                { name: 'Siena', distance: '25 km' },
                { name: 'Chianti wijngaarden', distance: '5 km' }
            ],
            providers: [
                { name: 'TUI', price: 250 },
                { name: 'Sunweb', price: 239 },
                { name: 'Corendon', price: 259 }
            ]
        },
        {
            id: 5,
            name: 'Vakantiepark Veluwe',
            location: 'Gelderland, Nederland',
            whereKey: 'netherlands',
            whatKeys: ['holiday-park'],
            whoKeys: ['families-kids', 'families-teens', 'families-babies'],
            accommodationKeys: ['bungalow', 'chalet'],
            locationKeys: ['nature'],
            facilityKeys: ['water', 'kids-fun', 'sports-games', 'nature'],
            stars: 4,
            coords: { x: 40, y: 45 },
            idealFor: "Gezinnen met kinderen (0–12 jaar), ook geschikt voor tieners.",
            situated: "Rustig gelegen in de natuur van Midden-Limburg, gemeente Roggel.",
            editorial: "Vakantiepark De Leistert is een solide keuze voor gezinnen met jonge kinderen (0–10 jaar). Het overdekte plaza met speeljungle en het subtropisch zwembad maken het park weerbestendig. De standaard bungalows zijn functioneel maar niet luxe—overweeg een comfort-upgrade voor een beter slaapcomfort. Het animatieteam is enthousiast en creatief. Let op: in schoolvakanties is het park snel vol.",
            ratingFrame: { ligging: 9.0, schoon: 8.7, personeel: 8.8, voorzieningen: 8.9, 'prijs/kwaliteit': 8.3, eten: 7.8 },
            climate: [
                { month: 'Mei', temp: 16, rain: 10, sun: 6 },
                { month: 'Juni', temp: 19, rain: 9, sun: 7 },
                { month: 'Juli', temp: 22, rain: 9, sun: 7 },
                { month: 'Aug', temp: 22, rain: 9, sun: 7 },
                { month: 'Sept', temp: 18, rain: 10, sun: 5 }
            ],
            editorialStories: [
                { rating: 7.2, title: '"Ons kindje heeft een super tijd gehad!"', author: 'Mardy', role: 'Redactielid', with: 'Met een baby en een peuter', when: 'Meivakantie 2023', excerpt: 'Wij waren in afgelopen meivakantie een bezoek gaan brengen aan landal. Ons kindje heeft erg kunnen genieten van de kidsclub terwijl papa en mama lekker…', replies: 1 }
            ],
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'
            ],
            price: 110, rating: 8.6, reviews: 512,
            description: 'Ruim vakantiepark in de Veluwse natuur — ideaal voor gezinnen.',
            longDescription: 'Familiepark met tropisch zwembad, fietsverhuur en uitgebreide kinderanimatie. Midden in de Veluwse bossen.',
            rooms: ['4-persoons bungalow', '6-persoons chalet', 'Luxe villa'],
            faq: [
                { q: 'Zijn honden welkom?', a: 'Ja, in speciaal daarvoor aangewezen bungalows.' }
            ],
            hotspots: [
                { name: 'Hoge Veluwe', distance: '12 km' },
                { name: 'Apenheul', distance: '20 km' }
            ],
            providers: [
                { name: 'TUI', price: 110 },
                { name: 'Sunweb', price: 105 },
                { name: 'Corendon', price: 119 }
            ]
        },
        {
            id: 6,
            name: 'Boetiekhotel Parijs',
            location: 'Parijs, Frankrijk',
            whereKey: 'france',
            whatKeys: ['hotel', 'city-trip'],
            whoKeys: ['couples', 'solo'],
            accommodationKeys: ['hotel-room'],
            locationKeys: ['city'],
            facilityKeys: ['luxe', 'relax', 'festive'],
            stars: 4,
            coords: { x: 50, y: 50 },
            idealFor: "Koppels en solo-reizigers op citytrip in Parijs.",
            situated: "In het hart van Parijs, op loopafstand van Louvre en Seine.",
            editorial: "Boetiekhotel Parijs combineert Parijse charme met modern comfort. Vriendelijke service, uitstekende locatie en stijlvolle kamers. Het ontbijt is een hoogtepunt. Kamers aan de straatkant kunnen licht rumoerig zijn—vraag om een hofkamer voor extra rust.",
            ratingFrame: { ligging: 9.8, schoon: 9.0, personeel: 9.1, voorzieningen: 8.4, 'prijs/kwaliteit': 8.2, eten: 9.0 },
            climate: [
                { month: 'Apr', temp: 14, rain: 8, sun: 6 },
                { month: 'Mei', temp: 18, rain: 8, sun: 7 },
                { month: 'Juni', temp: 21, rain: 7, sun: 8 },
                { month: 'Sept', temp: 20, rain: 7, sun: 6 },
                { month: 'Okt', temp: 15, rain: 9, sun: 5 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=800&h=600&fit=crop'
            ],
            price: 140, rating: 8.9, reviews: 287,
            description: 'Stijlvol boetiekhotel in hartje Parijs met uitzicht op de Seine.',
            longDescription: 'Klein, persoonlijk hotel met ontwerpinterieur, op loopafstand van Louvre en Eiffeltoren.',
            rooms: ['Parijs Klassiek', 'Seine View Suite'],
            faq: [
                { q: 'Is ontbijt inbegrepen?', a: 'Ja, Frans ontbijt is inbegrepen bij alle kamers.' }
            ],
            hotspots: [
                { name: 'Eiffeltoren', distance: '1,2 km' },
                { name: 'Louvre', distance: '800 m' }
            ],
            providers: [
                { name: 'TUI', price: 140 },
                { name: 'Sunweb', price: 135 },
                { name: 'Corendon', price: 145 }
            ]
        }
    ],

    // ========== INIT ==========
    init() {
        // Unified site header: alle pagina's delen dezelfde header via site.js
        if (typeof renderHeader === 'function') renderHeader('nav');
        this.bindTabs();
        this.bindBrowserBack();
        const params = new URLSearchParams(window.location.search);

        // Slug-mapping: site-data.js gebruikt andere slugs dan navigatie.js
        const whereMap = {
            'drenthe':'netherlands','gelderland':'netherlands','limburg':'netherlands','zeeland':'netherlands',
            'noord-holland':'netherlands','overijssel':'netherlands','flevoland':'netherlands','friesland':'netherlands',
            'groningen':'netherlands','noord-brabant':'netherlands','zuid-holland':'netherlands','utrecht':'netherlands',
            'belgie':'belgium','duitsland':'germany','frankrijk':'france','spanje':'spain',
            'italie':'italy','oostenrijk':'austria','portugal':'portugal','kroatie':'croatia',
            'netherlands':'netherlands','belgium':'belgium','germany':'germany','france':'france',
            'spain':'spain','italy':'italy','austria':'austria','croatia':'croatia'
        };
        const whatMap = { 'adventure-trip':'adventure','adventure':'adventure' };

        // 1) Deep-link naar detail-pagina: ?acc=<id>
        const accId = parseInt(params.get('acc'));
        if (accId) {
            let found = this.accommodations.find(a => a.id === accId);
            // Fallback: synthese vanuit SITE_DATA als deze ID alleen daar bestaat
            if (!found && typeof SITE_DATA !== 'undefined') {
                const src = SITE_DATA.accommodations.find(a => a.id === accId);
                if (src) {
                    const grad = (window.gradientFor && gradientFor(src)) || 'linear-gradient(135deg,#667eea,#764ba2)';
                    const emoji = src.emoji || '🏝️';
                    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'>
                         <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                         <stop offset='0%' stop-color='#667eea'/><stop offset='100%' stop-color='#764ba2'/>
                         </linearGradient></defs>
                         <rect width='1200' height='700' fill='url(%23g)'/>
                         <text x='600' y='400' font-size='240' text-anchor='middle' font-family='system-ui'>${emoji}</text>
                         </svg>`)}`;
                    const synth = {
                        id: src.id,
                        name: src.name,
                        location: src.location,
                        price: src.price,
                        rating: src.rating,
                        reviews: src.reviews,
                        tags: src.tags || [],
                        images: [placeholder, placeholder, placeholder],
                        description: `${src.name} in ${src.location}. ${(src.tags||[]).join(' · ')}.`,
                        longDescription: `${src.name} is een ${(src.tags||[]).join(', ').toLowerCase()} accommodatie in ${src.location}. Onze redactie beoordeelt deze plek met ${src.rating}/10 op basis van ${src.reviews} reviews.`,
                        editorial: 'De redactie werkt nog aan een uitgebreid reisverslag voor deze accommodatie.',
                        facilities: ['WiFi','Parkeren','Ontbijt inbegrepen','Kindvriendelijk'],
                        // facilityKeys wordt gebruikt door renderDetail (USP-rij + facility-lijst)
                        // en door filter-logica; leeg array voorkomt TypeError op .slice/.map.
                        facilityKeys: [],
                        accommodationKeys: [],
                        whoKeys: src.who || [],
                        whatKeys: src.what || [],
                        whereKey: src.where || '',
                        faq: [
                            { q: 'Is parkeren inbegrepen?', a: 'Ja, gratis parkeren is beschikbaar.' },
                            { q: 'Is er WiFi?', a: 'Ja, gratis WiFi door de hele accommodatie.' },
                            { q: 'Wat is het annuleringsbeleid?', a: 'Gratis annuleren tot 14 dagen voor aankomst.' }
                        ],
                        coords: { x: 50, y: 50 },
                        hotspots: [
                            { name: 'Dichtstbijzijnde supermarkt', distance: '1.2 km' },
                            { name: 'Restaurant', distance: '800 m' },
                            { name: 'Bezienswaardigheid', distance: '3 km' }
                        ],
                        // rooms is overal in dit bestand een array van strings (kamernamen),
                        // niet objects — zie andere acc-entries. Zelfde vorm aanhouden.
                        rooms: ['Standaard kamer', 'Comfort kamer', 'Suite'],
                        providers: [{ name: 'Booking.com', price: src.price }, { name: 'Expedia', price: Math.round(src.price*1.05) }]
                    };
                    this.accommodations.push(synth);
                    found = synth;
                }
            }
            if (found) {
                this.state.activeFilters = { who:[], what:[], where:[], accommodation:[], location:[], budget:[], facilities:[] };
                this.goToDetail(accId);
                return;
            }
        }

        // 2) Meerdere filters via ?who=&what=&where=
        const who = params.get('who');
        const what = params.get('what');
        const whereRaw = params.get('where');
        const where = whereRaw ? (whereMap[whereRaw] || whereRaw) : null;
        const whatMapped = what ? (whatMap[what] || what) : null;

        const hasAny = (who && this.labels.who[who]) || (whatMapped && this.labels.what[whatMapped]) || (where && this.labels.where[where]);
        if (hasAny) {
            this.state.activeFilters = { who:[], what:[], where:[], accommodation:[], location:[], budget:[], facilities:[] };
            if (who && this.labels.who[who]) this.state.activeFilters.who.push(who);
            if (whatMapped && this.labels.what[whatMapped]) this.state.activeFilters.what.push(whatMapped);
            if (where && this.labels.where[where]) this.state.activeFilters.where.push(where);
            // Bij meerdere filters of een volledige combinatie → direct listing tonen
            this.goToListing();
            return;
        }

        // 3) Oude deep-link: ?filter=who|what|where&value=<slug>
        const filter = params.get('filter');
        const value = params.get('value');
        if (filter && value && this.labels[filter] && this.labels[filter][value]) {
            this.startFromEntry(filter, value);
        } else if (filter && this.labels[filter]) {
            this.openCategoryPage(filter);
        } else {
            // Geen parameters of bekende filter → stuur gebruiker naar de nieuwe Alle vakanties-pagina
            window.location.replace('alle-vakanties.html');
        }
    },

    bindTabs() {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
        });
    },

    bindBrowserBack() {
        // Geen eigen popstate-handler meer: het oude handler riep goBack() aan die op
        // zijn beurt history.back() aanroept — dat gaf oneindige recursie. De browser
        // regelt terug-navigatie nu zelf; onze eigen "← Terug"-knop gebruikt goBack().
    },

    // ========== NAVIGATIE ==========
    goToPage(pageName, pushHistory = true) {
        if (pushHistory && this.state.currentPage && this.state.currentPage !== pageName) {
            this.state.pageHistory.push(this.state.currentPage);
        }
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(`page-${pageName}`);
        if (!target) return;
        target.classList.add('active');
        this.state.currentPage = pageName;

        // Oude in-pagina header is vervangen door unified .site-header.
        // updateHeader() is nu een no-op wanneer #active-filters-display ontbreekt.
        this.updateHeader();
        window.scrollTo(0, 0);
    },

    goBack() {
        // 1) Interne detail → listing: blijf binnen Navigatie.html
        if (this.state.currentPage === 'detail' && document.getElementById('page-listing')) {
            this.goToPage('listing', false);
            return;
        }
        // 2) Anders: echte browser-history gebruiken (komt van elders binnen de site)
        if (document.referrer) {
            try {
                const ref = new URL(document.referrer);
                if (ref.origin === location.origin) {
                    history.back();
                    return;
                }
            } catch (_) { /* ongeldige referrer: val door naar home */ }
        }
        // 3) Geen zinnige history → terug naar de homepage
        window.location.href = 'index.html';
    },

    // ========== ENTRY VAN HOMEPAGINA ==========
    // Wordt aangeroepen met een filter-key (who|what|where) en een value slug.
    // Pre-selecteert de filter en brengt de gebruiker naar de category-pagina.
    startFromEntry(filterKey, value) {
        // Reset filters, pre-select de meegegeven waarde
        this.state.activeFilters = {
            who: [], what: [], where: [],
            accommodation: [], location: [], budget: [], facilities: []
        };
        if (this.labels[filterKey] && this.labels[filterKey][value]) {
            this.state.activeFilters[filterKey].push(value);
        }
        this.openCategoryPage(filterKey);
    },

    openCategoryPage(focusKey) {
        const titles = {
            who: { title: 'Wie gaat er mee?', sub: 'Verfijn op type vakantie en bestemming' },
            what: { title: 'Wat voor vakantie?', sub: 'Kies je reisgezelschap en favoriete bestemming' },
            where: { title: 'Waar wil je heen?', sub: 'Bepaal je reisgezelschap en type vakantie' }
        };
        const cfg = titles[focusKey] || { title: 'Verfijn jouw keuze', sub: 'Kies waar je mee wilt beginnen' };
        document.getElementById('category-title').textContent = cfg.title;
        document.getElementById('category-subtitle').textContent = cfg.sub;
        this.renderCategoryFilters();
        this.goToPage('category');
    },

    goToCombination() {
        this.renderCombinationFilters();
        this.goToPage('combination');
    },

    goToListing() {
        this.renderListing();
        this.goToPage('listing');
    },

    goToDetail(id) {
        this.state.currentDetailId = id;
        this.renderDetail();
        this.goToPage('detail');
    },

    // ========== RENDER: CATEGORY (Niveau 2) ==========
    renderCategoryFilters() {
        this.renderChips('filter-who', 'who');
        this.renderChips('filter-what', 'what');
        this.renderChips('filter-where', 'where');
        this.updateMatchCount('match-count');
    },

    // ========== RENDER: COMBINATION (Niveau 3) ==========
    renderCombinationFilters() {
        const container = document.getElementById('combination-filters');
        container.innerHTML = `
            <div class="filter-group">
                <h3>👥 Wie gaat er mee?</h3>
                <div class="filter-chips" id="combo-filter-who"></div>
            </div>
            <div class="filter-group">
                <h3>🏖️ Wat voor vakantie?</h3>
                <div class="filter-chips" id="combo-filter-what"></div>
            </div>
            <div class="filter-group">
                <h3>🗺️ Waar wil je heen?</h3>
                <div class="filter-chips" id="combo-filter-where"></div>
            </div>
        `;
        this.renderChips('combo-filter-who', 'who');
        this.renderChips('combo-filter-what', 'what');
        this.renderChips('combo-filter-where', 'where');
        this.renderChips('filter-accommodation', 'accommodation');
        this.renderChips('filter-location', 'location');
        this.renderChips('filter-budget', 'budget');
        this.renderChips('filter-facilities', 'facilities');
        this.updateMatchCount('combo-match-count');
    },

    // ========== RENDER: LISTING (Niveau 4) ==========
    renderListing() {
        ['who','what','where','accommodation','location','budget','facilities'].forEach(key => {
            this.renderChips(`sidebar-filter-${key}`, key, true);
        });
        this.updateListing();
    },

    updateListing() {
        const filtered = this.sortAccommodations(this.getFilteredAccommodations());
        const grid = document.getElementById('accommodations-grid');
        const noResults = document.getElementById('no-results');
        document.getElementById('results-count').textContent = filtered.length;

        if (filtered.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        grid.innerHTML = filtered.map(acc => {
            const tagLabels = [
                ...acc.whatKeys.slice(0,1).map(k => this.labels.what[k]),
                ...acc.locationKeys.slice(0,1).map(k => this.labels.location[k])
            ].filter(Boolean);
            return `
                <div class="accommodation-card" onclick="app.goToDetail(${acc.id})">
                    <img src="${acc.image}" alt="${acc.name}" loading="lazy">
                    <div class="accommodation-card-content">
                        <h3>${acc.name}</h3>
                        <p class="accommodation-card-location">${acc.location}</p>
                        <div class="accommodation-card-rating">⭐ ${acc.rating.toFixed(1)} (${acc.reviews})</div>
                        <div class="accommodation-card-price">€${acc.price}/nacht</div>
                        <div class="accommodation-card-tags">
                            ${tagLabels.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ========== RENDER: DETAIL (Niveau 5) ==========
    renderDetail() {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        this.state.currentSlide = 0;

        // Header
        document.getElementById('detail-title').textContent = acc.name;
        const starsEl = document.getElementById('detail-stars');
        if (starsEl && acc.stars) {
            starsEl.innerHTML = '★'.repeat(acc.stars) + '<span style="color:#dee2e6">' + '★'.repeat(5 - acc.stars) + '</span>';
        }

        // Slider
        document.getElementById('detail-main-image').src = acc.images[0];
        document.getElementById('slider-index').textContent = 1;
        document.getElementById('slider-total').textContent = acc.images.length;
        document.getElementById('gallery-thumbnails').innerHTML = acc.images.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="app.changeImage(${idx}, this)">
                <img src="${img}" alt="Afbeelding ${idx+1}" loading="lazy">
            </div>
        `).join('');

        // USP-rij: iconen voor de belangrijkste faciliteiten
        const uspIconMap = {
            'water': { icon: '🌊', label: 'Water' },
            'kids-fun': { icon: '🎠', label: 'Kinderpret' },
            'all-inclusive': { icon: '🍽️', label: 'All-in' },
            'sports-games': { icon: '⚽', label: 'Sport' },
            'adventure': { icon: '🧗', label: 'Avontuur' },
            'relax': { icon: '🧘', label: 'Relax' },
            'pet-friendly': { icon: '🐕', label: 'Hond' },
            'adult-only': { icon: '🥂', label: 'Adult' },
            'luxe': { icon: '✨', label: 'Luxe' },
            'nature': { icon: '🌲', label: 'Natuur' },
            'festive': { icon: '🎉', label: 'Feestelijk' }
        };
        // Render alle tags; CSS verbergt op mobiel de items vanaf de 7e tot de
        // gebruiker "Meer" aantikt. Op desktop blijft het grid alles tonen.
        const facilityKeys = acc.facilityKeys || [];
        const uspItems = facilityKeys.map(k => {
            const cfg = uspIconMap[k] || { icon: '•', label: this.labels.facilities[k] || k };
            return `<div class="usp-item"><div class="usp-circle">${cfg.icon}</div><span class="usp-label">${cfg.label}</span></div>`;
        }).join('');
        const uspRow = document.getElementById('usp-row');
        const hasOverflow = facilityKeys.length > 6;
        uspRow.classList.toggle('has-overflow', hasOverflow);
        uspRow.classList.remove('expanded');
        uspRow.innerHTML = uspItems + (hasOverflow
            ? `<button type="button" class="usp-item usp-more" onclick="app.toggleUspExpanded()"><div class="usp-circle">⋯</div><span class="usp-label">Meer</span></button>`
            : '');

        // In het kort
        document.getElementById('ihk-list').innerHTML = `
            <li><span class="ihk-icon">🧑</span><div><strong>Ideaal voor:</strong> ${acc.idealFor || acc.whoKeys.map(k => this.labels.who[k]).filter(Boolean).join(', ')}</div></li>
            <li><span class="ihk-icon">🌳</span><div><strong>Ligging:</strong> ${acc.situated || acc.location}</div></li>
            <li><span class="ihk-icon">⭐</span><div><strong>Beoordeling:</strong> ${acc.rating.toFixed(1)}/10 op basis van ${acc.reviews} beoordelingen</div></li>
        `;

        document.getElementById('detail-location').textContent = '📍 ' + acc.location;
        document.getElementById('detail-description').textContent = acc.description;
        document.getElementById('detail-price').textContent = `€${acc.price}`;

        // Sticky CTA
        document.getElementById('sticky-cta-title').textContent = acc.name;
        document.getElementById('sticky-cta-price').textContent = `€${acc.price}`;

        // ===== Details-tab =====
        document.getElementById('editorial-verdict').textContent = acc.editorial ||
            'De redactie werkt aan een uitgebreid oordeel voor deze accommodatie.';
        document.getElementById('detail-long-description').textContent = acc.longDescription;
        // "Belangrijkste faciliteiten" is vervangen door het Reviews-blok (zie verderop).
        this.renderReviewsRail(acc);

        // Reisverslagen van onze redactie
        const storiesEl = document.getElementById('editorial-stories');
        if ((acc.editorialStories || []).length === 0) {
            storiesEl.innerHTML = `<p style="color:var(--secondary)">Er zijn nog geen redactie-reisverslagen voor deze accommodatie.</p>`;
        } else {
            storiesEl.innerHTML = acc.editorialStories.map(s => `
                <article class="story-card">
                    <div class="story-tags">
                        <span class="story-verified">✓ ZELF BEZOCHT &amp; GEVERIFIEERD</span>
                        <span class="story-rating">★ ${s.rating.toFixed(1)}</span>
                    </div>
                    <h4 class="story-title">${s.title}</h4>
                    <div class="story-author">
                        <div class="story-avatar">👤</div>
                        <div class="story-meta">
                            <div class="name">${s.author} <span class="verified-check">✓</span></div>
                            <div><strong>Rol:</strong> ${s.role}</div>
                            <div><strong>Met wie:</strong> ${s.with}</div>
                            <div><strong>Bezocht:</strong> ${s.when}</div>
                        </div>
                    </div>
                    <p class="story-excerpt">${s.excerpt}</p>
                    <div class="story-footer">
                        <span>${s.replies} reacties</span>
                        <a href="#" class="story-read" onclick="event.preventDefault();">Lees reisverslag →</a>
                    </div>
                </article>
            `).join('');
        }

        // Het oude inline "Beoordelingen van gasten" blok is vervangen door
        // renderReviewsRail() bovenaan de Details-tab.

        // Rooms — direct zichtbaar met afbeelding per kamertype
        const roomGradients = [
            ['#667eea','#764ba2'], ['#f093fb','#f5576c'], ['#4facfe','#00c6ff'],
            ['#43e97b','#38f9d7'], ['#fa709a','#fee140'], ['#a8edea','#fed6e3']
        ];
        const roomEmoji = (name) => {
            const s = (name || '').toLowerCase();
            if (s.includes('suite')) return '🛏️';
            if (s.includes('villa')) return '🏡';
            if (s.includes('chalet')) return '🏔️';
            if (s.includes('bungalow')) return '🏘️';
            if (s.includes('tent') || s.includes('safari') || s.includes('glamping')) return '⛺';
            if (s.includes('apart') || s.includes('appart')) return '🏢';
            if (s.includes('lodge')) return '🌲';
            return '🛏️';
        };
        document.getElementById('rooms-list').innerHTML = acc.rooms.map((r, i) => {
            const [c1, c2] = roomGradients[i % roomGradients.length];
            const emoji = roomEmoji(r);
            const img = `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='300' viewBox='0 0 480 300'>
                 <defs><linearGradient id='rg' x1='0' y1='0' x2='1' y2='1'>
                 <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
                 </linearGradient></defs>
                 <rect width='480' height='300' fill='url(%23rg)'/>
                 <text x='240' y='180' font-size='120' text-anchor='middle' font-family='system-ui'>${emoji}</text>
                 </svg>`)}`;
            return `
                <div class="room-item">
                    <img class="room-image" src="${img}" alt="${r}" loading="lazy">
                    <div class="room-body">
                        <div class="room-name">${r}</div>
                        <p>Comfortabel en goed uitgerust met moderne voorzieningen.</p>
                    </div>
                </div>
            `;
        }).join('');

        // ===== Info-tab =====
        // Klimaat
        const region = acc.location.split(',').slice(-1)[0].trim();
        document.getElementById('climate-title').textContent = `Weer & Klimaat — ${region}`;
        document.getElementById('climate-months').innerHTML = (acc.climate || []).map(m => `
            <div class="climate-month">
                <div class="month-name">${m.month}</div>
                <div class="climate-row">☀️ ${m.temp}°C</div>
                <div class="climate-row">💧 ${m.rain} dagen regen</div>
                <div class="climate-row">🌞 ${m.sun}u zon</div>
            </div>
        `).join('');

        // Locatie & hotspots — eenvoudige kaart met pins
        const mapEl = document.getElementById('hotspot-map');
        const accX = acc.coords?.x ?? 50;
        const accY = acc.coords?.y ?? 50;
        // Genereer deterministische posities voor hotspot-pins rondom de accommodatie
        const hotspotPins = acc.hotspots.map((h, i) => {
            const angle = (i / Math.max(acc.hotspots.length, 1)) * Math.PI * 2;
            const r = 18 + (i % 2) * 6;
            const x = Math.max(8, Math.min(92, accX + Math.cos(angle) * r));
            const y = Math.max(15, Math.min(85, accY + Math.sin(angle) * r));
            return `<span class="hotspot-pin" data-kind="hotspot" style="left:${x}%; top:${y}%" title="${h.name}">📍</span>`;
        }).join('');
        mapEl.innerHTML = `
            <span class="hotspot-pin" data-kind="accommodation" style="left:${accX}%; top:${accY}%" title="${acc.name}">📍</span>
            ${hotspotPins}
        `;
        document.getElementById('hotspots-list').innerHTML =
            acc.hotspots.map(h => `<li><span>📍 <strong>${h.name}</strong></span><span>${h.distance}</span></li>`).join('');

        // Beoordelingskader
        const frame = acc.ratingFrame || {};
        document.getElementById('rating-frame').innerHTML = Object.entries(frame).map(([label, val]) => {
            const pct = Math.max(0, Math.min(100, (val / 10) * 100));
            const cap = label.charAt(0).toUpperCase() + label.slice(1);
            return `
                <div class="rating-row">
                    <span class="rating-label">${cap}</span>
                    <div class="rating-bar-wrap"><div class="rating-bar-fill" style="width:${pct}%"></div></div>
                    <span class="rating-value">${val.toFixed(1)}</span>
                </div>
            `;
        }).join('');

        // FAQ + locatie-info
        document.getElementById('faq-accordion').innerHTML = acc.faq.map(f => `
            <div class="faq-item">
                <div class="faq-question" onclick="app.toggleFAQ(this)">
                    <span>${f.q}</span>
                    <span class="faq-toggle">▼</span>
                </div>
                <div class="faq-answer"><p>${f.a}</p></div>
            </div>
        `).join('');
        document.getElementById('location-info').textContent =
            `Gelegen in ${acc.location}, op korte afstand van lokale attracties en voorzieningen.`;

        // Prices
        this.renderPriceComparison(acc);

        // Alternatieven
        const alts = this.accommodations
            .filter(a => a.id !== acc.id &&
                (a.whereKey === acc.whereKey || a.whatKeys.some(w => acc.whatKeys.includes(w))))
            .slice(0, 3);
        document.getElementById('alternatives-grid').innerHTML = alts.map(a => `
            <div class="card" onclick="app.goToDetail(${a.id})">
                <img src="${a.image}" alt="${a.name}" loading="lazy">
                <div class="card-content">
                    <h3>${a.name}</h3>
                    <p class="card-location">${a.location}</p>
                    <div class="card-rating">⭐ ${a.rating.toFixed(1)}/10</div>
                    <div class="card-price">€${a.price}/nacht</div>
                </div>
            </div>
        `).join('');
    },

    renderPriceComparison(acc) {
        const sortBy = document.getElementById('price-sort')?.value || 'price-asc';
        const sorted = [...acc.providers].sort((a,b) =>
            sortBy === 'price-asc' ? a.price - b.price : b.price - a.price);
        const cheapest = Math.min(...acc.providers.map(p => p.price));

        document.getElementById('price-table').innerHTML = `
            <thead>
                <tr><th>Aanbieder</th><th>Prijs</th><th>Actie</th></tr>
            </thead>
            <tbody>
                ${sorted.map(p => `
                    <tr class="${p.price === cheapest ? 'cheapest' : ''}">
                        <td class="provider-name">${p.name}</td>
                        <td class="provider-price">€${p.price}</td>
                        <td><button class="btn-book" onclick="alert('Boeken bij ${p.name}')">Boek</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    },

    // ========== FILTER LOGIC ==========
    renderChips(containerId, filterKey, reRenderOnToggle = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const labels = this.labels[filterKey];
        container.innerHTML = Object.entries(labels).map(([value, label]) => `
            <button class="filter-chip ${this.state.activeFilters[filterKey].includes(value) ? 'active' : ''}"
                    onclick="app.toggleFilter('${filterKey}', '${value}', ${reRenderOnToggle})">
                ${label}
            </button>
        `).join('');
    },

    toggleFilter(filterKey, value, reRenderListing = false) {
        const arr = this.state.activeFilters[filterKey];
        const idx = arr.indexOf(value);
        if (idx > -1) arr.splice(idx, 1); else arr.push(value);

        this.updateHeader();

        if (this.state.currentPage === 'category') this.renderCategoryFilters();
        else if (this.state.currentPage === 'combination') this.renderCombinationFilters();
        else if (this.state.currentPage === 'listing' || reRenderListing) this.renderListing();
    },

    clearFilters() {
        Object.keys(this.state.activeFilters).forEach(k => this.state.activeFilters[k] = []);
        if (this.state.currentPage === 'listing') this.renderListing();
        else if (this.state.currentPage === 'combination') this.renderCombinationFilters();
        else if (this.state.currentPage === 'category') this.renderCategoryFilters();
        this.updateHeader();
    },

    getFilteredAccommodations() {
        const f = this.state.activeFilters;
        return this.accommodations.filter(acc => {
            if (f.who.length && !f.who.some(v => acc.whoKeys.includes(v))) return false;
            if (f.what.length && !f.what.some(v => acc.whatKeys.includes(v))) return false;
            if (f.where.length && !f.where.includes(acc.whereKey)) return false;
            if (f.accommodation.length && !f.accommodation.some(v => acc.accommodationKeys.includes(v))) return false;
            if (f.location.length && !f.location.some(v => acc.locationKeys.includes(v))) return false;
            if (f.facilities.length && !f.facilities.some(v => acc.facilityKeys.includes(v))) return false;
            if (f.budget.length) {
                // Voor prijsklasse filteren we op prijs; aanbieding-tags (last-minute, korting, ...) filteren we niet weg
                const priceKeys = f.budget.filter(b => ['budget','comfort','luxury'].includes(b));
                if (priceKeys.length) {
                    const match = priceKeys.some(b => {
                        if (b === 'budget') return acc.price < 100;
                        if (b === 'comfort') return acc.price >= 100 && acc.price < 180;
                        if (b === 'luxury') return acc.price >= 180;
                        return true;
                    });
                    if (!match) return false;
                }
            }
            return true;
        });
    },

    sortAccommodations(list) {
        const sortBy = document.getElementById('sort-select')?.value || 'default';
        const sorted = [...list];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a,b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a,b) => b.price - a.price); break;
            case 'rating-desc': sorted.sort((a,b) => b.rating - a.rating); break;
        }
        return sorted;
    },

    updateMatchCount(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = this.getFilteredAccommodations().length;
    },

    // ========== HEADER CHIPS ==========
    updateHeader() {
        // De oude top-header met #active-filters-display is vervangen door de
        // unified .site-header. Filter-chips verschijnen op de listing-pagina
        // nog steeds in de sidebar. Deze functie is een no-op wanneer het
        // oude element niet meer bestaat.
        const display = document.getElementById('active-filters-display');
        if (!display) return;
        const tags = [];
        for (const [key, values] of Object.entries(this.state.activeFilters)) {
            values.forEach(v => tags.push({ key, value: v, label: this.labels[key]?.[v] || v }));
        }
        display.innerHTML = tags.map(t => `
            <div class="filter-tag">
                ${t.label}
                <button onclick="app.toggleFilter('${t.key}', '${t.value}', true)">×</button>
            </div>
        `).join('');
    },

    // ========== UI HELPERS ==========
    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        const pane = document.getElementById(`tab-${tabName}`);
        pane.classList.add('active');

        // Scroll altijd naar de top van het tab-blok, ook als de gebruiker ver
        // naar beneden gescrold staat. Explicit met window.scrollTo zodat we
        // niet afhankelijk zijn van scroll-padding-top of scrollIntoView-
        // gedrag dat soms genegeerd wordt bij sticky descendants.
        const tabs = document.querySelector('.tabs');
        if (!tabs) return;
        // Wacht een frame tot de nieuwe .tab-content is gerenderd (layout kan
        // verschuiven doordat een andere pane in beeld kwam).
        requestAnimationFrame(() => {
            const siteHeader = document.querySelector('.site-header');
            const headerH = siteHeader ? siteHeader.offsetHeight : 64;
            const tabsTop = tabs.getBoundingClientRect().top + window.pageYOffset;
            const targetY = Math.max(0, tabsTop - headerH - 8);
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    },

    // Klap de USP-rij (faciliteiten-tags) uit/in op mobiel
    toggleUspExpanded() {
        const row = document.getElementById('usp-row');
        if (row) row.classList.toggle('expanded');
    },

    // ===== Reviews-rail (vervangt 'Belangrijkste faciliteiten') =====
    // Rendert een sleepbare rij review-kaarten op de Details-tab.
    // Gebruikt acc.reviewsList als die bestaat; anders worden deterministische
    // placeholder-reviews gegenereerd op basis van het id van de accommodatie
    // en het totaal aantal reviews (acc.reviews).
    renderReviewsRail(acc) {
        const rail = document.getElementById('reviews-rail');
        const total = document.getElementById('reviews-total');
        const allLink = document.getElementById('reviews-all-link');
        const writeBtn = document.getElementById('btn-write-review');
        if (!rail) return;

        const totalCount = typeof acc.reviews === 'number' ? acc.reviews : 0;
        if (total) total.textContent = totalCount;
        if (allLink) allLink.onclick = (e) => {
            e.preventDefault();
            // Plekhouder: in een echt backend-scenario gaat dit naar een reviews-
            // overzichtspagina. Voor nu tonen we een notificatie.
            alert(`Alle ${totalCount} reviews komen hier straks — volledig overzicht volgt.`);
        };
        if (writeBtn) writeBtn.onclick = () => {
            alert('Review schrijven — functionaliteit volgt in de volgende stap.');
        };

        // Gebruik echte review-data wanneer beschikbaar, anders placeholders
        const reviews = (acc.reviewsList && acc.reviewsList.length)
            ? acc.reviewsList
            : this.buildPlaceholderReviews(acc);

        const stars = (r) => {
            const full = Math.floor(r);
            const half = r - full >= 0.5 ? 1 : 0;
            const empty = 5 - full - half;
            return '★'.repeat(full) + (half ? '⯪' : '') + '☆'.repeat(empty);
        };
        rail.innerHTML = reviews.map(r => `
            <article class="review-card">
                <div class="review-stars" aria-label="${r.rating.toFixed(1)} van de 5 sterren">${stars(r.rating)}</div>
                <h4 class="review-title">"${r.title}"</h4>
                <p class="review-text">${r.text}</p>
                <div class="review-meta">${r.author} · ${r.date}</div>
            </article>
        `).join('');

        // Activeer sleepbare rail (hergebruik bestaande helper uit site.js)
        if (typeof makeHorizontalRail === 'function') {
            makeHorizontalRail(rail, { itemMinWidth: 320 });
        }
    },

    // Genereert 4 deterministische placeholder-reviews per accommodatie.
    // Zodra echte review-data bestaat (acc.reviewsList) wordt deze niet meer
    // gebruikt — structuur blijft identiek zodat frontend niet hoeft te wijzigen.
    buildPlaceholderReviews(acc) {
        const pool = [
            { title: 'Geweldig voor kids', text: 'Echt een aanrader voor de meivakantie. Het zwembad is super schoon en de animatie doet enorm hun best. We komen zeker terug!', author: 'Familie de Vries', date: 'Mei 2023' },
            { title: 'Leuk, maar druk in hoogseizoen', text: 'Het park is prima verzorgd, maar in het hoogseizoen is het erg vol. Huisje was ruim genoeg voor 6 personen.', author: 'Anoniem', date: 'Augustus 2023' },
            { title: 'Prachtige omgeving', text: 'Rustgevende plek, vriendelijk personeel. We hebben hier heerlijk gewandeld en gefietst. Aanrader!', author: 'Marjolein B.', date: 'September 2024' },
            { title: 'Prijs-kwaliteit top', text: 'Voor deze prijs kregen we een heel nette accommodatie met alles erop en eraan. Bedden waren uitstekend.', author: 'Peter & Sanne', date: 'Juli 2024' }
        ];
        const base = Math.max(3.5, Math.min(5, (acc.rating || 8.5) / 2));
        return pool.map((r, i) => ({ ...r, rating: Math.round((base - i * 0.3) * 2) / 2 }));
    },

    changeImage(idx, el) {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        this.state.currentSlide = idx;
        document.getElementById('detail-main-image').src = acc.images[idx];
        document.getElementById('slider-index').textContent = idx + 1;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        if (el) {
            el.classList.add('active');
        } else {
            const thumb = document.querySelectorAll('.thumbnail')[idx];
            if (thumb) thumb.classList.add('active');
        }
    },

    sliderNav(dir) {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        const total = acc.images.length;
        const next = ((this.state.currentSlide ?? 0) + dir + total) % total;
        this.changeImage(next);
    },

    toggleFAQ(el) {
        const answer = el.nextElementSibling;
        answer.classList.toggle('active');
        el.querySelector('.faq-toggle').classList.toggle('active');
    },

    sortPrices() {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (acc) this.renderPriceComparison(acc);
    },

    togglePriceView(mode) {
        this.state.priceView = mode;
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.toggle-btn[data-toggle="${mode}"]`).classList.add('active');
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        if (mode === 'person') {
            // Indicatief: ca. 2 personen per kamer
            document.getElementById('detail-price').textContent = `€${Math.round(acc.price / 2)}`;
            document.getElementById('price-unit').textContent = 'per persoon per nacht';
        } else {
            document.getElementById('detail-price').textContent = `€${acc.price}`;
            document.getElementById('price-unit').textContent = 'per accommodatie per nacht';
        }
    }
};

app.init();
