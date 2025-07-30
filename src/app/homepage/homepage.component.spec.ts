import { computed } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { HomepageComponent } from "./homepage.component";
import { Book } from "../shared/interfaces/book";
import { BooksService } from "../shared/services/books.service";

const mockBooks: Book[] = Array.from({ length: 10 }).map((_, i) => ({
    authors: [`Author ${i + 1}`],
    bookPlace: '1-1',
    id: i + 1,
    isLent: false,
    isRead: false,
    isbn: `${i + 1}-${i + 1}${i + 1}${i + 1}-${i + 1}${i + 1}`,
    genre: 'fiction',
    language: 'RU',
    libraryId: `fiction-${i + 1}`,
    publisher: 'Test publisher',
    title: `Book title ${i + 1}`,
    type: 'paperBook',
    year: '2023',
}));

describe('HomepageComponent', () => {
    let component: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomepageComponent],
            providers: [
                {
                    provide: BooksService, useValue: {
                        fetchBooks: jasmine.createSpy().and.returnValue(Promise.resolve()),
                        allBooks: computed(() => mockBooks)
                    }
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load last 10 added books', fakeAsync(() => {
        tick();

        expect(component['booksService'].fetchBooks).toHaveBeenCalledWith(10);
        expect(component.books()).toEqual(mockBooks);
    }));

});