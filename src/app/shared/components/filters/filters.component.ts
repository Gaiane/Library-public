import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BOOK_FILTER_SORTING } from '../../constants/book-constants';
import { BUTTONS, COMMON_STRINGS } from '../../constants/common-constants';
import { FilterSelectConfig } from '../../interfaces/filters';

/**
 * FiltersComponent
 * 
 * @description
 * Component responsible for filter books
 * Uses the GenresService to retrieve available genres.
 * 
 * @example
 * <lib-filters [filtersSelects]="filterSelectConfigs"
 *              [sortingSelect]="sortSelectConfigs"
 *              (valueChanged)="onValueChanged($event)">
 * </lib-filters>
 */
@Component({
  selector: 'lib-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  standalone: true,
  imports: [
    MatButton,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class FiltersComponent {

  @Input() filtersSelects: FilterSelectConfig[] = [];
  @Input() sortingSelect?: FilterSelectConfig;

  @Output() valueChanged = new EventEmitter<{ key: string; value: string }>();

  public commonConstants = COMMON_STRINGS;
  public buttonConstants = BUTTONS;

  public get booksFilterSortingConstants() {
    return BOOK_FILTER_SORTING;
  }

  public hasActiveSelection(): boolean {
    const hasFilterSelected = this.filtersSelects.some(
      (select) => {
        select.value && select.value !== '';
      }
    );

    const hasSortingSelected = this.sortingSelect &&
      this.sortingSelect.value &&
      this.sortingSelect.value !== '';


    return hasFilterSelected || !!hasSortingSelected;
  }

  public resetFilters(): void {
    this.filtersSelects.forEach(select => {
      this.onSelectionChange(select.key, '');
    });

    if (this.sortingSelect) {
      this.onSelectionChange(this.sortingSelect.key, this.sortingSelect.value ?? '');
    }
  }

  public onSelectionChange(key: string, value: string) {
    const cleanValue = value === 'all' || value === '' ? '' : value;
    this.valueChanged.emit({ key, value });
  }

}
