import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AddNewDialogComponent } from './add-new-dialog.component';
import { GenresService } from '../../shared/services/genres.service';

const mockGenre = {
  color: '#000000',
  id: 'fiction',
  label: 'Fiction'
};

describe('AddNewDialogComponent', () => {
  let component: AddNewDialogComponent;
  let fixture: ComponentFixture<AddNewDialogComponent>;

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddNewDialogComponent>>;
  let genresServiceSpy: jasmine.SpyObj<GenresService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    genresServiceSpy = jasmine.createSpyObj('GenresService', ['addGenre']);

    await TestBed.configureTestingModule({
      imports: [AddNewDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: GenresService, useValue: genresServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with false', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should NOT save data if form is invalid', () => {
    component.genreForm.setValue(mockGenre);
    component.genreForm.get('label')?.setValue('');

    component.save();

    expect(genresServiceSpy.addGenre).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should save data and close dialog if form is valid', fakeAsync(() => {
    component.genreForm.setValue(mockGenre);

    genresServiceSpy.addGenre.and.returnValue(Promise.resolve());

    component.save();
    tick();

    expect(genresServiceSpy.addGenre).toHaveBeenCalledWith(mockGenre);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockGenre);
  }));

  it('should close dialog with false', fakeAsync(() => {
    spyOn(console, 'error');
    component.genreForm.setValue(mockGenre);
    genresServiceSpy.addGenre.and.returnValue(Promise.reject('Error'));

    component.save();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error updating document: ', 'Error');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  }));
});
