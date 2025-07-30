import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, orderBy, query, where } from '@angular/fire/firestore';

import { Book } from '../interfaces/book';

/**
 * SearchService
 * 
 * This service handles the logic of searching for books from Firestore based on a user's query. 
 * It supports searching across multiple fields: author, title, and publisher. 
 * The service executes multiple queries for these fields and returns a unique list of books matching the search query.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private firestore = inject(Firestore);

  private collectionName = "books";

  /**
     *  Fetches books from Firestore based on a search query, searching across multiple fields (author, title, publisher)
     * 
     * @param searchQuery - search query used to filter books by author, title, or publisher
     * @returns {Promise<Book[]>} - Promise that resolves to an array of unique `Book` objects matching the search query
    */
  public async fetchBooksBySearchQuery(searchQuery: string): Promise<Book[]> {
    const books: Book[] = [];

    try {
      if (!this.firestore) {
        throw new Error('Firestore is not initialized.');
      }

      const booksRef = collection(this.firestore, this.collectionName);

      const authorQuery = query(
        booksRef,
        where('authors', 'array-contains', searchQuery),
        orderBy('title')
      );

      const titleQuery = query(
        booksRef,
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff'),
        orderBy('title')
      );

      const publisherQuery = query(
        booksRef,
        where('publisher', '>=', searchQuery),
        where('publisher', '<=', searchQuery + '\uf8ff'),
        orderBy('title')
      );

      const [authorSnapshot, titleSnapshot, publisherSnapshot] = await Promise.all([
        getDocs(authorQuery),
        getDocs(titleQuery),
        getDocs(publisherQuery)
      ]);

      const allSnapshots = [authorSnapshot, titleSnapshot, publisherSnapshot];

      for (const snapshot of allSnapshots) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            books.push({
              id: Number(doc.id),
              ...(data as Omit<Book, 'id'>)
            });
          }
        });
      }

      const uniqueBooksMap = new Map<string, Book>();
      for (const book of books) {
        uniqueBooksMap.set(book.id.toString(), book);
      }
      
      return Array.from(uniqueBooksMap.values());

    } catch (error) {
      console.error('Error fetching books: ', error);
      return [];
    }
  }
}