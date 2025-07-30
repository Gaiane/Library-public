import { Routes } from '@angular/router';

import { AddBookComponent } from './books/add-book/add-book.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { BookEditComponent } from './books/book-details/book-edit/book-edit.component';
import { BooksComponent } from './books/books.component';
import { SearchResultsComponent } from './books/search-results/search-results.component';
import { GenreComponent } from './genres/genre/genre.component';
import { GenresComponent } from './genres/genres.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        title: 'Hauptseite',
    },
    {
        path: 'buecher',
        title: 'Alle Bücher',
        data: { title: 'Alle Bücher' },
        children: [
            {
                path: '',
                component: BooksComponent,
            },
            {
                path: 'neue',
                component: AddBookComponent,
                data: { title: 'Buch hinzufügen' },
            },
            {
                path: ':buchId',
                component: BookDetailsComponent,
            },
            {
                path: ':buchId/bearbeiten',
                component: BookEditComponent,
            },
        ],
    },
    /* {
        path: 'buecher',
        component: BooksComponent,
        title: 'Alle Bücher',
        data: {
            title: 'Alle Bücher'
        }
    },
    {
        path: 'buecher/neue',
        component: AddBookComponent,
        title: 'Buch hinzufügen',
        data: {
            title: 'Buch hinzufügen'
        }
    },
    {
        path: 'buecher/:buchId',
        component: BookDetailsComponent,
    },
    {
        path: 'buecher/:buchId/bearbeiten',
        component: BookEditComponent
    }, */
    {
        path: 'genres',
        component: GenresComponent,
        title: 'Alle Genres',
        data: {
            title: 'Alle Genres'
        }
    },
    {
        path: 'genres/:genreId',
        component: GenreComponent
    },
    {
        path: 'suche',
        component: SearchResultsComponent,
        title: 'Suchergebnisse',
        data: {
            title: 'Suchergebnisse'
        }
    },

]
