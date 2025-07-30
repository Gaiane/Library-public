import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

import { BOOK_DETAILS, BOOK_FORM, BOOK_LANGUAGES, BOOK_TYPES } from '../../../shared/constants/book-constants';
import { BUTTONS, COMMON_STRINGS } from '../../../shared/constants/common-constants';
import { Book, BookType } from '../../../shared/interfaces/book';
import { SelectOption } from '../../../shared/interfaces/filters';
import { Genre } from '../../../shared/interfaces/genre';
import { BooksService } from '../../../shared/services/books.service';
import { DataService } from '../../../shared/services/data.service';
import { GenresService } from '../../../shared/services/genres.service';
import { RouteService } from '../../../shared/services/route.service';
import { TempDataService } from '../../../shared/services/temp-data.service';

/**
 * BookEditComponent
 * 
 * @description
 * Component responsible for editing existing book, called by id.
 * 
 * @example
 * <lib-book-edit></lib-book-edit>
 * 
 * @todo 
 * - add cover
 */
@Component({
  selector: 'lib-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class BookEditComponent implements OnInit {

  private readonly booksService = inject(BooksService);
  private readonly dataService = inject(DataService);
  private readonly genresService = inject(GenresService);
  private readonly router = inject(Router);
  private readonly routeService = inject(RouteService);
  private readonly tempDataService = inject(TempDataService);

  public book = signal<Book | null>(null);
  public genres = signal<Genre[]>([]);

  public bookLanguges: SelectOption[] = BOOK_LANGUAGES; // List of languages for selector
  public bookTypes: BookType[] = BOOK_TYPES; // List of book types for selector
  public bookDetailsConstants = BOOK_DETAILS;
  public bookFormConstants = BOOK_FORM;
  public buttonConstants = BUTTONS;
  public commonConstants = COMMON_STRINGS;
  private data = this.tempDataService.data;
  public title = '';

  // Form for editing a book
  public bookForm = new FormGroup({
    authors: new FormControl('', { validators: [Validators.required] }),
    bookPlace: new FormControl(''),
    genre: new FormControl('', { validators: [Validators.required] }),
    isbn: new FormControl(''),
    language: new FormControl('', { validators: [Validators.required] }),
    publisher: new FormControl('', { validators: [Validators.required] }),
    serie: new FormControl(''),
    title: new FormControl('', { validators: [Validators.required] }),
    type: new FormControl('', { validators: [Validators.required] }),
    year: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(4),
        Validators.min(1445),
        Validators.max(new Date().getFullYear())]
    }),
  });

  constructor() {
    this.routeService.getRouteData().subscribe((data) => {
      this.title = data.title;
    });

    this.dataService.data$.subscribe(data => {
      if (data) {
        this.book.set(data);
        if (!this.data()) {
          this.tempDataService.set(data);
        }
      } else {
        this.book.set(this.data());
      }
    });

    effect(() => {
      const formData = this.book();
      if (formData) {
        const authorsString = formData.authors.join(', ');
        this.bookForm.patchValue({
          authors: authorsString,
          bookPlace: formData.bookPlace,
          genre: formData.genre,
          isbn: formData.isbn,
          language: formData.language,
          publisher: formData.publisher,
          serie: formData.serie,
          title: formData.title,
          type: formData.type,
          year: formData.year
        });
      }
    });
  }

  ngOnInit(): void {
    this.genresService.fetchGenres().then(() =>
      this.genres.set(this.genresService.allGenres())
    );
  }

  /**
   * Checks whether a specific form field is invalid and has been touched.
   * 
   * @param fieldName - name of the form control to check.
   * @returns true if the field exists, is invalid, and has been touched; otherwise, false.
   */
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!field && field?.invalid && field.touched;
  }

  /**
   * Returns the appropriate validation error message for a given form field.
   *
   * @param fieldName - name of the form control to retrieve the error message for.
   * @returns an error message based on the field's validation state, or an empty string if there is no error.
   */
  public getErrorMessage(fieldName: string): string {
    const field = this.bookForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.hasError('required')) {
      return this.bookFormConstants.ERRORS.REQUIRED;
    }

    if (fieldName === 'year') {

      if (field.hasError('maxlength')) {
        return this.bookFormConstants.ERRORS.YEAR_LENGTH(field.errors?.['maxlength']?.requiredLength);
      }

      if (field.hasError('min')) {
        return this.bookFormConstants.ERRORS.YEAR_MIN(field.errors?.['min']?.min);
      }

      if (field.hasError('max')) {
        return this.bookFormConstants.ERRORS.YEAR_MAX(field.errors?.['max']?.max);
      }
    }

    return '';
  }

  /**
   * Handles form submission for save changes.
   * 
   * @returns promise that resolves when navigation completes or validation fails
   */
  public async onSubmit(): Promise<void> {

    const currentBook = this.book();

    if (!currentBook) return;

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formData = this.bookForm.value;

    const authorsArray = formData.authors
      ? formData.authors
        .split(',')
        .map(author => author.trim())
        .filter(Boolean)
      : [];

    const libraryId = this.getLibraryId(formData);

    const editedBook = {
      ...formData,
      authors: authorsArray,
      id: Number(currentBook?.id),
      libraryId: libraryId
    }
    try {
      await this.booksService.updateBook(editedBook.id.toString(), editedBook)
      await this.router.navigateByUrl(`/buecher/${currentBook?.id}`);
    } catch (error) {
      console.error('Failed to save book:', error);
    }
  }

  /**
   * Navigates back to the detail page of the current book.
   */
  public cancel() {
    this.router.navigateByUrl(`/buecher/${this.book()?.id}`);
  }

  /**
   * Generates a unique library ID for a book based on its genre, shelf location, and ID.
   *
   * @param formData - form data containing book details such as genre and bookPlace
   * @returns string in the format: "genre-bookPlace-bookId", used as the library ID
  */
  private getLibraryId(formData: any): string {
    const currentBook = this.book();

    if (!currentBook) return '';

    if (formData.genre !== this.book()?.genre || formData.bookPlace !== this.book()?.bookPlace) {
      return `${formData.genre}-${formData.bookPlace}-${currentBook?.id}`;
    }

    return currentBook.libraryId;
  }

}