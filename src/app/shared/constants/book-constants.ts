/**
 * Book constants
 */

import { BookType } from "../interfaces/book";
import { SelectOption } from "../interfaces/filters";

// Book card
export const BOOK_CARD = {
    ARIA_LABELS: {
        TOGGLE: 'Toogle Lesestatus',
        NO_COVER: 'Es gibt kein Buchcover'
    },
    IMAGE_ALT: (title: string) => `${title} Buchcover'`,
};

// Book details
export const BOOK_DETAILS = {
    AUTHOR: 'Autor',
    AUTHORS: 'Autor(en)',
    GENRE: 'Genre',
    ISBN: 'ISBN',
    LANGUAGE: 'Sprache',
    LENT_TO: 'Verliehen an',
    LIBRARY_NUMBER: 'Bibliothek Nr.',
    LOAN_STATUS: 'Ausleihstatus',
    PUBLISHER: 'Verlag',
    READ_STATUS: 'Lesestatus',
    SERIE: 'Serie',
    SHELF: 'Regal',
    SINCE: 'seit',
    TITLE: 'Titel',
    TYPE: 'Typ',
    YEAR: 'Jahr'
};

// Filters and sorting aria labels
export const BOOK_FILTER_SORTING = {
    ARIA_LABELS: {
        GENRE: 'Genrefilter auswählen',
        LANGUAGE: 'Sprachefilter auswählen',
        LENT: 'Ausleihstatus auswählen',
        READ: 'Lesestatus auswählen',
        SORTING: 'Sortieren nach',
        TYPE: 'Typfilter auswählen'
    }
}

// Add a new book form or edit book form
export const BOOK_FORM = {
    ARIA_LABELS: {
        INPUT_AUTHOR: 'Author oder Authoren eingeben',
        INPUT_GENRE: 'Genre auswählen',
        INPUT_ISBN: 'ISBN eingeben',
        INPUT_LANGUAGE: 'Sprache auswählen',
        INPUT_PUBLISHER: 'Verlag eingeben',
        INPUT_SERIE: 'Serie eingeben',
        INPUT_SHELF: 'Regal eingeben',
        INPUT_TITLE: 'Titel eingeben',
        INPUT_TYPE: 'Typ auswählen',
        INPUT_YEAR: 'Jahr auswählen',
    },
    INPUT_AUTHOR_PLACEHOLDER: 'Wert(e) eingeben, bei mehreren durch Komma trennen',
    ERRORS: {
        ISBN_EXISTS: 'ISBN existiert',
        REQUIRED: 'Bitte gib einen Wert ein',
        YEAR_LENGTH: (maxlength: any) => `Das Jahr muss ${maxlength} Zeichen lang sein`,
        YEAR_MAX: (max: any) => `Das Jahr muss maximal ${max} sein`,
        YEAR_MIN: (min: any) => `Das Jahr muss mindestens ${min} sein`,
    }
}

// Array of book languages
export const BOOK_LANGUAGES: SelectOption[] = [
    { value: 'DE', viewValue: 'Deutsch' },
    { value: 'EN', viewValue: 'Englisch' },
    { value: 'FR', viewValue: 'Französisch' },
    { value: 'RU', viewValue: 'Russisch' }
];

// Array of books sorting options
export const BOOK_SORTING_OPTIONS: SelectOption[] = [
    { value: 'author_asc', viewValue: 'Autor (A-Z)' },
    { value: 'author_desc', viewValue: 'Autor (Z-A)' },
    { value: 'title_asc', viewValue: 'Titel (A-Z))' },
    { value: 'title_desc', viewValue: 'Titel (Z-A)' },
    { value: 'id_asc', viewValue: 'Älteste' },
    { value: 'id_desc', viewValue: 'Neuste' }
]

// Book statuses options 
export const BOOK_STATUSES_OPTIONS = {
    isLent: [
        { value: true, viewValue: 'Ausgeliehen' },
        { value: false, viewValue: 'Nicht ausgeliehen' },
    ],
    isRead: [
        { value: true, viewValue: 'Gelesen' },
        { value: false, viewValue: 'Nicht gelesen' }
    ]
}

// Book read statuses labels 
export const BOOK_STATUSES_LABELS = {
    LENT_OUT: "Ausgeliehen",
    READ: "Gelesen",
    NOT_LENT: "Nicht ausgeliehen",
    NOT_READ: "Nicht gelesen"
}

// Array of book formats/types with their icons and display values
export const BOOK_TYPES: BookType[] = [
    { icon: 'two_pager', value: 'ebook', viewValue: 'Ebuch' },
    { icon: 'headphones', value: 'audioBook', viewValue: 'Hörbuch' },
    { icon: 'auto_stories', value: 'paperBook', viewValue: 'Parierbuch' },
];


