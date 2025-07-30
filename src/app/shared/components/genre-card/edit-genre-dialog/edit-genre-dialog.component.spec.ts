import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EditGenreDialogComponent } from './edit-genre-dialog.component';
import { GenresService } from '../../../services/genres.service';

const mockGenre = {
  color: '#000000',
  id: 'fiction',
  label: 'Fiction'
};

const mockGenreUpdatedData = {
  color: '#FFFFFF',
  label: 'Update Fiction'
};

describe('EditGenreDialogComponent', () => {
  let component: EditGenreDialogComponent;
  let fixture: ComponentFixture<EditGenreDialogComponent>;

  let genresServiceSpy: jasmine.SpyObj<GenresService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditGenreDialogComponent>>;

  beforeEach(async () => {

    genresServiceSpy = jasmine.createSpyObj('GenresService', ['updateGenre']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [EditGenreDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: GenresService, useValue: genresServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockGenre }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditGenreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with injected data', () => {
    expect(component.genreForm.value).toEqual({
      color: mockGenre.color,
      label: mockGenre.label
    });
  });

  it('should close the dialog with false when cancel is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should call updateGenre and close the dialog with updated data when form is valid', async () => {
    const updatedGenre = {
      id: mockGenre.id,
      color: mockGenreUpdatedData.color,
      label: mockGenreUpdatedData.label
    };

    genresServiceSpy.updateGenre.and.returnValue(Promise.resolve());

    component.genreForm.setValue(mockGenreUpdatedData);

    await component.save();

    expect(genresServiceSpy.updateGenre).toHaveBeenCalledWith(
      mockGenreUpdatedData,
      mockGenre.id,
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(updatedGenre);
  });
});
