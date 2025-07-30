import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { EditGenreDialogComponent } from './edit-genre-dialog/edit-genre-dialog.component';
import { GenreCardComponent } from './genre-card.component';
import { GenresService } from '../../services/genres.service';

const mockGenre = {
  color: '#000000',
  id: 'fiction',
  label: 'Fiction'
};

const mockGenreUpdatedData = {
  color: '#000000',
  label: 'Updated '
};

describe('GenreCardComponent', () => {
  let component: GenreCardComponent;
  let fixture: ComponentFixture<GenreCardComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let genresServiceSpy: jasmine.SpyObj<GenresService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    genresServiceSpy = jasmine.createSpyObj('GenresService', ['updateGenreData']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [
        GenreCardComponent
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: GenresService, useValue: genresServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenreCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('genre', mockGenre);
    fixture.detectChanges();

    spyOn(component.genreUpdated, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to updated genre details page', () => {
    component.navigateToRoute();

    expect(genresServiceSpy.updateGenreData).toHaveBeenCalledWith(mockGenre);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/genres/', 'fiction']);
  });

  it('should open the dialog with genre data', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined)
    } as any);

    component.showEditGenreDialog();

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(EditGenreDialogComponent, {
      data: mockGenre
    });
  });

  it('should emit updated genre data after saving data and dialog is closed', () => {
    const updatedGenre = {
      ...mockGenre,
      color: mockGenreUpdatedData.color,
      label: mockGenreUpdatedData.label
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(updatedGenre)
    } as any);

    component.showEditGenreDialog();

    expect(component.genreUpdated.emit).toHaveBeenCalledWith(updatedGenre);
  });

  it('should not emit updated genre if dialog is closed without saving', () => {
    const original = { ...component.genre() };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined)
    } as any);

    component.showEditGenreDialog();

    expect(component.genreUpdated.emit).not.toHaveBeenCalled();
  });
});