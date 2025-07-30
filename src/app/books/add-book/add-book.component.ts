import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';


import { BOOK_DETAILS, BOOK_FORM, BOOK_LANGUAGES, BOOK_TYPES } from '../../shared/constants/book-constants';
import { BUTTONS, COMMON_STRINGS } from '../../shared/constants/common-constants';
import { BookType } from '../../shared/interfaces/book';
import { SelectOption } from '../../shared/interfaces/filters';
import { Genre } from '../../shared/interfaces/genre';
import { BooksService } from '../../shared/services/books.service';
import { GenresService } from '../../shared/services/genres.service';
import { RouteService } from '../../shared/services/route.service';
import { isbnValidator } from '../../shared/validators/isbn-validator';
//import { ImageUploadService } from '../../shared/services/image-upload.service';



/**
 * AddBookComponent
 * 
 * @description
 * Component responsible for adding new books to the Firestore database.
 * Uses the BooksService to persist data and GenresService to retrieve available genres.
 * 
 * @example
 * <lib-add-book></lib-add-book>
 * 
 * @todo 
 * - add cover - later when app ready or update firestore
 * - find open ISBN Rest-API
 */
@Component({
  selector: 'lib-add-book',
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookComponent implements OnInit {

  // Injected services
  private readonly booksService = inject(BooksService);
  private readonly genresService = inject(GenresService);
  //private readonly imageUploadService = inject(ImageUploadService); // TODO: later, when app ready
  private readonly router = inject(Router);
  private readonly routeService = inject(RouteService);

  //public coverImageUrl = signal<string | null>(null); // TODO: later, when app ready
  public genres = signal<Genre[]>([]);

  public bookDetailsConstants = BOOK_DETAILS;
  public bookFormConstants = BOOK_FORM;
  public bookLanguges: SelectOption[] = BOOK_LANGUAGES; // List of languages for selector
  public bookTypes: BookType[] = BOOK_TYPES; // List of book types for selector
  public buttonConstants = BUTTONS;
  public commonConstants = COMMON_STRINGS;
  public title = '';

  // Form for adding a new book
  public bookForm = new FormGroup({
    authors: new FormControl('', { validators: [Validators.required] }),
    bookPlace: new FormControl(''),
    //coverUrl: new FormControl(''),
    genre: new FormControl('', { validators: [Validators.required] }),
    isbn: new FormControl('', {
      asyncValidators: [isbnValidator()],
      updateOn: 'blur'
    }),
    language: new FormControl('RU', { validators: [Validators.required] }), // Default value 'RU'
    publisher: new FormControl('', { validators: [Validators.required] }),
    serie: new FormControl(''),
    title: new FormControl('', { validators: [Validators.required] }),
    type: new FormControl('paperBook', { validators: [Validators.required] }), // Default value 'paperBook'
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
  }

  ngOnInit(): void {
    this.genresService.fetchGenres().then(() =>
      this.genres.set(this.genresService.allGenres())
    );
  }

  /**
   * Getter for the ISBN form control
   * 
   * @returns FormControl instance managing the 'isbn' field,
   *          typed as string or null
   */
  public get isbn(): FormControl<string | null> {
    return this.bookForm.get('isbn') as FormControl<string | null>;
  }

  /**
   * Checks whether a specific form field is invalid and has been touched
   * 
   * @param fieldName - name of the form control to check
   * @returns true if the field exists, is invalid, and has been touched; otherwise, false
   */
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!field && field?.invalid && field.touched;
  }

  /**
   * Returns the appropriate validation error message for a given form field
   *
   * @param fieldName - name of the form control to retrieve the error message for
   * @returns an error message based on the field's validation state, or an empty string if there is no error
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

    if (field.hasError('isbnExists')) {
      return this.bookFormConstants.ERRORS.ISBN_EXISTS;
    }

    return '';
  }

  /**
   * Handles file input change event to upload and store a selected image file.
   * 
   * @todo finish and check, when app is ready or firestore upgrade  
   */
  /*
  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('No file selected.');
      return;
    }

    const file = input.files[0];
    try {
      const url = await this.imageUploadService.uploadAndSave(file);
      this.coverImageUrl.set(url);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      input.value = '';
    }
  }*/

  /**
 * Handles form submission for adding a new book
 * 
 * @returns Promise that resolves when navigation completes or validation fails
 */
  public async onSubmit(): Promise<void> {

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    if (this.bookForm.controls.isbn.hasError('isbnExists')) {
      return;
    }

    const formData = this.bookForm.value;

    const authorsArray = formData.authors
      ? formData.authors
        .split(',')
        .map(author => author.trim())
        .filter(Boolean)
      : [];

    const booksSnapshot = await this.booksService.fetchBooksSnapshot(20);
    const newBookId = (booksSnapshot.size + 1);
    const libraryId = this.getLibraryId(formData, newBookId);

    const newBook: any = {
      ...formData,
      authors: authorsArray,
      //...(this.coverImageUrl && { cover: this.coverImageUrl }),
      id: newBookId,
      libraryId: libraryId,
      isLent: false,
      isRead: false
    }

    try {
      await this.booksService.addBook(newBook, newBookId.toString());
      this.router.navigateByUrl(`/buecher/${newBookId}`);
    } catch (error) {
      console.error('Failed to save book:', error);
    }
  }

  /**
   * Generates a unique library ID for a book based on its genre, shelf location, and ID
   *
   * @param formData - form data containing book details such as genre and bookPlace
   * @param bookId - unique identifier generated for the new book
   * @returns string in the format: "genre-bookPlace-bookId", used as the library ID
  */
  private getLibraryId(formData: any, bookId: string): string {
    return formData.genre + '-' + formData.bookPlace + '-' + bookId;
  }
}

