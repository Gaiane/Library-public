
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';

import { BookCardComponent } from "../shared/components/book-card/book-card.component";
import { BOOK_DETAILS, BOOK_LANGUAGES, BOOK_SORTING_OPTIONS, BOOK_STATUSES_OPTIONS, BOOK_TYPES } from '../shared/constants/book-constants';
import { COMMON_STRINGS } from '../shared/constants/common-constants';
import { Book, BookType } from '../shared/interfaces/book';
import { BooksService } from '../shared/services/books.service';
import { RouteService } from '../shared/services/route.service';

/**
 * BooksComponent
 * 
 * @description
 * Component responsible for fetching and displaying a list of all books from Firestore database.
 * Uses the BooksService to fetch and manage book data.
 * 
 * @example
 * <lib-books></lib-books>
 * 
 * @todo 
 * - check if move books in separate reusable (genre page component) component (book list component)
 * - add sorting (by author, by title)
 * - add filter (read status, lent status, language, genre, type)
 * - add pagination
 */
@Component({
  selector: 'lib-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  standalone: true,
  imports: [
    BookCardComponent,
    MatFormFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent {

  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private router = inject(Router);
  private routeService = inject(RouteService);

  public books = signal<Book[]>([]);
  public error = signal<string | null>(null);
  public formValues = signal<Record<string, string>>({});
  public title = signal<string>('');

  public bookDetailsConstants = BOOK_DETAILS;
  public bookLanguages = BOOK_LANGUAGES;
  public booksSortingOptions = BOOK_SORTING_OPTIONS;
  public booksStatusesOptions = BOOK_STATUSES_OPTIONS;
  public bookTypes: BookType[] = BOOK_TYPES;
  public commonConstants = COMMON_STRINGS;

  constructor() {
    this.routeService.getRouteData().subscribe((data) => {
      this.title.set(data.title);
    });
    effect(() => {
      this.fetchBooksByQueryParam();
    });
  }


  /**
   * Handles filter or sorting selection changes
   */
  public onValueChanged(event: { key: string; value: string }) {
    this.formValues.update((values) => {
      const updated = {
        ...values,
        [event.key]: event.value === 'all' ? '' : event.value
      }
      const queryParams = Object.fromEntries(
        Object.entries(updated).filter(([, value]) => value !== '' && value !== undefined)
      );

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: '',
      }).then(() => {
        //this.fetchFilteredBooks(this.formValues());
        this.fetchBooksByQueryParam();
      });
      return updated;
    });
  }

  /**
   * Fetchs books from Firestore based on query parameters
   */
  private async fetchBooksByQueryParam(): Promise<void> {
    const params = this.activatedRoute.snapshot.queryParamMap;

    const queryParams: Record<string, string> = {};

    params.keys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        queryParams[key] = value;
      }
    });

    try {
      // If any query params exist, use them to filter
      if (Object.keys(queryParams).length > 0) {
        await this.booksService.fetchBooksByQueryParams(queryParams);
        // If only one query param, update title  
        if (Object.keys(queryParams).length === 1) {
          const value = Object.values(queryParams)[0];
          this.title.update(prev => `${prev} - ${value}`);
        }
        this.books.set(this.booksService.allBooks());
        console.log(this.booksService.allBooks());
      } else {
        await this.loadAllBooks();
      }
    } catch (error) {
      this.handleError('Failed to fetch books by query params:', error);
    }
  }

  /**
   * Loads all books from Firestore
   */
  private async loadAllBooks(): Promise<void> {
    try {
      await this.booksService.fetchBooks(18)
      this.books.set(this.booksService.allBooks());
    } catch (error) {
      this.handleError(`Failed to fetch books: `, error);
    }
  }

  /**
   * Loads all books by specific author from Firestore
   * 
   * @param author - author's name to filter books by 
   */
  private async loadAllBooksByAuthor(author: string): Promise<void> {
    try {
      const books = await this.booksService.fetchBooksByAuthor(author);
      this.title.set(author);
      this.books.set(books);
    } catch (error) {
      this.handleError(`Failed to fetch books by author: ${author}`, error);
    }
  }

  /**
   * Loads all books by a specific field from Firestore
   * 
   * @param field - name of the field in a document in Firestore collection 
   * @param value - specific value of the field 
   */
  private async loadAllBooksByField(field: string, value: string): Promise<void> {
    try {
      //await this.booksService.fetchBooksByField(field, value);
      this.title.set(value);
      this.books.set(this.booksService.allBooks());
    } catch (error) {
      this.handleError(`Failed to fetch books by field ${field}: `, error);
    }
  }

  /**
   * Handles errors and updates the error
   * @param message - Error message
   */
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.error.set(message);
    this.books.set([]);
  }

}