
/** 
 * Defines the structure for a book.
 */
export interface Book {
    authors: string[];
    bookPlace: string;
    borrowerName?: string;
    genre: string;
    coverUrl?: string;
    dateOfLent?: Date;
    id: number;
    isbn?: string;
    isLent: boolean;
    isRead: boolean;
    language: string;
    libraryId: string;
    publisher: string;
    serie?: string;
    type: string;
    year: string;
    title: string;
}

/**
 * Represents a book type.
 */

export type BookTypeValue = 'ebook' | 'audioBook' | 'paperBook';

export interface BookType {
    icon: string;
    value: BookTypeValue;
    viewValue: string;
}
