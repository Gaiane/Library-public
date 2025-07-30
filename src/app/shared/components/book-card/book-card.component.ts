import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BOOK_CARD } from '../../constants/book-constants';
import { Book } from '../../interfaces/book';
import { BooksService } from '../../services/books.service';

/**
 * BookCardComponent
 * 
 * @description
 * This component is responsible for displaying a card with the details of a book.
 * 
 * @example
 * <lib-book-card [book]="bookData"></lib-book-card>
 */
@Component({
  selector: 'lib-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    RouterLink
  ]
})
export class BookCardComponent {

  public book = input.required<Book>();

  private readonly booksService = inject(BooksService);

  public bookCardConstants = BOOK_CARD;

  /**
   * Toggles the read status of the book and updates it in Firestore.
   * This method changes the local 'isRead' status and then attempts to persist
   * this change in the Firestore using the BooksService.
   */
  public async toggleReadStatus() {
    const book = this.book();

    if (!book) {
      console.error('No valid book available to toggle read status');
      return;
    }

    try {
      this.book().isRead = !this.book().isRead;
      const isReadKey = 'isRead';
      await this.booksService.updateBookStatus(book.id.toString(), isReadKey, this.book().isRead);
    }
    catch (error) {
      console.error('Error toggling book read status: ', error);
    }
  }
}
