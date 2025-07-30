import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, withComponentInputBinding } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        provideRouter([], withComponentInputBinding()),
        provideLocationMocks(),
        { provide: ActivatedRoute, useValue: {} },
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'Library-web' title`, () => {
    expect(component.title).toEqual('Library-web');
  });
});

