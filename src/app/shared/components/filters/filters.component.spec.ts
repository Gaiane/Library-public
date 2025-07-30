import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  const firestoreMock = {
    collection: jasmine.createSpy('collection')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [

        { provide: Firestore, useValue: firestoreMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
