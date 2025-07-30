import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { BOOK_DETAILS, BOOK_STATUSES_LABELS, BOOK_TYPES } from '../../shared/constants/book-constants';
import { BUTTONS, COMMON_STRINGS } from '../../shared/constants/common-constants';
import { Book } from '../../shared/interfaces/book';
import { BooksService } from '../../shared/services/books.service';
import { DataService } from '../../shared/services/data.service';
import { GenresService } from '../../shared/services/genres.service';

/**
 * BookDetailsComponent
 * 
 * @description
 * Displays and manages detailed view of a single book.
 * Includes update, delete, and auxiliary navigation actions.
 * 
 * @example
 * <lib-book-details></lib-book-details>
 */
@Component({
  selector: 'lib-book-details',
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent {

  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private genreService = inject(GenresService);
  private router = inject(Router);

  public book = signal<any>(null);
  public genreLabel = signal<string>('');

  public bookDetails = BOOK_DETAILS; // Book details constants
  public bookForm = new FormGroup({
    borrowerName: new FormControl(''),
    dateOfLent: new FormControl(''),
    lent: new FormControl(false),
    read: new FormControl(false)
  });
  public buttonConstants = BUTTONS;
  public commonConstants = COMMON_STRINGS;
  public isBookLent = signal<boolean>(false);

  private statuses = BOOK_STATUSES_LABELS;

  constructor() {
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      const bookId = params.get('buchId');
      if (bookId) {
        this.fetchBook(bookId);
      }
    });

    effect(() => {
      if (this.book()) {
        this.bookForm.patchValue(this.book());
        this.fetchBookGenre();
      }
    });
  }

  /**
   * Returns the display name for the book's type
   */
  public get bookType(): string {
    return BOOK_TYPES.find(bookType => bookType.value === this.book().type)?.viewValue ?? '-';
  }

  /**
   * Returns the display string for the book's lending status
   */
  public get lentStatus(): string {
    return this.book().isLent ? this.statuses.LENT_OUT : this.statuses.NOT_LENT;
  }

  /**
   * Returns the display string for the book's reading status
   */
  public get readState(): string {
    return this.book().isRead ? this.statuses.READ : this.statuses.NOT_READ;
  }

  /**
   * Fetches the genre for the current book using its genre ID
   */
  public async fetchBookGenre(): Promise<void> {
    const genre = await this.genreService.fetchGenreById(this.book().genre);
    this.genreLabel.set(genre.label);
  }

  /**
   * Toggles the read status of the book and updates it in Firestore
   * This method changes the local 'isRead' status and then attempts to persist
   * this change in the Firestore using the BooksService
   */
  public async toggleReadStatus(): Promise<void> {
    const book = this.book();

    if (!book) {
      console.error('No valid book available to toggle read status');
      return;
    }

    try {
      this.book().isRead = !this.book().isRead;
      const isReadKey = 'isRead';
      await this.booksService.updateBookStatus(book.id, isReadKey, this.book().isRead);
    }
    catch (error) {
      console.error('Error toggling book read status: ', error);
    }
  }
  /**
   * Toggles the lending status of the book and updates it in Firestore
   * This method changes the local 'isLent' status and then attempts to persist
   * this change in the Firestore using the BooksService
   * 
   * @todo - finish toggle
   */
  public async toggleLendStatus(event: MatSlideToggleChange): Promise<void> {
    //this.isBookLent.set(event.checked);
    const book = this.book();

    if (!book || typeof book.id !== 'string') {
      console.error('No valid book available to toggle read status');
      return;
    }
    try {
      this.book().isLent = !this.book().isLent;
      const isLentKey = 'isLent';
      await this.booksService.updateBookStatus(book.id, isLentKey, this.book().isLent);
    }
    catch (error) {
      console.error('Error toggling book read status: ', error);
    }

  }

  /**
   * Navigates to the list of all books, applying a filter for the given author
   *
   * @param author - name of the author to filter books by
   */
  public showAllBooksOfAuthor(author: string): void {
    this.router.navigate(['/buecher'], {
      queryParams: {
        author: author
      }
    });
  }

  /**
   * Navigates to the list of all books, applying a filter for the given publisher
   *
   * @param publisher - name of the ublisher to filter books by
   */
  public showAllBooksOfPublisher(publisher: string): void {
    this.router.navigate(['/buecher'], {
      queryParams: {
        publisher: publisher
      }
    });
  }

  /**
   * Navigates to the edit page for the specified book
   *
   * @param book - book to be edited.
   */
  public editBook(book: Book) {
    this.router.navigate([`/buecher/`, book.id, 'bearbeiten']);
    this.dataService.sendData(book);
  }

  /**
   * Opens a confirmation dialog to ask the user whether to delete the book.
   * If the user confirms, calls the BooksService to delete the book by ID.
   *
   * @param bookId - ID of the book to be deleted
   */
  public deleteBook(bookId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    const id = bookId.toString();

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.booksService.deleteBook(id);
        this.router.navigateByUrl('/buecher');
        console.log('Book deleted:', id);
      } else {
        console.log('Delete action cancelled');
      }
    });
  }

  /**
   * Fetches the current book using its ID
   * 
   * @param bookId - ID of the book to be shown 
   */
  private async fetchBook(bookId: string) {
    try {
      const fetchedBook = await this.booksService.fetchBookById(bookId);
      this.book.set(fetchedBook);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  }
}