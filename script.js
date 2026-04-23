// ========== STATE ==========
let currentPage = 'landing';
let selectedFilters = { who: null, what: null, where: null };

// ========== PAGE NAVIGATION ==========
function goToPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        currentPage = pageName;
        window.scrollTo(0, 0);
    }
}

document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        goToPage(page);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
            link.classList.add('active');
        }
    });
});

// ========== ENTRY CARDS → SCROLL TO CATEGORY SECTION ==========
// Each entry card has data-entry="who-section" | "what-section" | "where-section"
// matching the id of the category section further down the page.
document.querySelectorAll('.entry-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = card.getAttribute('data-entry');
        const target = document.getElementById(targetId);
        if (!target) return;

        // Smooth scroll (CSS scroll-padding-top handles sticky-header offset)
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Subtle highlight pulse so the user sees which section they landed in
        target.classList.remove('highlighted');
        // force reflow to restart transition
        void target.offsetWidth;
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 1600);
    });
});

// ========== CATEGORY SELECTION → NAVIGATIESTRUCTUUR (Niveau 2) ==========
// Een klik op een subcategorie (Gezinnen met kinderen, Kamperen, Spanje, ...)
// opent Navigatie.html met de juiste filter alvast gezet via URL-parameters.
// Mapping: data-category → filter-key in navigatie.js (who | what | where)
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        const grid = item.closest('.category-grid');
        const category = grid.getAttribute('data-category'); // who | what | where
        const value = item.getAttribute('data-value');

        grid.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        selectedFilters[category] = value;

        // Korte visuele bevestiging en dan doorverwijzen
        setTimeout(() => {
            const url = `Navigatie.html?filter=${encodeURIComponent(category)}&value=${encodeURIComponent(value)}`;
            window.location.href = url;
        }, 150);
    });
});

// "Alles zien →" links bovenin elke categoriesectie openen de navigatie zonder voorselectie
document.querySelectorAll('.category-section').forEach(section => {
    const grid = section.querySelector('.category-grid');
    const viewAll = section.querySelector('.view-all-link');
    if (!grid || !viewAll) return;
    const category = grid.getAttribute('data-category');
    viewAll.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `Navigatie.html?filter=${encodeURIComponent(category)}`;
    });
});

// ========== ACCOMMODATION CARD CLICK (placeholder) ==========
document.querySelectorAll('.accommodation-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.cta-button')) return;
        const id = card.getAttribute('data-id');
        if (id) {
            // Placeholder: would navigate to detail page
            console.log('Open accommodation', id);
        }
    });
});

document.querySelectorAll('[data-action="view-prices"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert('Prijzen bekijken — functionaliteit volgt in de volgende stap.');
    });
});

document.querySelectorAll('[data-action="read-story"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Reisverslag openen — functionaliteit volgt in de volgende stap.');
    });
});
