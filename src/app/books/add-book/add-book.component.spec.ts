import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of } from "rxjs";

import { AddBookComponent } from "./add-book.component";
import { Genre } from "../../shared/interfaces/genre";
import { BooksService } from "../../shared/services/books.service";
import { GenresService } from "../../shared/services/genres.service";
import { RouteService } from "../../shared/services/route.service";


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

const mockBook = {
    authors: 'Author',
    bookPlace: '1-2',
    isbn: '1-1-1111-111',
    genre: 'fiction',
    language: 'RU',
    publisher: 'Test Publisher',
    serie: '',
    title: 'Test book',
    type: 'paperBook',
    year: '2020',
};

describe('AddBookComponent', () => {
    let component: AddBookComponent;
    let fixture: ComponentFixture<AddBookComponent>;

    let booksServiceSpy: jasmine.SpyObj<BooksService>;
    let genresServiceSpy: jasmine.SpyObj<GenresService>;
    let routeServiceSpy: jasmine.SpyObj<RouteService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        booksServiceSpy = jasmine.createSpyObj('BooksService', ['addBook', 'checkIsbnExists', 'fetchBooksSnapshot']);
        genresServiceSpy = jasmine.createSpyObj('GenresService', ['allGenres', 'fetchGenres']);
        routeServiceSpy = jasmine.createSpyObj('RouteService', ['getRouteData']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        await TestBed.configureTestingModule({
            imports: [AddBookComponent, ReactiveFormsModule],
            providers: [
                { provide: BooksService, useValue: booksServiceSpy },
                { provide: GenresService, useValue: genresServiceSpy },
                { provide: RouteService, useValue: routeServiceSpy },
                { provide: Router, useValue: routerSpy },
            ]
        }).compileComponents();

        routeServiceSpy.getRouteData.and.returnValue(of({ title: 'Add Book' }));
        genresServiceSpy.fetchGenres.and.returnValue(Promise.resolve());
        genresServiceSpy.allGenres.and.returnValue(mockGenres);
        booksServiceSpy.checkIsbnExists.and.returnValue(Promise.resolve(false));

        fixture = TestBed.createComponent(AddBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load title from rote data', () => {
        expect(routeServiceSpy.getRouteData).toHaveBeenCalled();
        expect(component.title).toBe('Add Book');
    });

    it('should load all genres on init', fakeAsync(() => {
        tick();

        expect(genresServiceSpy.fetchGenres).toHaveBeenCalled();
        expect(component.genres()).toEqual(mockGenres);
    }));

    it('should submit a valid form and navigate to new book page', fakeAsync(async () => {
        component.bookForm.setValue(mockBook);

        component.bookForm.controls.isbn.setErrors(null);
        booksServiceSpy.fetchBooksSnapshot.and.returnValue(Promise.resolve({ size: 10 }));
        booksServiceSpy.addBook.and.returnValue(Promise.resolve());
        routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

        await component.onSubmit();

        expect(booksServiceSpy.addBook).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/buecher/11');
    }));


});