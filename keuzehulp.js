// Keuzehulp — gesynchroniseerd met sitebrede categorieën (zie navigatie.js labels)
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

// Voorbeeld accommodaties — match-keys sluiten aan op de data-value attributen van elke stap
const accommodations = [
    { id: 1, title: "Sunny Beach Resort", location: "Zeeland", emoji: "🏖️",
      tags: ["Aan zee", "Zonvakantie", "Comfort"],
      match: ["aan-zee", "zonvakantie", "comfort", "water", "zeeland", "families-kids", "koppels"] },
    { id: 2, title: "Family Camping Paradise", location: "Drenthe", emoji: "⛺",
      tags: ["Camping", "Familie", "Kinderpret"],
      match: ["camping", "families-kids", "families-babies", "kids-fun", "sports-games", "tent", "drenthe", "nature", "budget"] },
    { id: 3, title: "Alpine Mountain Lodge", location: "Oostenrijk", emoji: "⛰️",
      tags: ["Bergen", "Luxe", "Avontuur"],
      match: ["winter", "luxe", "adventure", "sports-games", "in-bergen", "chalet", "oostenrijk"] },
    { id: 4, title: "Romantic Glamping Spot", location: "Gelderland", emoji: "✨",
      tags: ["Glamping", "Natuur", "Koppels"],
      match: ["glamping", "relax", "nature", "couples", "adult-only", "gelderland", "luxe"] },
    { id: 5, title: "Pet-Friendly Cottage", location: "Noord-Holland", emoji: "🐕",
      tags: ["Honden", "Natuur"],
      match: ["pets", "pet-friendly", "nature", "bungalow", "noord-holland"] },
    { id: 6, title: "Water Sports Haven", location: "Friesland", emoji: "🏄",
      tags: ["Water", "Sport", "Avontuur"],
      match: ["water", "sports-games", "adventure", "aan-meer", "friesland", "families-teens"] },
    { id: 7, title: "City Break Parijs", location: "Frankrijk", emoji: "🏙️",
      tags: ["Stad", "Weekend", "Comfort"],
      match: ["city-trip", "stad", "comfort", "couples", "solo", "frankrijk", "festive"] },
    { id: 8, title: "All-Inclusive Family Park", location: "Noord-Brabant", emoji: "🎡",
      tags: ["Vakantiepark", "Familie", "All Inclusive"],
      match: ["holiday-park", "families-kids", "all-inclusive", "kids-fun", "bungalow", "noord-brabant", "comfort"] },
    { id: 9, title: "Winter Ski Lodge", location: "Oostenrijk", emoji: "⛷️",
      tags: ["Winter", "Sport", "Avontuur"],
      match: ["winter", "sports-games", "adventure", "in-bergen", "chalet", "oostenrijk"] },
    { id: 10, title: "Secluded Nature Retreat", location: "Groningen", emoji: "🌲",
      tags: ["Afgelegen", "Natuur", "Rust"],
      match: ["afgelegen", "nature", "relax", "seniors", "groningen", "bungalow"] },
    { id: 11, title: "Costa Brava Beach Camping", location: "Spanje", emoji: "🏕️",
      tags: ["Camping", "Zee", "Familie"],
      match: ["camping", "families-kids", "water", "kids-fun", "aan-zee", "spanje", "safari-tent", "budget"] },
    { id: 12, title: "Toscaanse Luxe Glamping", location: "Italië", emoji: "🍷",
      tags: ["Glamping", "Luxe", "Natuur"],
      match: ["glamping", "luxe", "relax", "nature", "couples", "adult-only", "italie", "villa"] }
];

// Labels voor de chips in de selection-summary. Gesynchroniseerd met
// de nieuwe Keuzehulp-flow (Volwassenen toegevoegd, Hotels/Campings/
// Vakantieparken/Weekendjes weg/Zonvakanties/Wintervakanties als meer-
// voud, sub-types als zelfstandige vakantietypes, simpelere bestemming-
// lijst, ligging-stap met "In de buurt van het centrum", uitgebreide
// faciliteiten).
const valueLabels = {
    // Reisgezelschap
    'families-babies': "Gezinnen met baby's", 'families-kids': 'Gezinnen met kinderen',
    'families-teens': 'Gezinnen met tieners', 'volwassenen': 'Volwassenen',
    'seniors': 'Senioren', 'couples': 'Koppels', 'friends': 'Vrienden',
    'solo': 'Alleen reizend', 'pets': 'Met huisdieren',
    // Vakantietype — meervouden + nieuwe sub-types als zelfstandige optie
    'hotel': 'Hotels', 'camping': 'Campings', 'holiday-park': 'Vakantieparken',
    'city-trip': 'Weekendjes weg', 'sun': 'Zonvakanties', 'winter': 'Wintervakanties',
    'adult-only-trip': 'Adult Only', 'ontspanning-vakantie': 'Ontspanning',
    'actief-vakantie': 'Actief',
    // Budget — ongewijzigd
    'budget': 'Budget (€ – €€)', 'comfort': 'Comfort (€€ – €€€)', 'luxe': 'Luxe (€€€ – €€€€)',
    'last-minute': 'Last Minutes', 'aanbiedingen': 'Aanbiedingen', 'pakketreizen': 'Pakketreizen',
    // Bestemming — simpeler: 5 landen + 4 continenten
    'duitsland': 'Duitsland', 'netherlands': 'Nederland',
    'frankrijk': 'Frankrijk', 'italie': 'Italië', 'spanje': 'Spanje',
    'europa': 'In Europa', 'azie': 'In Azië', 'afrika': 'In Afrika', 'amerika': 'In Amerika',
    // Ligging — Step 5 (was Step 6)
    'aan-zee': 'Aan Zee', 'in-bergen': 'In de bergen', 'aan-meer': 'Aan een meer',
    'natuur': 'Nabij natuur', 'centrum': 'In de buurt van het centrum',
    'afgelegen': 'Afgelegen',
    // Verblijfstype — Step 6 (was Step 5) — ongewijzigd
    'tent': 'Tent', 'caravan': 'Caravan', 'mobile-home': 'Mobile Home', 'bungalow': 'Bungalow',
    'chalet': 'Chalet', 'safari-tent': 'Safaritent', 'villa': 'Villa',
    'hotel-kamer': 'Hotelkamer', 'appartement': 'Appartement',
    // Faciliteiten — Step 7 (uitgebreid)
    'binnenzwembad': 'Binnenzwembad', 'glijbanen': 'Glijbanen', 'kids-fun': 'Kinderpret',
    'all-inclusive': 'All-inclusive', 'sports-games': 'Sport & Spel',
    'outdoor': 'Outdoor activiteiten', 'relax': 'Ontspanning',
    'bezienswaardigheden': 'Bezienswaardigheden', 'fietsroutes': 'Fietsroutes',
    'looproutes': 'Looproutes', 'pet-friendly': 'Diervriendelijk', 'facility-luxe': 'Luxe',
    'entertainment': 'Entertainment', 'open-bar': 'Open bar', 'live-muziek': 'Live muziek',
    'aan-strand': 'Aan het strand',
    // Generiek
    'geen-voorkeur': 'Geen voorkeur'
};

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
    // Step 5 en 6 zijn omgedraaid: eerst de LIGGING (waar wil je
    // verblijven — aan zee, in de bergen, etc.) en daarna pas het
    // VERBLIJFSTYPE. De setting bepaalt de keuze van type, niet
    // andersom.
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

    const displayedSteps = state.totalSteps - 1; // 7 vragen, stap 8 is resultaat
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

// Summary-chips: laat zien wat er in eerdere stappen is gekozen
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

function showResults() {
    const resultsContainer = document.getElementById('accommodationResults');
    const matchText = document.getElementById('matchText');

    let allSelected = [];
    for (const key in state.answers) {
        allSelected = allSelected.concat(state.answers[key].filter(v => v !== 'geen-voorkeur'));
    }
    allSelected = [...new Set(allSelected)];

    const scored = accommodations.map(acc => {
        let score = 0;
        acc.match.forEach(m => { if (allSelected.includes(m)) score++; });
        if (state.answers.vakantietype.some(v => acc.match.includes(v))) score += 0.5;
        if (state.answers.bestemming.some(v => acc.match.includes(v))) score += 0.5;
        return { ...acc, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 6);

    resultsContainer.innerHTML = top.map(acc => `
        <div class="accommodation-card" onclick="goToDetail(${acc.id})">
            <div class="accommodation-card-image">${acc.emoji}</div>
            <div class="accommodation-card-content">
                <h3>${acc.title}</h3>
                <div class="accommodation-card-location">📍 ${acc.location}</div>
                ${acc.score > 0 ? `<div class="accommodation-card-match">✨ ${Math.round(acc.score * 15)}% match</div>` : ''}
                <div class="accommodation-card-tags">
                    ${acc.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <button class="accommodation-card-button" onclick="event.stopPropagation(); goToDetail(${acc.id})">Bekijk accommodatie</button>
            </div>
        </div>
    `).join('');

    matchText.textContent = allSelected.length > 0
        ? `${allSelected.length} criteria • Persoonlijk samengesteld`
        : 'Onze topselectie voor jou';
}

// Doorklikken: open Navigatie.html — voorkeuren zouden later als deep-link params kunnen meegaan
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
