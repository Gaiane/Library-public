import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';
import { BUTTONS } from '../../../shared/constants/common-constants';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteConfirmationDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have correct button constants', () => {
    expect(component.buttonConstants).toEqual(BUTTONS);
  });

  it('should close dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when onConfirm is called', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
