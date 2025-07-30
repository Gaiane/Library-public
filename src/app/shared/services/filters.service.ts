import { inject, Injectable, signal } from '@angular/core';

import { GenresService } from './genres.service';
import { BOOK_FILTER_SORTING } from '../constants/book-constants';
import { BookType } from '../interfaces/book';
import { FilterSelectConfig, SelectOption } from '../interfaces/filters';
import { Genre } from '../interfaces/genre';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private readonly genresService = inject(GenresService);

  private genres = signal<Genre[]>([]);


  private bookFilterSortingConstants = BOOK_FILTER_SORTING;


  /**
   * Loads all genres from Firestore
   */
  public async loadGenres(): Promise<void> {
    await this.genresService.fetchGenres();
    this.genres.set(this.genresService.allGenres());
  }

  /**
  * Returns select config objects for filter dropdowns
  * 
  * @param bookTypes - list of available book types
  * @param languages - list of language options
  * @param constants - labels and default values
  * @returns Array of filter select configurations
  */
  public getBooksFilterSelectConfig(bookTypes: BookType[], languages: SelectOption[], booksStatuses: any, contants?: any): FilterSelectConfig[] {

    const genreOptions: SelectOption[] = this.genres().map((genre) => ({
      value: genre.id,
      viewValue: genre.label,
    }));

    const lentStatusOptions: SelectOption[] = booksStatuses.isLent.map((item: SelectOption) => ({
      value: item.value,
      viewValue: item.viewValue,
    }));

    const readStatusOptions: SelectOption[] = booksStatuses.isRead.map((item: SelectOption) => ({
      value: item.value,
      viewValue: item.viewValue,
    }));

    const typeOptions: SelectOption[] = bookTypes.map((type) => ({
      value: type.value,
      viewValue: type.viewValue
    }));

    const filterSelectConfigs = [
      {
        ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.GENRE,
        key: 'genre',
        label: contants.GENRE,
        options: genreOptions,
        value: contants.ALL
      },
      {
        ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.LANGUAGE,
        key: 'language',
        label: contants.LANGUAGE,
        options: languages,
        value: contants.ALL
      },
      {
        ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.TYPE,
        key: 'type',
        label: contants.TYPE,
        options: typeOptions,
        value: contants.ALL
      },
      {
        ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.LENT,
        key: 'isLent',
        label: contants.LENT,
        options: lentStatusOptions,
        value: contants.ALL
      },
      {
        ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.READ,
        key: 'isRead',
        label: contants.READ,
        options: readStatusOptions,
        value: contants.ALL
      }
    ];

    return filterSelectConfigs;
  }

  /**
   * Returns the configuration object for a sorting dropdown/select component.
   * 
   * @param sortingOptions - an array of sorting options.
   * @param constants - Constants object that contains label strings.
   * @returns FilterSelectConfig object that defines how the sorting select should be rendered.
   */
  public getSortingConfig(sortingOptions: SelectOption[], constants: any): FilterSelectConfig {
    return {
      ariaLabel: this.bookFilterSortingConstants.ARIA_LABELS.SORTING,
      key: 'sortBy',
      label: constants.SORTING,
      options: sortingOptions
    };
  }
}
