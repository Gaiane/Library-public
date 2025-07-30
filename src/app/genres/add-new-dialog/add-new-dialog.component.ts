import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { BUTTONS, COMMON_STRINGS } from '../../shared/constants/common-constants';
import { GENRE_FORMS } from '../../shared/constants/genre-constants';
import { Genre } from '../../shared/interfaces/genre';
import { GenresService } from '../../shared/services/genres.service';

/**
 * AddNewDialogComponent
 * 
 * @description
 * A modal dialog component that allows the user to add a new genre by filling out a form.
 * On submission, the data is sent to Firestore. On cancel, the dialog closes without saving.
 * 
 */
@Component({
  selector: 'lib-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrl: './add-new-dialog.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
})
export class AddNewDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<AddNewDialogComponent>);
  private readonly genresService = inject(GenresService);

  public readonly genreForm = new FormGroup({
    color: new FormControl('', { validators: Validators.required }),
    id: new FormControl('', { validators: Validators.required }),
    label: new FormControl('', { validators: Validators.required }),
  });

  public buttonConstants = BUTTONS;
  public commonConstants = COMMON_STRINGS;
  public genreFormConstants = GENRE_FORMS.ADD;

  /**
   * Close a modal dialog wothout saving data.
   */
  public cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Saves the new genre data to Firestore.
   */
  public save(): void {
    if (this.genreForm.valid) {

      const formData = this.genreForm.getRawValue();

      const newGenre: Genre = {
        id: formData.id!,
        label: formData.label!,
        color: formData.color!
      };

      this.genresService.addGenre(newGenre)
        .then(() => {
          this.dialogRef.close(newGenre);
        }).catch(error => {
          console.error('Error updating document: ', error);
          this.dialogRef.close(false);
        });
    }
  }

}
