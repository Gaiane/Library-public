import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AddNewDialogComponent } from './add-new-dialog/add-new-dialog.component';
import { GenresComponent } from './genres.component';
import { Genre } from '../shared/interfaces/genre';
import { GenresService } from '../shared/services/genres.service';

const mockGenres: Genre[] = [
  {
    color: '#000000',
    id: 'fiction',
    label: 'Fiction'
  },
  {
    color: '#FFFFFF',
    id: 'drama',
    label: 'Drama'
  },
];

const mockUpdatedGenre: Genre = {
  color: '#EEEEEE',
  id: 'fiction',
  label: 'Updated fiction'
};

const mockNewGenre: Genre = {
  color: '#00FF00',
  id: 'medicine',
  label: 'Medicine'
};

describe('GenresComponent', () => {
  let component: GenresComponent;
  let fixture: ComponentFixture<GenresComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddNewDialogComponent>>;
  let genresServiceSpy: jasmine.SpyObj<GenresService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    genresServiceSpy = jasmine.createSpyObj('GenresService', ['allGenres', 'fetchGenres']);

    await TestBed.configureTestingModule({
      imports: [GenresComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ title: 'All Genres' }) } },
        { provide: GenresService, useValue: genresServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    }).compileComponents();

    genresServiceSpy.fetchGenres.and.returnValue(Promise.resolve());
    genresServiceSpy.allGenres.and.returnValue(mockGenres);

    fixture = TestBed.createComponent(GenresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should load all genres on init', fakeAsync(() => {
    tick();

    expect(genresServiceSpy.fetchGenres).toHaveBeenCalled();
    expect(component.genres()).toEqual(mockGenres);
  }));


  it('should update genre in genres list', () => {
    component.genres.set(mockGenres);



    component.onGenreUpdated(mockUpdatedGenre);

    const updated = component.genres().find(genre => genre.id === 'fiction');

    expect(updated?.label).toBe('Updated fiction');
    expect(updated?.color).toBe('#EEEEEE');
  });


  it('should open dialog and reload genres if new is added', fakeAsync(() => {
    dialogRefSpy.afterClosed.and.returnValue(of(mockNewGenre));

    dialogSpy.open.and.returnValue(dialogRefSpy);

    genresServiceSpy.fetchGenres.and.returnValue(Promise.resolve());

    genresServiceSpy.allGenres.and.returnValue([
      ...mockGenres,
      mockNewGenre
    ]);

    component.showAddGenreDialog();
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(AddNewDialogComponent);
    expect(genresServiceSpy.fetchGenres).toHaveBeenCalled();
    expect(component.genres()).toContain(mockNewGenre);
  }));

});