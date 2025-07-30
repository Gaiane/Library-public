import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  const firestoreMock = {
    collection: jasmine.createSpy('collection')
  };

  const activatedRouteMock = {
    queryParams: of({ query: 'test' })
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Firestore, useValue: firestoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
