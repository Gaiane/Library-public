/**
 * Search constants 
 */

// Search input
export const SEARCH_INPUT = {
    ARIA_LABELS: {
        BUTTON_CLEAR: 'Suche zurücksetzen',
        BUTTON_SEARCH: 'Suche starten',
        INPUT: 'Buchsuche, z.B. Titel, Autor oder Verlag eingeben',
    },
    PLACEHOLDER: 'Buchsuche, z.B. Titel, Autor oder Verlag',
}

// Search results
export const SEARCH_RESULTS = {
    ALL_BOOKS_TITLE: 'Alle Bücher',
    FALSE_SEARCH_RESULTS_TEXT: 'Bitte geben Sie eine andere Suchanfrage ein',
    NO_BOOKS_TEXT: 'Es gibt kein Bücher',
    NO_SEARCH_RESULTS_TEXT: 'Bitte geben Sie eine Suchanfrage ein',
    NO_SEARCH_RESULTS_TITLE: (query: any) => `Keine Ergebnisse für "${query}" gefunden`,
    SEARCH_RESULT_TITLE: (resultsNumbers: any, query: any) => `Es gibt "${resultsNumbers}" Suchergebnisse für "${query}"`,
}