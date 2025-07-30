import { TestBed } from '@angular/core/testing';
import { Firestore } from 'firebase/firestore';

import { FiltersService } from './filters.service';
import { GenresService } from './genres.service';
import { Genre } from '../interfaces/genre';

const mockGenres: Genre[] = [
  {
    id: 'fiction',
    label: 'Fiction',
    color: '#000000'
  },
  {
    id: 'non-fiction',
    label: 'Non-fiction',
    color: '#FFFFFF'
  }
];

describe('FiltersService', () => {
  let filterService: FiltersService;
  let genresServiceSpy: jasmine.SpyObj<GenresService>;

  const firestoreMock = {
    collection: jasmine.createSpy('collection')
  };

  beforeEach(() => {

    genresServiceSpy = jasmine.createSpyObj('GenresService', ['allGenres', 'fetchGenres']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: firestoreMock },
        { provide: GenresService, useValue: genresServiceSpy },
      ]
    });

    genresServiceSpy.fetchGenres.and.returnValue(Promise.resolve());
    genresServiceSpy.allGenres.and.returnValue(mockGenres);

    filterService = TestBed.inject(FiltersService);

  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });
});
