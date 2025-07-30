import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BookCardComponent } from './book-card.component';
import { Book } from '../../interfaces/book';
import { BooksService } from '../../services/books.service';

const mockBook: Book = {
  authors: ['Author'],
  bookPlace: '1-1',
  id: 42,
  isbn: '123-456-789',
  isLent: false,
  isRead: false,
  genre: 'fiction',
  language: 'EN',
  libraryId: 'fiction-1-1-42',
  publisher: 'Publisher',
  title: 'Title',
  type: 'papierBook',
  year: '2020'
};

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  let booksServiceSpy: jasmine.SpyObj<BooksService>;

  beforeEach(async () => {

    booksServiceSpy = jasmine.createSpyObj('BooksService', ['updateBookStatus']);
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: BooksService, useValue: booksServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('book', mockBook);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle read status and call updateBookStatus', async () => {
    booksServiceSpy.updateBookStatus.and.resolveTo();

    expect(component.book().isRead).toBeFalse();

    await component.toggleReadStatus();

    expect(component.book().isRead).toBeTrue();
    expect(booksServiceSpy.updateBookStatus).toHaveBeenCalledWith(
      mockBook.id.toString(),
      'isRead',
      true
    );
  });
});
