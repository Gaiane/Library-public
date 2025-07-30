/**
 * Side navigation
 */

import { SidenavLink } from "../interfaces/sidenav"

// Side navigation strings
export const SIDE_NAVIGATION = {
    ARIA_LABELS: {
        SIDE_NAVIGATION: 'Seitennavigation',
        MAIN_CONTENT: 'Hauptinhalt',
        MENU: 'Hauptnavigation',
    }
}

// Array of navigation link objects for the side navigation menu with icon, label and route
export const SIDENAV_LINKS: SidenavLink[] = [
    { icon: 'library_add', label: 'Buch hinzufügen', link: '/buecher/neue' },
    { icon: 'library_books', label: 'Alle Bücher', link: '/buecher' },
    { icon: 'list', label: 'Alle Genres', link: '/genres' }
]