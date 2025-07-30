import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { AddNewDialogComponent } from './add-new-dialog/add-new-dialog.component';
import { GenreCardComponent } from '../shared/components/genre-card/genre-card.component';
import { BUTTONS } from '../shared/constants/common-constants';
import { Genre } from '../shared/interfaces/genre';
import { GenresService } from '../shared/services/genres.service';
import { RouteService } from '../shared/services/route.service';

/**
 * GenresComponent
 * 
 * @description
 * This component is responsible for fetching and displaying a list of genres from the Firestore database.
 * Uses the GenresService to retrieve genres and passes them to the GenreCardComponent for display.
 * 
 * @example
 * <lib-genres></lib-genres>
 */
@Component({
  selector: 'lib-genres',
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss',
  standalone: true,
  imports: [
    GenreCardComponent,
    MatIconModule
  ]
})
export class GenresComponent implements OnInit {

  private readonly dialog = inject(MatDialog);
  private readonly genresService = inject(GenresService);
  private readonly routeService = inject(RouteService);

  public genres = signal<Genre[]>([]);
  public title = toSignal(this.routeService.getRouteData()
    .pipe(
      map(item => item.title)
    )
  );

  public buttonsConstants = BUTTONS;

  ngOnInit(): void {
    this.loadGenres();
  }

  /**
    * Opens a dialog for editing the genre.
    * Reloads the genres list if a new genre added.
    * 
    */
  public showAddGenreDialog(): void {
    const dialogRef = this.dialog.open(AddNewDialogComponent);

    dialogRef.afterClosed().subscribe((newGenre: Genre | undefined) => {
      if (newGenre) {
        this.loadGenres();
      }
    })
  }

  /**
   * Updates the local genres signal by replacing the genre with a matching ID
   * with the provided updated genre.
   *
   * @param updatedGenre - genre object containing the updated data.
   */
  public onGenreUpdated(updatedGenre: Genre) {
    this.genres.set(
      this.genres().map(genre =>
        genre.id === updatedGenre.id ? updatedGenre : genre
      )
    );
  }

  /**
   * Fetches genres from Firestore and updates the genres list.
   * 
   */
  private async loadGenres(): Promise<void> {
    try {
      await this.genresService.fetchGenres();
      this.genres.set(this.genresService.allGenres());
    } catch (error) {
      console.error('Failed to load genres: ', error);
      this.genres.set([]);
    }
  }
}
