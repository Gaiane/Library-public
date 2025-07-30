import { inject, Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, limit, orderBy, query, QueryConstraint, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { Book } from '../interfaces/book';
import { BooksFilters } from '../interfaces/filters';

/**
 * BooksService
 * 
 * This service handles the logic of searching for books from Firestore based on a user's query. 
 * It supports searching across multiple fields: author, title, and publisher. 
 * The service executes multiple queries for these fields and returns a unique list of books matching the search query.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private readonly firestore = inject(Firestore);

  private book = signal<Book>({} as Book);
  private books = signal<Book[]>([]);

  public allBooks = this.books.asReadonly();
  public bookData = this.book.asReadonly();

  private collectionName = "books";

  /**
   * Adds a new book to the database
   * 
   * @param data 
   */
  public async addBook(data: Partial<Book>, newBookId: string): Promise<void> {
    try {
      const bookRef = doc(this.firestore, this.collectionName, newBookId);
      await setDoc(bookRef, data, { merge: true });
      console.log(`Book with ID ${newBookId} added successfully`);
    } catch (error) {
      console.error('Error adding book:', error);
      throw new Error('Failed to add book to Firestore');
    }
  }

  /**
   * Checks whether a book with the given ISBN already exists in Firestore.
   * 
   * @param isbn - ISBN to check for uniqueness.
   * @returns Promise that resolves to `true` if a book with this ISBN exists, otherwise `false`.
  */
  public async checkIsbnExists(isbn: string): Promise<boolean> {
    const allBooks = collection(this.firestore, this.collectionName);
    const booksQuery = query(allBooks, where("isbn", "==", isbn), limit(1));
    const querySnapshot = await getDocs(booksQuery);
    return !querySnapshot.empty;
  }

  /**
   * @returns querySnapshot with all books
   */
  public async fetchBooksSnapshot(limitNumber: number): Promise<any> {
    const booksQuery = query(collection(this.firestore, this.collectionName), orderBy('id', 'desc'), limit(limitNumber));
    const querySnapshot = await getDocs(booksQuery);

    return querySnapshot;
  }

  /**
   * Fetches a limited number of books from Firestore.
   * 
   * @param limitNumber - maximum number of books to fetch from Firestore.
   */
  public async fetchBooks(limitNumber: number): Promise<void> {
    const books: any[] = [];

    try {
      if (!this.firestore) {
        throw new Error("Firestore is not initialized correctly.");
      }
      const querySnapshot = await this.fetchBooksSnapshot(limitNumber);

      querySnapshot.forEach((book: any) => {
        books.push({
          id: book.id,
          ...book.data()
        })
      });

      this.books.set(books);

    } catch (error) {
      console.error('Error datafetching: ', error);
    }
  }

  /**
   * Fetches a book document by its ID from Firestore.
   *
   * @param id - ID of the book
   * @returns {Promise<Book[]>} - Promise that resolves to the book data (including its ID), or undefined if not found
  */
  public async fetchBookById(id: string): Promise<any> {
    let book;

    const bookRef = doc(this.firestore, this.collectionName, id);
    const bookSnap = await getDoc(bookRef);

    if (bookSnap.exists()) {
      book = {
        id: bookSnap.id,
        ...bookSnap.data()
      };
    } else {
      console.log("No such book!");
    }

    return book;
  }

  /**
   * 
   * Fetches books by a specific field from Firestore 
   * 
   * @param field - field's name
   * @param value - field's value
   * @returns {Promise<Book[]>} - Promise that resolves to an array of unique `Book` objects matching the specific field and value in the database
   */
  public async fetchBooksByField(field: string, value: string): Promise<any> {
    const books: any[] = [];

    try {
      if (!this.firestore) {
        throw new Error("Firestore is not initialized correctly.");
      }
      const booksQuery = query(collection(this.firestore, this.collectionName), where(field, "==", value));
      const querySnapshot = await getDocs(booksQuery);

      querySnapshot.forEach((book) => {
        books.push({
          id: book.id,
          ...book.data()
        })
      });

      this.books.set(books);

    } catch (error) {
      console.error('Error datafetching: ', error);
    }
  }

  public async fetchBooksByQueryParams(params: Record<string, string | boolean>): Promise<void> {
    const booksRef = collection(this.firestore, 'books');
    const constraints: QueryConstraint[] = [];
    const books: any[] = [];


    for (const [key, value] of Object.entries(params)) {
      constraints.push(where(key, '==', value));
    }

    try {
      if (!this.firestore) {
        throw new Error("Firestore is not initialized correctly.");
      }

      const booksQuery = query(booksRef, ...constraints);
      const snapshot = await getDocs(booksQuery);

      snapshot.forEach(book => {
        books.push({
          id: book.id,
          ...book.data()
        });
      });

      this.books.set(books);

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  /**
   * 
   * Fetches all books by a specific author from Firestore 
   * 
   * @param author - author's name
   * @returns {Promise<Book[]>} - Promise that resolves to an array of unique `Book` objects matching the author's name
   */
  public async fetchBooksByAuthor(author: string): Promise<Book[]> {

    const books: any[] = [];

    try {
      if (!this.firestore) {
        throw new Error("Firestore is not initialized correctly.");
      }

      const booksRef = collection(this.firestore, this.collectionName);

      const authorQuery = query(
        booksRef,
        where('author', 'array-contains', author),
        orderBy('title')
      );

      const authorSnapshot = await getDocs(query(
        booksRef,
        where('authors', 'array-contains', author),
        orderBy('title')
      ));

      authorSnapshot.forEach((book) => {
        books.push({
          id: book.id,
          ...book.data(),
        });
      });

    } catch (error) {
      console.error('Error datafetching: ', error);
    }

    return books;
  }


  /**
   * Updates a book in Firestore
   * 
   * @param bookId - ID of the book to update
   * @returns - Promise that resolves when the update is complete
   */
  public async updateBook(bookId: string, bookData: any): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, this.collectionName, bookId), bookData);
    } catch (error) {
      console.error(`Error updating book ${bookId}:`, error);
      throw error;
    }
  }

  /**
     * Updates the 'isRead' or 'isLent' status of a book in Firestore
     * 
     * @param bookId - ID of the book to update
     * @param statusKey - statusKey in the document
     * @param status - new read/lent status of the book
     * @returns - Promise that resolves when the update is complete
     */
  public async updateBookStatus(bookId: string, statusKey: string, status: boolean): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, this.collectionName, bookId), {
        [statusKey]: status
      })
    } catch (error) {
      console.error(`Error updating book ${bookId} read status:`, error);
      throw error;
    }
  }

  /**
   * 
   * Deletes a book with specific ID form Firestore 
   * 
   * @param bookId - ID of the book
   */
  public deleteBook(bookId: string): void {
    try {
      deleteDoc(doc(this.firestore, this.collectionName, bookId));
    } catch (error) {
      console.error(`Error deleting book ${bookId}: `, error);
      throw error;
    }
  }

  /**
 * Check Funtions
 * 
 * @param filters 
 * 
 */
  public async getBooksFiltered(filters: BooksFilters): Promise<void> {
    const booksRef = collection(this.firestore, 'books');
    const constraints: QueryConstraint[] = [];
    const books: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (!value || value === 'ALL') continue;

      if (typeof value === 'string' && key === 'sortBy') {
        const [sortField, sortDir = 'asc'] = value.split('_');
        constraints.push(orderBy(sortField, sortDir as 'asc' | 'desc'));
      } else {
        constraints.push(where(key, '==', value));
      }
    }

    const booksQuery = query(booksRef, ...constraints);
    const snapshot = await getDocs(booksQuery);

    snapshot.forEach(doc => {
      books.push({
        id: doc.id,
        ...doc.data()
      });
    });
    this.books.set(books);
  }
}