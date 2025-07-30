import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { COMMON_STRINGS } from '../../shared/constants/common-constants';
import { Book } from '../../shared/interfaces/book';
import { BooksService } from '../../shared/services/books.service';
import { GenresService } from '../../shared/services/genres.service';

/**
 * GenreComponent
 * 
 * @description
 * Component responsible for displaying books by genre.
 * 
 * @example 
 * <lib-genre></lib-genre>
*/
@Component({
  selector: 'lib-genre',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {

  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private genreService = inject(GenresService);

  public books = signal<Book[]>([]);
  public color = signal<string>('');
  public title = signal<string>('');

  public commonConstans = COMMON_STRINGS;

  constructor() {
    effect(() => {
      this.loadGenreBooks();
    });
  }

  /**
   *  Loads the list of books for a specific genre, based on the genreId
   *  extracted from the route parameters.
   */
  private async loadGenreBooks(): Promise<void> {
    try {
      const genreId = this.activatedRoute.snapshot.paramMap.get('genreId');

      if (genreId) {
        const [, genre] = await Promise.all([
          this.booksService.fetchBooksByField('genre', genreId),
          this.genreService.fetchGenreById(genreId)
        ]);

        this.books.set(this.booksService.allBooks());
        this.color.set(genre.color);
        this.title.set(genre.label);
      }
    } catch (error) {
      console.error('Error loading genre details: ', error);
    }
  }

}
