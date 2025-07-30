/**
 * Common constants 
 */

// Buttons
export const BUTTONS = {
    ADD_NEW: {
        ARIA_LABEL: (item: any) => `${item} hinzufügen`,
        LABEL: 'Neu hinzufügen'
    },
    CANCEL: {
        ARIA_LABEL: 'Schließen',
        LABEL: 'Abbrechen'
    },
    DELETE: {
        ARIA_LABEL: (item: any) => `${item} löschen`,
        LABEL: 'Löschen'
    },
    EDIT: {
        ARIA_LABEL: (item: any) => `${item} bearbeiten`,
        LABEL: 'Bearbeiten'
    },
    RESET: {
        ARIA_LABEL: 'Filters zurücksetzen',
        LABEL: 'Zurücksetzen',
    },
    SAVE: {
        ARIA_LABEL: (item: any) => `${item} speichern`,
        LABEL: 'Speichern'
    }
}

// Common strings
export const COMMON_STRINGS = {
    ALL: 'Alle',
    ALL_BOOKS_TITLE: 'Alle Bücher',
    BOOK: 'Buch',
    EDIT: (item: any) => `"${item}" bearbeiten`,
    GENRE: 'Genre',
    LANGUAGE: 'Sprache',
    LENT: 'Ausleihstatus',
    NO_BOOKS_TEXT: 'Es gibt kein Bücher',
    READ: 'Lesestatus',
    SORTING: 'Sortierung',
    TYPE: 'Typ'
}

export const HEADER =  {
    ARAI_LABEL: 'Seiteheader',
    LOGO:  {
        ARIA_LABEL: 'Hauptseite',
        IMAGE_ALT: 'Bibliothekslogo',
        TITLE: 'Zurück zur Startseite'
    },
    SEARCH: {
        ARIA_LABEL: 'Suche'
    }

}