import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { BookCardComponent } from "../../shared/components/book-card/book-card.component";
import { SEARCH_RESULTS } from '../../shared/constants/search-constants';
import { Book } from '../../shared/interfaces/book';
import { SearchService } from '../../shared/services/search.service';

/**
 * SearchResultsComponent
 * 
 * @description
 * Component responsible for displaying search results.
 * Uses the Search for fetching specific books by searchQuery.
 * 
 * @example 
 * <lib-search-results></lib-search-results>
*/
@Component({
  selector: 'lib-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  standalone: true,
  imports: [BookCardComponent]
})
export class SearchResultsComponent {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);

  public query = toSignal(this.activatedRoute.queryParams.pipe(
    map(params => params['q'] || '')
  ));

  public searchResults = signal<Book[]>([]);

  public searchResultsConstants = SEARCH_RESULTS;

  constructor() {
    effect(() => {
      this.search(this.query());
    });
  }

  /**
   * Computes the title for the search results section.
   * Updates automatically when searchResults or query changes.
   * 
   * @returns {string} - string representing the search results title
   */
  public get title(): string {
    const results = this.searchResults();
    const query = this.query();

    const noResultsTitle = this.searchResultsConstants.NO_SEARCH_RESULTS_TITLE(query);
    const searchResultsTitle = this.searchResultsConstants.SEARCH_RESULT_TITLE(results.length, query);

    return results.length > 0
      ? searchResultsTitle
      : noResultsTitle;
  }

  /**
     * Executes a search for books based on the provided query.
     * 
     * @param query - search query string entered by the user.
     * @returns {Promise<void>} - promise that resolves when the search operation completes.
     */
  private async search(query: string): Promise<void> {
    if (query) {
      this.searchResults.set(await this.searchService.fetchBooksBySearchQuery(query));
    } else {
      this.searchResults.set([]);
    }
  }

}
