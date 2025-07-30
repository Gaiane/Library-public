import { Component, effect, inject, signal } from '@angular/core';

import { BookCardComponent } from '../shared/components/book-card/book-card.component';
import { Book } from '../shared/interfaces/book';
import { BooksService } from '../shared/services/books.service';

/**
 * HomepageComponent
 * 
 * @description
 * Represents a star page of the project
 * 
 * @todo
 * - think about elements:
 *   -- list of last 10 books were added,
 *   -- genres with more button,
 *   -- CTA to add new book,
 *   -- Show additional media types: CDs, Vinyls, cassetts etc...
 *   --
 */
@Component({
  selector: 'lib-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  standalone: true,
  imports: [BookCardComponent]
})
export class HomepageComponent {

  private readonly booksService = inject(BooksService);

  public books = signal<Book[]>([]);

  constructor() {
    effect(() => {
      this.loadBooks();
    });
  }

  /**
   * Loads the list of books for a specific genre, based on the genreId
   * extracted from the route parameters.
   */
  private async loadBooks(): Promise<void> {
    try {
      await this.booksService.fetchBooks(10);
      this.books.set(this.booksService.allBooks());
    } catch (error) {
      console.error('Error loading genre details: ', error);
    }
  }
}
