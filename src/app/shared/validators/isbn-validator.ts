import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { from, map, of } from "rxjs";

import { BooksService } from "../services/books.service";

/**
 * Asynchronous ISBN validator to check if a given ISBN already exists in the database.
 *
 * @returns An AsyncValidatorFn to be used in reactive forms.
 */
export function isbnValidator(): AsyncValidatorFn {
    const booksService = inject(BooksService);
    return (control: AbstractControl) => {
        if (!control.value) return of(null);
        return from(booksService.checkIsbnExists(control.value)).pipe(
            map(exists => (exists ? { isbnExists: true } : null))
        );
    };
}