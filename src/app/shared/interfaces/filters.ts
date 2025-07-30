/** 
 * Defines a filter or soring selector.
 */
export interface FilterSelectConfig {
    ariaLabel?: string;
    key: string;
    label: string;
    options: SelectOption[];
    value?: string;
}

/**
 * Selector options for filter or sorting.
 */
export interface SelectOption {
    value: boolean | string;
    viewValue: string;
}

/**
 * Represents a filter used when querying or displaying a list of books.
 */
export interface BooksFilters {
    genre?: string;
    isLent?: boolean;
    isRead?: boolean;
    language?: string;
    sortBy?: string;
    type?: string;
}