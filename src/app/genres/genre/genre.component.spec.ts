import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

import { GenreComponent } from './genre.component';


describe('GenreComponent', () => {
  let component: GenreComponent;
  let fixture: ComponentFixture<GenreComponent>;

  const firestoreMock = {
    collection: jasmine.createSpy('collection')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Firestore, useValue: firestoreMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
