import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogClose,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BUTTONS, COMMON_STRINGS } from '../../../constants/common-constants';
import { GENRE_FORMS } from '../../../constants/genre-constants';
import { GenresService } from '../../../services/genres.service';


/**
 * EditGenreDialogComponent
 * 
 * @description
 * Component responsible for editing genre info (color and label).
 * 
 * @example
 * <lib-edit-genre-dialog></lib-edit-genre-dialog>
 */
@Component({
  selector: 'lib-edit-genre-dialog',
  templateUrl: './edit-genre-dialog.component.html',
  styleUrl: './edit-genre-dialog.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class EditGenreDialogComponent implements OnInit {

  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditGenreDialogComponent>);
  private readonly genresService = inject(GenresService);

  public buttonConstants = BUTTONS;
  public commonConstants = COMMON_STRINGS;
  public genreFormConstants = GENRE_FORMS.EDIT;

  public genreForm = new FormGroup({
    color: new FormControl(this.data.color || '', { validators: Validators.required }),
    label: new FormControl(this.data.label || '', { validators: Validators.required }),
  });

  private genreId = this.data.id;

  ngOnInit() {
    this.genreForm.patchValue({
      color: this.data.color,
      label: this.data.label
    });
  }

  /**
   * Close a modal dialog wothout saving data
   */
  public cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Saves the form data to Firestore by updating the genre document.
   */
  public save(): void {
    if (this.genreForm.valid) {
      const formData = this.genreForm.value;
      this.genresService.updateGenre(formData, this.genreId).then(() => {
        this.dialogRef.close({
          ...formData,
          id: this.genreId
        });
      }).catch(error => {
        console.error('Error updating document: ', error);
        this.dialogRef.close(false);
      });
    }
  }
}
