import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


import { EditGenreDialogComponent } from './edit-genre-dialog/edit-genre-dialog.component';
import { GENRE_CARD } from '../../constants/genre-constants';
import { Genre } from '../../interfaces/genre';
import { GenresService } from '../../services/genres.service';

/**
 * GenreCardComponent
 * 
 * @description
 * Represents an individual genre card that displays genre information.
 * It allows navigation to the genre detail page and provides functionality for editing 
 * the genre through a dialog.
 * 
 * @example
 * <lib-genre-card [genre]="genreData"></lib-genre-card>
 */
@Component({
  selector: 'lib-genre-card',
  templateUrl: './genre-card.component.html',
  styleUrl: './genre-card.component.scss',
  standalone: true,
  imports: [MatIconModule]
})
export class GenreCardComponent {

  public genre = input.required<Genre>();

  @Output() genreUpdated = new EventEmitter<Genre>();

  private readonly dialog = inject(MatDialog);
  private readonly genresService = inject(GenresService);
  private readonly router = inject(Router);

  public genreConstants = GENRE_CARD;

  /**
   * Navigates to the specific genre detail page with dynamic data.
   * 
   */
  public navigateToRoute(): void {
    const genre = this.genre();

    this.genresService.updateGenreData(genre);

    this.router.navigate(['/genres/', genre.id])
      .catch(error => {
        console.error('Navigation failed', error);
      });
  }

  /**
    * Opens a dialog for editing the genre.
    * The dialog allows the user to modify the genre's properties (color and label).
    * 
    */
  public showEditGenreDialog(): void {
    const dialogRef = this.dialog.open(EditGenreDialogComponent, {
      data: this.genre()
    });

    dialogRef.afterClosed().subscribe((updatedGenre: Genre | undefined) => {
      if (updatedGenre) {
        this.genreUpdated.emit(updatedGenre);
      }
    });
  }
}
