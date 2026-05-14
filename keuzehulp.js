// ============================================================
//  KEUZEHULP — Slimme Aanbevelingsengine
//
//  Doel van dit bestand: de matching-laag onder de Keuzehulp-flow
//  van "letterlijke tag-vergelijking" naar "ervaren reisadviseur"
//  tillen. Geen UI-, routing- of layout-wijzigingen.
//
//  De engine redeneert in drie lagen:
//
//   1. HARDE EISEN (exclude bij conflict)
//      Verblijfstype + Adult-Only + gezin-met-kinderen + harde
//      vakantietype-keuze (Hotels/Campings/Vakantieparken). Een
//      adult-only resort verschijnt nooit bij een gezin met
//      kinderen; een tent-keuze sluit hotelkamers uit.
//
//   2. INTENT-MATCHING (gewogen score)
//      Iedere keuzehulp-optie wordt vertaald naar één of meer
//      onderliggende thema's (TAG_INTENTS). "Koppels" impliceert
//      romantisch + rust + boutique + wellness. "Wintervakanties"
//      impliceert ski + bergen + chalet. De engine telt thema-
//      overlap, niet labels — zo wint een wellness-resort bij
//      "Koppels + Ontspanning" ook zonder dat het label "Koppels"
//      op de accommodatie staat.
//
//   3. MENSELIJKE UITLEG (positives + cautions)
//      We genereren géén robotachtige tag-readouts ("heeft
//      wellness, geen zwembad") maar contextuele zinnen
//      ("Rustige wellness sfeer", "Mooie ligging aan zee",
//      "Minder geschikt voor jonge kinderen"). De regels staan
//      in HUMAN_RULES — elke regel matched op een combinatie
//      van user-keuze + accommodatie-eigenschap.
//
//  De keuzehulp-opties in Keuzehulp.html zijn de canonical source
//  of truth: data-value attributen mogen NIET veranderen. Dit
//  bestand consumeert die exacte values.
// ============================================================

const state = {
    currentStep: 1,
    totalSteps: 8,
    answers: {
        reisgezelschap: [],
        vakantietype: [],
        budget: [],
        bestemming: [],
        verblijfstype: [],
        ligging: [],
        faciliteiten: []
    }
};

// ============================================================
//  GEWICHTEN per categorie (uit de spec)
//  Reisgezelschap en Verblijfstype zijn de zwaarste — een gezin
//  past niet bij adult-only, en een hotelkamer-zoeker accepteert
//  geen tent. Faciliteiten zijn het lichtst — wensen, geen eisen.
// ============================================================
const WEIGHTS = {
    reisgezelschap: 10,
    verblijfstype:  10,
    vakantietype:   8,
    budget:         7,
    bestemming:     6,
    ligging:        5,
    faciliteiten:   4
};

// ============================================================
//  TAG → THEMA-INTENT
//  Vertaalt iedere user-keuze naar onderliggende reisthema's.
//  Een thema is een free-form sleutel die ook op de
//  accommodatie als acc.themes staat. Match = thema-overlap.
// ============================================================
const TAG_INTENTS = {
    // -- Reisgezelschap --
    'families-babies':  ['family', 'kid-safe', 'rust', 'clean', 'baby-friendly', 'near-amenities'],
    'families-kids':    ['family', 'kids-fun', 'entertainment', 'active', 'kid-safe'],
    'families-teens':   ['family', 'active', 'sports', 'adventure', 'social', 'teen-friendly'],
    'volwassenen':      ['adult', 'comfort', 'quality'],
    'seniors':          ['rust', 'comfort', 'wellness', 'cultuur', 'accessible', 'quiet'],
    'couples':          ['romantic', 'wellness', 'rust', 'boutique', 'adult', 'intimate'],
    'friends':          ['social', 'entertainment', 'nightlife', 'active', 'group'],
    'solo':             ['cultural', 'boutique', 'centrum', 'flexible', 'safe-solo'],
    'pets':             ['pet-friendly', 'nature', 'space'],

    // -- Vakantietype (atmosfeer-componenten; type-componenten zijn HARD) --
    'hotel':            ['comfort', 'service'],
    'camping':          ['outdoor', 'nature', 'budget-friendly'],
    'holiday-park':     ['family', 'entertainment', 'all-in-one'],
    'city-trip':        ['centrum', 'cultural', 'short-break'],
    'sun':              ['warm', 'beach', 'summer'],
    'winter':           ['snow', 'ski', 'mountain', 'cozy'],
    'adult-only-trip':  ['adult', 'rust', 'romantic', 'wellness'],
    'ontspanning-vakantie': ['rust', 'wellness', 'spa', 'quiet'],
    'actief-vakantie':  ['active', 'adventure', 'sports', 'outdoor'],

    // -- Budget --
    'budget':           ['affordable', 'value'],
    'comfort':          ['comfort', 'mid-tier'],
    'luxe':             ['luxury', 'premium', 'boutique'],
    'last-minute':      ['affordable', 'flexible'],
    'aanbiedingen':     ['affordable', 'value'],
    'pakketreizen':     ['all-inclusive', 'convenient', 'planned'],

    // -- Bestemming — geen thema's; pure country/continent match --

    // -- Ligging --
    'aan-zee':          ['beach', 'coast'],
    'in-bergen':        ['mountain', 'alpine', 'cozy'],
    'aan-meer':         ['lake', 'nature', 'water'],
    'natuur':           ['nature', 'quiet', 'green'],
    'centrum':          ['centrum', 'urban', 'cultural'],
    'afgelegen':        ['remote', 'quiet', 'nature'],

    // -- Verblijfstype — HARD; thema-impact als bonus --
    'tent':             ['outdoor', 'budget-friendly'],
    'caravan':          ['outdoor', 'family'],
    'mobile-home':      ['outdoor', 'family'],
    'bungalow':         ['family', 'space'],
    'chalet':           ['cozy', 'mountain'],
    'safari-tent':      ['glamping', 'nature', 'unique'],
    'villa':            ['luxury', 'space', 'privacy'],
    'hotel-kamer':      ['service', 'comfort'],
    'appartement':      ['flexible', 'self-catering'],

    // -- Faciliteiten --
    'binnenzwembad':    ['swimming', 'rainy-day-proof'],
    'glijbanen':        ['kids-fun', 'water'],
    'kids-fun':         ['kids-fun', 'family'],
    'all-inclusive':    ['all-inclusive', 'convenient'],
    'sports-games':     ['active', 'sports'],
    'outdoor':          ['active', 'outdoor'],
    'relax':            ['rust', 'wellness'],
    'bezienswaardigheden': ['cultural'],
    'fietsroutes':      ['active', 'outdoor', 'nature'],
    'looproutes':       ['active', 'outdoor', 'nature'],
    'pet-friendly':     ['pet-friendly'],
    'facility-luxe':    ['luxury', 'premium'],
    'entertainment':    ['entertainment', 'social'],
    'open-bar':         ['social', 'adult'],
    'live-muziek':      ['entertainment', 'social'],
    'aan-strand':       ['beach', 'coast']
};

// ============================================================
//  HARDE CONFLICTEN (exclude rules)
//  Combinaties die fundamenteel onmogelijk zijn — een adult-only
//  resort kan niet bij een gezin met kinderen passen, ongeacht
//  hoe goed alle andere vinkjes kloppen.
//
//  De conflict-detectie loopt in evaluateMatch() vóór de
//  gewogen score; matched een rule → score 0 → niet in
//  resultaten.
// ============================================================
function hardConflict(answers, acc) {
    const hasFamilyWithKids = answers.reisgezelschap.some(v =>
        v === 'families-babies' || v === 'families-kids' || v === 'families-teens');
    const wantsAdultOnly = answers.reisgezelschap.includes('couples')
                        && answers.vakantietype.includes('adult-only-trip');

    // 1. Adult-only resort + gezin-met-kinderen → niet samen
    if (hasFamilyWithKids && acc.audience.adultOnly) {
        return { conflict: true, reason: 'Adult-only — niet geschikt voor kinderen' };
    }
    // 2. Adult-only-trip gekozen + acco is niet adult-friendly (heeft kids-fun overlay)
    if (answers.vakantietype.includes('adult-only-trip') &&
        acc.audience.kidFriendly && !acc.audience.adultOnly) {
        return { conflict: true, reason: 'Gericht op gezinnen — niet adult-only' };
    }
    // 3. Verblijfstype is HARD: gekozen type moet aanwezig zijn op acco
    const wantedAccoTypes = answers.verblijfstype.filter(v => v && v !== 'geen-voorkeur');
    if (wantedAccoTypes.length > 0) {
        const has = wantedAccoTypes.some(t => acc.accommodationTypes.includes(t));
        if (!has) {
            return { conflict: true, reason: 'Geen passend verblijfstype beschikbaar' };
        }
    }
    // 4. Vakantietype-TYPE keuze (Hotels/Campings/Vakantieparken) is HARD
    const wantedTypeKeys = answers.vakantietype.filter(v =>
        v === 'hotel' || v === 'camping' || v === 'holiday-park');
    if (wantedTypeKeys.length > 0) {
        const typeMatches =
            (wantedTypeKeys.includes('hotel')        && acc.type === 'hotel') ||
            (wantedTypeKeys.includes('camping')      && (acc.type === 'camping' || acc.type === 'glamping')) ||
            (wantedTypeKeys.includes('holiday-park') && (acc.type === 'holiday-park' || acc.type === 'bungalow-park'));
        if (!typeMatches) {
            return { conflict: true, reason: 'Ander type accommodatie' };
        }
    }
    // 5. Met huisdieren + niet pet-friendly → uitsluiten
    if (answers.reisgezelschap.includes('pets') && !acc.audience.petFriendly) {
        return { conflict: true, reason: 'Huisdieren niet toegestaan' };
    }
    return { conflict: false };
}

// ============================================================
//  MENSELIJKE UITLEG-REGELS
//  Iedere regel checkt of een combinatie van user-keuze +
//  accommodatie-eigenschap aanwezig is, en levert dan een
//  hand-geschreven zin. We stoppen na 4 positives + 2 cautions
//  zodat de card leesbaar blijft.
//
//  Iedere rule: { when(answers, acc) => bool, say: 'Tekst' }
//  Cautions zijn dezelfde structuur maar gaan in het cautions-
//  blok ("iets om rekening mee te houden").
// ============================================================
const HUMAN_POSITIVES = [
    // Gezin / kinderen
    { when: (a, x) => a.reisgezelschap.includes('families-babies') && x.audience.kidFriendly && hasTheme(x, ['rust','clean','kid-safe']),
      say: "Ideaal voor gezinnen met baby's" },
    { when: (a, x) => a.reisgezelschap.includes('families-kids') && hasTheme(x, ['kids-fun','family']),
      say: "Ideaal voor gezinnen met kinderen" },
    { when: (a, x) => a.reisgezelschap.includes('families-teens') && hasTheme(x, ['active','sports','adventure']),
      say: "Genoeg te doen voor tieners" },
    // Koppels / wellness / romantisch
    { when: (a, x) => a.reisgezelschap.includes('couples') && hasTheme(x, ['romantic','intimate','boutique']),
      say: "Perfect voor koppels" },
    { when: (a, x) => (a.reisgezelschap.includes('couples') || a.vakantietype.includes('ontspanning-vakantie'))
                   && hasTheme(x, ['wellness','spa']),
      say: "Rustige wellness-sfeer" },
    { when: (a, x) => a.vakantietype.includes('adult-only-trip') && x.audience.adultOnly,
      say: "Adult-only — geen kinderlawaai" },
    // Senioren / rust
    { when: (a, x) => a.reisgezelschap.includes('seniors') && hasTheme(x, ['rust','comfort','quiet']),
      say: "Rustig en comfortabel — geschikt voor senioren" },
    // Vrienden / sociaal
    { when: (a, x) => a.reisgezelschap.includes('friends') && hasTheme(x, ['social','entertainment','nightlife']),
      say: "Levendige sfeer — leuk met vrienden" },
    // Alleen reizend
    { when: (a, x) => a.reisgezelschap.includes('solo') && hasTheme(x, ['centrum','cultural','safe-solo']),
      say: "Goede uitvalsbasis voor solo-reizigers" },
    // Huisdieren
    { when: (a, x) => a.reisgezelschap.includes('pets') && x.audience.petFriendly,
      say: "Huisdieren welkom" },
    // Actief / avontuur
    { when: (a, x) => a.vakantietype.includes('actief-vakantie') && hasTheme(x, ['active','adventure','sports']),
      say: "Veel buitenactiviteiten in de buurt" },
    // Winter / ski
    { when: (a, x) => a.vakantietype.includes('winter') && hasTheme(x, ['snow','ski','mountain']),
      say: "Op skiafstand van de pistes" },
    // Zon / strand
    { when: (a, x) => a.vakantietype.includes('sun') && hasTheme(x, ['warm','beach','summer']),
      say: "Garantie op zon en strand" },
    // City trip
    { when: (a, x) => a.vakantietype.includes('city-trip') && hasTheme(x, ['centrum','cultural','urban']),
      say: "Op loopafstand van het centrum" },
    // Budget tier match
    { when: (a, x) => a.budget.includes('luxe') && x.tier === 'luxe',
      say: "Echt luxueus verblijf" },
    { when: (a, x) => a.budget.includes('budget') && x.tier === 'budget',
      say: "Prima prijs voor wat je krijgt" },
    { when: (a, x) => a.budget.includes('comfort') && x.tier === 'comfort',
      say: "Solide comfort voor een eerlijke prijs" },
    { when: (a, x) => a.budget.includes('aanbiedingen') && x.tier !== 'luxe',
      say: "Vaak met scherpe aanbiedingen" },
    { when: (a, x) => a.budget.includes('pakketreizen') && hasTheme(x, ['all-inclusive','convenient']),
      say: "Beschikbaar als pakketreis" },
    // Ligging match — concrete zinnen per setting
    { when: (a, x) => a.ligging.includes('aan-zee') && x.settings.includes('aan-zee'),
      say: "Mooie ligging aan zee" },
    { when: (a, x) => a.ligging.includes('in-bergen') && x.settings.includes('in-bergen'),
      say: "Direct in de bergen" },
    { when: (a, x) => a.ligging.includes('aan-meer') && x.settings.includes('aan-meer'),
      say: "Aan een meer met uitzicht" },
    { when: (a, x) => a.ligging.includes('natuur') && x.settings.includes('natuur'),
      say: "Midden in de natuur" },
    { when: (a, x) => a.ligging.includes('centrum') && x.settings.includes('centrum'),
      say: "Centraal gelegen in de stad" },
    { when: (a, x) => a.ligging.includes('afgelegen') && x.settings.includes('afgelegen'),
      say: "Afgelegen — heerlijk rustig" },
    // Bestemming — toon de echte regio + land, geen artificiële
    // "Centraal in Europa"-zinnen meer. Iedere keuzehulp-acco heeft
    // een location-veld in "Regio, Land" formaat (bv. "Costa Brava,
    // Spanje", "Toscane, Italië", "Tirol, Oostenrijk", "Algarve,
    // Portugal"); die tonen we letterlijk. Werkt ook voor de
    // continent-keuzes (europa/azie/afrika/amerika) omdat we via
    // CONTINENT_OF de match leggen naar de specifieke acco-locatie.
    // Eén geconsolideerde rule — voorheen vijf aparte zinnen die
    // allemaal generiek bleven.
    { when: (a, x) => !!x.location && (
            a.bestemming.includes(x.country)
            || (a.bestemming.includes('europa')  && CONTINENT_OF[x.country] === 'europa')
            || (a.bestemming.includes('azie')    && CONTINENT_OF[x.country] === 'azie')
            || (a.bestemming.includes('afrika')  && CONTINENT_OF[x.country] === 'afrika')
            || (a.bestemming.includes('amerika') && CONTINENT_OF[x.country] === 'amerika')
      ),
      say: (a, x) => x.location },
    // Faciliteiten — alleen tonen als de gebruiker er om vraagt
    { when: (a, x) => a.faciliteiten.includes('all-inclusive') && (x.facilities.includes('all-inclusive') || hasTheme(x, ['all-inclusive'])),
      say: "All-inclusive beschikbaar" },
    { when: (a, x) => a.faciliteiten.includes('binnenzwembad') && x.facilities.includes('binnenzwembad'),
      say: "Heeft een binnenzwembad" },
    { when: (a, x) => a.faciliteiten.includes('glijbanen') && x.facilities.includes('glijbanen'),
      say: "Glijbanen en waterpret" },
    { when: (a, x) => a.faciliteiten.includes('aan-strand') && (x.facilities.includes('aan-strand') || hasTheme(x, ['beach'])),
      say: "Direct aan het strand" },
    { when: (a, x) => a.faciliteiten.includes('open-bar') && x.facilities.includes('open-bar'),
      say: "Open bar bij het verblijf" },
    { when: (a, x) => a.faciliteiten.includes('live-muziek') && x.facilities.includes('live-muziek'),
      say: "Live muziek-avonden" },
    { when: (a, x) => a.faciliteiten.includes('entertainment') && x.facilities.includes('entertainment'),
      say: "Eigen entertainment-programma" },
    { when: (a, x) => a.faciliteiten.includes('sports-games') && x.facilities.includes('sports-games'),
      say: "Veel sport & spel op locatie" },
    { when: (a, x) => a.faciliteiten.includes('bezienswaardigheden') && x.facilities.includes('bezienswaardigheden'),
      say: "Op loopafstand van bezienswaardigheden" },
    { when: (a, x) => a.faciliteiten.includes('fietsroutes') && x.facilities.includes('fietsroutes'),
      say: "Fietsroutes vanaf de deur" },
    { when: (a, x) => a.faciliteiten.includes('looproutes') && x.facilities.includes('looproutes'),
      say: "Mooie wandelmogelijkheden" },
    { when: (a, x) => a.faciliteiten.includes('relax') && (x.facilities.includes('relax') || hasTheme(x, ['wellness','spa'])),
      say: "Ruime ontspanningsfaciliteiten" },
    { when: (a, x) => a.faciliteiten.includes('outdoor') && x.facilities.includes('outdoor'),
      say: "Veel buitenactiviteiten" },
    { when: (a, x) => a.faciliteiten.includes('facility-luxe') && (x.facilities.includes('facility-luxe') || x.tier === 'luxe'),
      say: "Luxe afwerking en service" }
];

const HUMAN_CAUTIONS = [
    // Tier mismatches — niet uitsluitend, wel relevant
    { when: (a, x) => a.budget.includes('budget') && x.tier === 'luxe',
      say: "Wat aan de prijs (luxe segment)" },
    { when: (a, x) => a.budget.includes('luxe') && x.tier === 'budget',
      say: "Eenvoudiger dan luxe — geen 5-sterren" },
    // Atmosfeer-mismatches
    { when: (a, x) => (a.reisgezelschap.includes('couples') || a.vakantietype.includes('ontspanning-vakantie'))
                   && hasTheme(x, ['kids-fun','entertainment']) && !hasTheme(x, ['adult', 'rust']),
      say: "Kan druk worden met gezinnen" },
    { when: (a, x) => a.reisgezelschap.includes('seniors') && hasTheme(x, ['nightlife','entertainment'])
                   && !hasTheme(x, ['rust','quiet']),
      say: "Levendig — kan minder rustig zijn" },
    { when: (a, x) => a.ligging.includes('afgelegen') && hasTheme(x, ['entertainment','social']),
      say: "Niet écht afgelegen — wel gezellig" },
    // Gemiste ligging — gebruiker wilde zee maar acco zit in bergen
    { when: (a, x) => a.ligging.includes('aan-zee') && !x.settings.includes('aan-zee') && !a.ligging.includes('geen-voorkeur'),
      say: "Niet direct aan zee" },
    { when: (a, x) => a.ligging.includes('in-bergen') && !x.settings.includes('in-bergen') && !a.ligging.includes('geen-voorkeur'),
      say: "Geen bergligging" },
    // Faciliteit-misser bij belangrijke wens
    { when: (a, x) => a.faciliteiten.includes('binnenzwembad') && !x.facilities.includes('binnenzwembad'),
      say: "Geen binnenzwembad" }
];

// ============================================================
//  HULPFUNCTIES
// ============================================================
function hasTheme(acc, themes) {
    if (!acc.themes) return false;
    return themes.some(t => acc.themes.includes(t));
}
function intersection(a, b) {
    if (!a || !b) return [];
    const set = new Set(b);
    return a.filter(x => set.has(x));
}

// Lijst met landen die onder "Europa" vallen (voor continentaal match)
const EUROPEAN_COUNTRIES = ['netherlands', 'duitsland', 'frankrijk', 'italie', 'spanje', 'oostenrijk', 'belgie', 'portugal', 'kroatie'];

// Land → continent (gebruikt door bestemming-scoring om azie/afrika/
// amerika-keuzes te matchen op landen buiten Europa).
const CONTINENT_OF = {
    'netherlands':'europa','duitsland':'europa','frankrijk':'europa','italie':'europa',
    'spanje':'europa','oostenrijk':'europa','belgie':'europa','portugal':'europa','kroatie':'europa',
    'indonesie':'azie','thailand':'azie','japan':'azie','vietnam':'azie',
    'marokko':'afrika','tanzania':'afrika','zuid-afrika':'afrika','egypte':'afrika',
    'usa':'amerika','canada':'amerika','costa-rica':'amerika','mexico':'amerika','brazilie':'amerika'
};

const COUNTRY_LABELS = {
    netherlands: 'Nederland', duitsland: 'Duitsland', frankrijk: 'Frankrijk',
    italie: 'Italië', spanje: 'Spanje', oostenrijk: 'Oostenrijk',
    belgie: 'België', portugal: 'Portugal', kroatie: 'Kroatië',
    indonesie: 'Bali', thailand: 'Thailand', japan: 'Japan', vietnam: 'Vietnam',
    marokko: 'Marokko', tanzania: 'Tanzania', 'zuid-afrika': 'Zuid-Afrika', egypte: 'Egypte',
    usa: 'de VS', canada: 'Canada', 'costa-rica': 'Costa Rica', mexico: 'Mexico', brazilie: 'Brazilië'
};

// ============================================================
//  ACCOMMODATIES — geladen uit keuzehulp-data.js
//  De catalogus leeft in een aparte module zodat dit bestand
//  kan focussen op de engine. Loading-volgorde wordt afgedwongen
//  in Keuzehulp.html: keuzehulp-data.js komt vóór keuzehulp.js.
//
//  Profielvelden per record — zie keuzehulp-data.js voor de
//  volledige documentatie.
// ============================================================
const accommodations = (window.KEUZEHULP_ACCOMMODATIONS || []);

// ============================================================
//  ENGINE — evaluateMatch(acc, answers)
//  Hardconflict-check → vroege exit met score 0.
//  Anders: per categorie de overlap-score berekenen via
//  intent-thema's, gewogen optellen, en pct = earned/possible
//  via een lichte ease-out curve zodat realistische top-matches
//  85-95% halen i.p.v. wiskundig wat-laag-uitgevallen 60-70%.
// ============================================================
function evaluateMatch(acc, answers) {
    // 0) Geen-voorkeur vervalt globaal: filter eruit voor scoring
    const clean = {};
    Object.keys(answers).forEach(k => {
        clean[k] = (answers[k] || []).filter(v => v && v !== 'geen-voorkeur');
    });

    // 1) Hard conflicts — exclude
    const hc = hardConflict(clean, acc);
    if (hc.conflict) {
        return { excluded: true, score: 0, tier: 'excluded', reason: hc.reason, positives: [], cautions: [] };
    }

    // 2) Gewogen thema-score per categorie
    let earned = 0;
    let possible = 0;

    // Helper: bereken match-graad [0..1] voor een set keuzes binnen een categorie
    function categoryScore(catKey, values, scorer) {
        if (!values.length) return; // categorie overgeslagen → niet meetellen
        const w = WEIGHTS[catKey] || 1;
        const score = scorer(values, acc);
        possible += w;
        earned += w * score;
    }

    // Reisgezelschap — audience-fit + thema-overlap
    categoryScore('reisgezelschap', clean.reisgezelschap, (vals, x) => {
        let best = 0;
        vals.forEach(v => {
            const intents = TAG_INTENTS[v] || [];
            const overlap = intersection(intents, x.themes).length;
            // Audience-bonus: voorheen +0.4, dat duwde elke
            // doelgroep-match boven 90% via de ease-out hieronder.
            // 0.25 voelt eerlijker: een audience-fit telt mee, maar
            // overstemt de inhoudelijke thema-overlap niet meer.
            const audienceBonus =
                (v === 'pets' && x.audience.petFriendly) ? 0.25 :
                (v.startsWith('families-') && x.audience.kidFriendly && !x.audience.adultOnly) ? 0.25 :
                (v === 'couples' && (x.audience.adultOnly || hasTheme(x, ['romantic','intimate']))) ? 0.25 :
                (v === 'seniors' && hasTheme(x, ['rust','quiet','comfort'])) ? 0.25 :
                (v === 'friends' && hasTheme(x, ['social','entertainment'])) ? 0.25 :
                (v === 'solo' && hasTheme(x, ['centrum','safe-solo','flexible'])) ? 0.25 :
                0;
            // Cap op 1.0; thema-overlap weegt mee + audience-bonus
            const s = Math.min(1, overlap / Math.max(1, intents.length) * 0.7 + audienceBonus);
            if (s > best) best = s;
        });
        return best;
    });

    // Vakantietype — TYPE-deel is al hard-gefilterd; we scoren atmosfeer
    categoryScore('vakantietype', clean.vakantietype, (vals, x) => {
        let best = 0;
        vals.forEach(v => {
            const intents = TAG_INTENTS[v] || [];
            // TYPE-match telt automatisch als 1.0 (we kwamen door hard-filter)
            if ((v === 'hotel' && x.type === 'hotel') ||
                (v === 'camping' && (x.type === 'camping' || x.type === 'glamping')) ||
                (v === 'holiday-park' && (x.type === 'holiday-park' || x.type === 'bungalow-park'))) {
                best = Math.max(best, 1);
                return;
            }
            const overlap = intersection(intents, x.themes).length;
            const s = Math.min(1, overlap / Math.max(1, intents.length));
            if (s > best) best = s;
        });
        return best;
    });

    // Budget — exact tier-match = 1.0, één tier-stap weg = 0.5, twee weg = 0.1
    categoryScore('budget', clean.budget, (vals, x) => {
        const tierOrder = { budget: 0, comfort: 1, luxe: 2 };
        let best = 0;
        vals.forEach(v => {
            if (v === x.tier) { best = Math.max(best, 1); return; }
            // softere budgetwaarden (last-minute / aanbiedingen / pakketreizen)
            if ((v === 'last-minute' || v === 'aanbiedingen') && x.tier !== 'luxe') {
                best = Math.max(best, 0.85); return;
            }
            if (v === 'pakketreizen' && hasTheme(x, ['all-inclusive','convenient'])) {
                best = Math.max(best, 0.85); return;
            }
            if (tierOrder[v] !== undefined && tierOrder[x.tier] !== undefined) {
                const dist = Math.abs(tierOrder[v] - tierOrder[x.tier]);
                best = Math.max(best, dist === 1 ? 0.5 : 0.1);
            }
        });
        return best;
    });

    // Bestemming — country direct = 1.0, continent = 0.7
    //   • Direct: keuzehulp-land = acco.country (bv. 'spanje' = 'spanje').
    //   • Continent: keuzehulp-continent (europa/azie/afrika/amerika)
    //     matched via CONTINENT_OF op acco.country, zodat een Bali-
    //     accommodatie correct verschijnt bij "In Azië".
    categoryScore('bestemming', clean.bestemming, (vals, x) => {
        let best = 0;
        vals.forEach(v => {
            if (v === x.country) { best = Math.max(best, 1); return; }
            if (CONTINENT_OF[x.country] === v) {
                best = Math.max(best, 0.7);
            }
        });
        return best;
    });

    // Ligging — direct setting-match
    categoryScore('ligging', clean.ligging, (vals, x) => {
        let best = 0;
        vals.forEach(v => {
            if (x.settings.includes(v)) { best = Math.max(best, 1); return; }
            const intents = TAG_INTENTS[v] || [];
            const overlap = intersection(intents, x.themes).length;
            best = Math.max(best, Math.min(0.6, overlap * 0.3));
        });
        return best;
    });

    // Verblijfstype — al hard-gefilterd → 1.0 als gekozen, anders skip
    categoryScore('verblijfstype', clean.verblijfstype, (vals, x) => 1);

    // Faciliteiten — gemiddelde overlap-ratio
    categoryScore('faciliteiten', clean.faciliteiten, (vals, x) => {
        const hits = vals.filter(v => x.facilities.includes(v) || hasTheme(x, TAG_INTENTS[v] || []));
        return hits.length / vals.length;
    });

    // 3) Geen filters gezet → toon iedereen op 50%
    let pct;
    if (possible === 0) {
        pct = 50;
    } else {
        const raw = earned / possible;
        // Lineaire mapping: pct = raw * 100. Voorheen werd hier een
        // ease-out (^1.5) toegepast die ALLE redelijke matches naar
        // 85-98% duwde (raw 0.6 → 75%, raw 0.8 → 91%, raw 0.9 → 97%),
        // wat ervoor zorgde dat accommodaties nauwelijks meer
        // differentieerden — een 80%-match en een 95%-match zagen er
        // visueel hetzelfde uit en de tier-labels ("Perfecte match",
        // "Sterke match") werden te ruim toegekend. Linear voelt
        // eerlijker: 50% is écht middelmatig, 90% is écht sterk, 95%
        // is bijna ideaal. Cap blijft 98% — 100% is gereserveerd voor
        // een theoretisch perfecte overlap die we bewust niet
        // toekennen ("perfect maar niet perfect").
        pct = Math.round(raw * 100);
    }
    pct = Math.max(0, Math.min(98, pct));

    // 4) Human positives + cautions
    const positives = [];
    const cautions = [];
    HUMAN_POSITIVES.forEach(rule => {
        if (positives.length >= 4) return;
        try {
            if (rule.when(clean, acc)) {
                const text = typeof rule.say === 'function' ? rule.say(clean, acc) : rule.say;
                if (!positives.includes(text)) positives.push(text);
            }
        } catch (_) { /* defensief */ }
    });
    HUMAN_CAUTIONS.forEach(rule => {
        if (cautions.length >= 2) return;
        try {
            if (rule.when(clean, acc)) {
                const text = typeof rule.say === 'function' ? rule.say(clean, acc) : rule.say;
                if (!cautions.includes(text)) cautions.push(text);
            }
        } catch (_) { /* defensief */ }
    });

    // 5) Match-tier label
    const tier = pct >= 90 ? 'Perfecte match'
               : pct >= 75 ? 'Sterke match'
               : pct >= 60 ? 'Goede match'
               : pct >= 40 ? 'Wellicht iets voor jou'
               : 'Zwakke match';

    return { excluded: false, score: pct, tier, positives, cautions };
}

// ============================================================
//  UI HANDLERS — ONGEWIJZIGD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    attachEventListeners();
});

function attachEventListeners() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });
}

function getStepKey(step) {
    // Step 5 = ligging, Step 6 = verblijfstype (omgedraaid t.o.v. eerdere flow).
    return ({ 1: 'reisgezelschap', 2: 'vakantietype', 3: 'budget', 4: 'bestemming',
             5: 'ligging', 6: 'verblijfstype', 7: 'faciliteiten' })[step];
}

function handleCardClick(card) {
    const value = card.getAttribute('data-value');
    const stepKey = getStepKey(state.currentStep);
    let current = state.answers[stepKey];
    if (value === 'geen-voorkeur') {
        current = card.classList.contains('selected') ? [] : ['geen-voorkeur'];
    } else {
        if (current.includes('geen-voorkeur')) current = current.filter(v => v !== 'geen-voorkeur');
        const idx = current.indexOf(value);
        if (idx > -1) current.splice(idx, 1); else current.push(value);
    }
    state.answers[stepKey] = current;
    renderStepOptions(state.currentStep);
}

function nextStep() {
    const stepKey = getStepKey(state.currentStep);
    if (state.answers[stepKey].length === 0) {
        alert('Selecteer alstublieft minstens één optie (of "Geen voorkeur").');
        return;
    }
    state.currentStep++;
    if (state.currentStep === 8) showResults();
    updateUI();
}

function previousStep() {
    if (state.currentStep > 1) { state.currentStep--; updateUI(); }
}

function updateUI() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${state.currentStep}`).classList.add('active');

    const displayedSteps = state.totalSteps - 1;
    const progress = Math.min(state.currentStep, displayedSteps) / displayedSteps * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    const counter = document.getElementById('stepCounter');
    counter.innerHTML = state.currentStep <= displayedSteps
        ? `<span class="step-label">Stap ${state.currentStep}</span> van ${displayedSteps}`
        : `Resultaten`;

    const btnPrev = document.getElementById('btnPrevious');
    const btnNext = document.getElementById('btnNext');
    const navEl = document.getElementById('navButtons');
    btnPrev.disabled = state.currentStep === 1;

    if (state.currentStep === 8) {
        navEl.style.display = 'none';
    } else {
        navEl.style.display = 'flex';
        btnPrev.textContent = '← Terug';
        btnNext.textContent = state.currentStep === 7 ? 'Zie resultaten →' : 'Volgende →';
        renderStepOptions(state.currentStep);
        renderSelectionSummary();
    }
    window.scrollTo(0, 0);
}

function renderStepOptions(stepNumber) {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (!stepEl) return;
    const selected = state.answers[getStepKey(stepNumber)];
    stepEl.querySelectorAll('.option-card').forEach(card => {
        card.classList.toggle('selected', selected.includes(card.getAttribute('data-value')));
    });
}

// Display label-lookup voor summary-chips (keuzes die door de
// flow verzameld zijn). Synchroon met keuzehulp.html data-value's.
const valueLabels = {
    'families-babies': "Gezinnen met baby's", 'families-kids': 'Gezinnen met kinderen',
    'families-teens': 'Gezinnen met tieners', 'volwassenen': 'Volwassenen',
    'seniors': 'Senioren', 'couples': 'Koppels', 'friends': 'Vrienden',
    'solo': 'Alleen reizend', 'pets': 'Met huisdieren',
    'hotel': 'Hotels', 'camping': 'Campings', 'holiday-park': 'Vakantieparken',
    'city-trip': 'Weekendjes weg', 'sun': 'Zonvakanties', 'winter': 'Wintervakanties',
    'adult-only-trip': 'Adult Only', 'ontspanning-vakantie': 'Ontspanning',
    'actief-vakantie': 'Actief',
    'budget': 'Budget', 'comfort': 'Comfort', 'luxe': 'Luxe',
    'last-minute': 'Last Minutes', 'aanbiedingen': 'Aanbiedingen', 'pakketreizen': 'Pakketreizen',
    'duitsland': 'Duitsland', 'netherlands': 'Nederland', 'frankrijk': 'Frankrijk',
    'italie': 'Italië', 'spanje': 'Spanje',
    'europa': 'In Europa', 'azie': 'In Azië', 'afrika': 'In Afrika', 'amerika': 'In Amerika',
    'aan-zee': 'Aan zee', 'in-bergen': 'In de bergen', 'aan-meer': 'Aan een meer',
    'natuur': 'Nabij natuur', 'centrum': 'In de buurt van het centrum',
    'afgelegen': 'Afgelegen',
    'tent': 'Tent', 'caravan': 'Caravan', 'mobile-home': 'Mobile Home', 'bungalow': 'Bungalow',
    'chalet': 'Chalet', 'safari-tent': 'Safaritent', 'villa': 'Villa',
    'hotel-kamer': 'Hotelkamer', 'appartement': 'Appartement',
    'binnenzwembad': 'Binnenzwembad', 'glijbanen': 'Glijbanen', 'kids-fun': 'Kinderpret',
    'all-inclusive': 'All-inclusive', 'sports-games': 'Sport & Spel',
    'outdoor': 'Outdoor activiteiten', 'relax': 'Ontspanning',
    'bezienswaardigheden': 'Bezienswaardigheden', 'fietsroutes': 'Fietsroutes',
    'looproutes': 'Looproutes', 'pet-friendly': 'Diervriendelijk', 'facility-luxe': 'Luxe',
    'entertainment': 'Entertainment', 'open-bar': 'Open bar', 'live-muziek': 'Live muziek',
    'aan-strand': 'Aan het strand',
    'geen-voorkeur': 'Geen voorkeur'
};

function renderSelectionSummary() {
    const stepEl = document.getElementById(`step-${state.currentStep}`);
    if (!stepEl) return;
    const existing = stepEl.querySelector('.selection-summary');
    if (existing) existing.remove();

    const chips = [];
    for (let s = 1; s < state.currentStep; s++) {
        const values = state.answers[getStepKey(s)] || [];
        values.forEach(v => {
            if (v !== 'geen-voorkeur') chips.push(valueLabels[v] || v);
        });
    }
    if (chips.length === 0) return;

    const summary = document.createElement('div');
    summary.className = 'selection-summary';
    summary.innerHTML = `<span class="label">Jouw keuzes tot nu toe:</span>` +
        chips.map(c => `<span class="selection-chip">${c}</span>`).join('');
    const subtitle = stepEl.querySelector('.subtitle');
    subtitle.insertAdjacentElement('afterend', summary);
}

// ============================================================
//  RESULTS RENDERING
//  Hier sluit de engine aan op het bestaande card-template.
//  We voegen toe: tier-label naast de match-pct, en de cautions
//  als aparte "minder geschikt"-rij onderin de explainer.
// ============================================================
function showResults() {
    const resultsContainer = document.getElementById('accommodationResults');
    const matchText = document.getElementById('matchText');

    const scored = accommodations
        .map(acc => ({ ...acc, evalResult: evaluateMatch(acc, state.answers) }))
        .filter(acc => !acc.evalResult.excluded && acc.evalResult.score >= 40)
        .sort((a, b) => b.evalResult.score - a.evalResult.score);

    // Aantal totaal gekozen criteria voor de subtitle
    const totalCriteria = Object.values(state.answers)
        .flat()
        .filter(v => v && v !== 'geen-voorkeur').length;

    if (scored.length === 0) {
        // Edge: alle accos uitgesloten of <40%. Toon een eerlijke
        // boodschap i.p.v. niets — laat de gebruiker weten dat de
        // combinatie te beperkend was, en bied "opnieuw"-knop aan.
        resultsContainer.innerHTML = `
            <div class="kh-empty">
                <h3>Geen accommodaties die volledig matchen</h3>
                <p>Jouw combinatie is heel specifiek — niets in onze selectie scoort hoog genoeg om met goed geweten aan te raden. Pas één of twee keuzes aan en je krijgt direct passende suggesties.</p>
            </div>
        `;
        matchText.textContent = `${totalCriteria} criteria • Geen passende matches gevonden`;
        return;
    }

    const top = scored.slice(0, 6);

    resultsContainer.innerHTML = top.map(acc => {
        const { score, tier, positives, cautions } = acc.evalResult;
        const tierClass = score >= 90 ? 'tier-perfect' : score >= 75 ? 'tier-strong' : score >= 60 ? 'tier-good' : 'tier-okay';

        const matchPctHTML = `
            <div class="accommodation-card-match ${tierClass}">
                <span class="match-dot" aria-hidden="true"></span>
                <span class="match-pct">${score}%</span>
                <span class="match-label">${tier}</span>
            </div>`;

        const explainHTML = (positives.length || cautions.length)
            ? `<ul class="match-explain" aria-label="Waarom dit past">
                   ${positives.map(p => `
                       <li class="match-explain-row match-explain-row--yes">
                           <svg class="match-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                           <span>${p}</span>
                       </li>`).join('')}
                   ${cautions.map(n => `
                       <li class="match-explain-row match-explain-row--no">
                           <svg class="match-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 4v5M8 12v.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>
                           <span>${n}</span>
                       </li>`).join('')}
               </ul>`
            : '';
        return `
            <div class="accommodation-card" onclick="goToDetail(${acc.id})">
                <div class="accommodation-card-image">${acc.emoji}</div>
                <div class="accommodation-card-content">
                    <h3>${acc.title}</h3>
                    <div class="accommodation-card-location">📍 ${acc.location}</div>
                    ${matchPctHTML}
                    ${explainHTML}
                    <div class="accommodation-card-tags">
                        ${acc.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <button class="accommodation-card-button" onclick="event.stopPropagation(); goToDetail(${acc.id})">Bekijk accommodatie</button>
                </div>
            </div>
        `;
    }).join('');

    const topTier = top[0].evalResult.tier;
    matchText.textContent = totalCriteria > 0
        ? `${totalCriteria} criteria • ${top.length} aanbevelingen — beste: ${topTier.toLowerCase()}`
        : 'Onze topselectie voor jou';
}

function goToDetail(id) {
    window.location.href = `Navigatie.html?acc=${id}`;
}

function restartFlow() {
    state.currentStep = 1;
    Object.keys(state.answers).forEach(k => state.answers[k] = []);
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('navButtons').style.display = 'flex';
    updateUI();
}

document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`Bedankt! Je hebt je aangemeld met: ${email}`);
    e.target.reset();
});
