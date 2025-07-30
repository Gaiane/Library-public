import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { BUTTONS } from '../../../shared/constants/common-constants';

/**
 * DeleteConfirmationDialogComponent
 * 
 * @description
 * This component represents a confirmation dialog for delete a book from Firestore database.
 * It provides a user interface to confirm or cancel a delete action.
 */
@Component({
  selector: 'lib-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ]
})
export class DeleteConfirmationDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<DeleteConfirmationDialogComponent>);

  public buttonConstants = BUTTONS;

  /**
   * Closes the dialog and signals the cancellation of the delete operation.
   */
  public onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Closes the dialog and confirms the delete operation.
   */
  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
