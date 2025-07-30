import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { BookEditComponent } from './book-edit.component';
import { Genre } from '../../../shared/interfaces/genre';
import { BooksService } from '../../../shared/services/books.service';
import { DataService } from '../../../shared/services/data.service';
import { GenresService } from '../../../shared/services/genres.service';
import { RouteService } from '../../../shared/services/route.service';

const mockBook = {
  authors: ['Author One', 'Author Two'],
  bookPlace: '1-4',
  genre: 'finction',
  id: 42,
  isLent: false,
  isRead: false,
  isbn: '11-111-111',
  language: 'EN',
  libraryId: 'fiction-1-4-42',
  publisher: 'Publisher',
  serie: '',
  title: 'Test book',
  type: 'paperBook',
  year: '2020'
};

const mockBookUpdated = {
  authors: 'Updated Author',
  bookPlace: '1-4',
  genre: 'finction',
  isbn: '11-111-1113',
  language: 'DE',
  publisher: 'Publisher',
  serie: '',
  title: 'Updated Title',
  type: 'papierBook',
  year: '2022'
};

const mockGenres: Genre[] = [
  {
    id: 'fiction',
    label: 'Fiction',
    color: '#000000'
  },
  {
    id: 'non-fiction',
    label: 'Non-fiction',
    color: '#FFFFFF'
  }
];

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;

  let booksServiceSpy: jasmine.SpyObj<BooksService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let genresServiceSpy: jasmine.SpyObj<GenresService>;
  let routeServiceSpy: jasmine.SpyObj<RouteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    booksServiceSpy = jasmine.createSpyObj('BooksService', ['updateBook']);
    dataServiceSpy = jasmine.createSpyObj('DataService', [], { data$: of(mockBook) });
    genresServiceSpy = jasmine.createSpyObj('GenresService', ['fetchGenres', 'allGenres']);
    routeServiceSpy = jasmine.createSpyObj('RouteService', ['getRouteData']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [BookEditComponent],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: GenresService, useValue: genresServiceSpy },
        { provide: RouteService, useValue: routeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    routeServiceSpy.getRouteData.and.returnValue(of({ title: 'Edit Book' }));
    genresServiceSpy.fetchGenres.and.returnValue(Promise.resolve());
    genresServiceSpy.allGenres.and.returnValue(mockGenres);

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load title from rote data', () => {
    expect(routeServiceSpy.getRouteData).toHaveBeenCalled();
    expect(component.title).toBe('Edit Book');
  });

  it('should call updateBook and navigate on submit', fakeAsync(async () => {
    component.bookForm.setValue(mockBookUpdated);

    component.book.set(mockBook);
    booksServiceSpy.updateBook.and.returnValue(Promise.resolve());

    await component.onSubmit();
    tick();

    expect(booksServiceSpy.updateBook).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`/buecher/${mockBook.id}`);
  }));
});
