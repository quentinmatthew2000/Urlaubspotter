// sub-context.js — bulletproof sub-label resolver.
// Inline-imported door iedere Niveau 2/3/4 pagina zodat de
// sub-as-primary rendering NIET kan falen op stale site-data.js
// of een ontbrekende DATA.subLabel functie. Single source of
// truth voor het sub-label is nog steeds SITE_DATA.subLabels in
// site-data.js; deze map dient enkel als fallback.

(function () {
    "use strict";

    const SUB_LABELS_FALLBACK = {
        hotel: {
            'boutique':      'Boutique Hotels',
            'adult-only':    'Adult Only Hotels',
            'wellness':      'Wellness Hotels',
            'all-inclusive': 'All-inclusive Hotels',
            'design':        'Design Hotels',
            'city':          'Centrumgelegen Hotels',
            'resort':        'Resorts',
        },
        camping: {
            'glamping':  'Glamping',
            'waterpark': 'Camping met Aquapark',
            'natuur':    'Camping in de natuur',
            'kids':      'Kindercampings',
            'honden':    'Hondvriendelijke campings',
            'zee':       'Campings aan zee',
        },
        'holiday-park': {
            'zwemparadijs':  'Vakantieparken met zwemparadijs',
            'attractiepark': 'Vakantieparken met attractiepark',
            'luxe':          'Luxe vakantieparken',
            'kids':          'Kindvriendelijke vakantieparken',
            'natuur':        'Vakantieparken in de natuur',
            'themaparken':   'Themaparken',
        },
    };

    function safeSubLabel(what, sub) {
        if (!what || !sub) return '';
        try {
            if (window.DATA && typeof window.DATA.subLabel === 'function') {
                const r = window.DATA.subLabel(what, sub);
                if (r) return r;
            }
        } catch (_) { /* fall through */ }
        return (SUB_LABELS_FALLBACK[what] && SUB_LABELS_FALLBACK[what][sub]) || '';
    }

    window.SUB_LABELS_FALLBACK = SUB_LABELS_FALLBACK;
    window.safeSubLabel = safeSubLabel;
})();
