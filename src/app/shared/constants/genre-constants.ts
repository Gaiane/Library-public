/**
 * Genre constants 
 */

// Genre card
export const GENRE_CARD = {
    ARIA_LABELS: {
        NAVIGATION_BUTTONS: (genre: string) => `${genre} Seite aufrufen`,
        EDIT_BUTTONS: (genre: string) => `${genre} ändern`
    }
}

// Add a new genre or edit genre form 
export const GENRE_FORMS = {
    ADD: {
        ARIA_LABELS: {
            INPUT_COLOR: 'Farbe eingeben',
            INPUT_ID: 'Id eingeben',
            INPUT_LABEL: 'Name eingeben',
        },
        LABELS: {
            INPUT_COLOR: 'Farbe',
            INPUT_ID: 'Id',
            INPUT_LABEL: 'Name',
        },
        TITLES: {
            DIALOG: 'Neue Genre erstellen',
        }
    },
    EDIT: {
        ARIA_LABELS: {
            INPUT_COLOR: 'Farbe bearbeiten',
            INPUT_LABEL: 'Name bearbeiten'
        },
        LABELS: {
            INPUT_COLOR: 'Farbe',
            INPUT_ID: 'Id',
            INPUT_LABEL: 'Name',
        },
        TITLES: {
            DIALOG: 'Genre bearbeiten',
        }
    }
}