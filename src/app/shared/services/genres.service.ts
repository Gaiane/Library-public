import { inject, Injectable, signal } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';

import { Genre } from '../interfaces/genre';

/**
 * Service responsible for managing genre-related operations in Firestore.
 * 
 * @class GenresService
 * @description Handles all interactions with Firestore related to genres.
 */
@Injectable({
  providedIn: 'root'
})
export class GenresService {

  private firestore = inject(Firestore);

  private genre = signal<Genre>({} as Genre);
  private genres = signal<Genre[]>([]);

  public allGenres = this.genres.asReadonly();
  public genreData = this.genre.asReadonly();

  private collectionName = "genres";

  /**
  * Updates genre data 
  * @param newData 
  */
  public updateGenreData(newData: Genre): void {
    this.genre.set(newData);
  }

  /**
   * Fetches all genres from Firestore
   * 
   * @returns {Promise<void>}
   */
  public async fetchGenres(): Promise<void> {
    try {
      if (!this.firestore) {
        throw new Error("Firestore is not initialized correctly.");
      }

      const genresQuery = query(collection(this.firestore, this.collectionName), orderBy('label'));

      const querySnapshot = await getDocs(genresQuery);

      const genres: Genre[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          label: data['label'],
          color: data['color'],
        };
      });

      this.genres.set(genres);
    } catch (error) {
      console.error('Error datafetching: ', error);
    }
  }

  /**
   * Adds a new genre to Firestore,
   * 
   * @param {Genre} data - genre object to be added.
   * @returns {Promise<void>} promise that resolves when the genre is successfully added.
   */
  public async addGenre(data: Genre): Promise<void> {
    await setDoc(doc(this.firestore, this.collectionName, data.id), data);
  }

  /**
   * Updates an existing genre document in Firestore.
   * 
   * @param {Partial<Genre>} data - partial genre object containing fields to update.
   * @param {string} genreId - ID of the genre to be updated.
   * @returns {Promise<void>} promise that resolves when the update is complete.
   */
  public async updateGenre(data: Partial<Genre>, genreId: string): Promise<void> {
    await updateDoc(doc(this.firestore, this.collectionName, genreId), {
      color: data.color,
      label: data.label
    });
  }

  /**
   * Fetches a specific genre from Firestore by its unique identifier.
   * 
   * @param {string} id - Document ID of the genre in Firestore.
   * @returns {Promise<any>} promise resolving to the genre object or undefined.
   */
  public async fetchGenreById(id: string): Promise<any> {

    let genre;

    const genreRef = doc(this.firestore, this.collectionName, id);
    const genreSnap = await getDoc(genreRef);

    if (genreSnap.exists()) {
      genre = {
        id: genreSnap.id,
        ...genreSnap.data()
      };
    } else {
      console.log("No such genre!");
    }

    return genre;
  }
}
