import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { SEARCH_INPUT } from '../../../../shared/constants/search-constants';

/**
 * SearchComponent
 * 
 * @description
 * Manages search functionality with navigation and query handling
 * 
 * @example
 * <lib-search></lib-search>
 * 
 * @todo
 * check 
 */
@Component({
  selector: 'lib-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  private router = inject(Router);

  protected searchQuery = signal('');

  public searchInputConstants = SEARCH_INPUT;

  /**
   * Handles search input changes
   * @param event - Input change event
   */
  public onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().slice(0, 100);
    this.searchQuery.set(query);
  }

  /**
   * Initiates search navigation based on the user's input.
   * 
   * @returns {void}
   */
  public search(): void {
    const query = this.searchQuery();

    if (!query) {
      console.warn('Empty search query');
      return;
    }

    this.router.navigate(['/suche'], {
      queryParams: {
        q: query
      },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Clears the current search query
   * 
   * @returns {void}
   */
  public clearSearch(): void {
    this.searchQuery.set('');
  }
}
