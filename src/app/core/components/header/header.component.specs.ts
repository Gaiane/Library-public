import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from './header.component';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default logo image URL', () => {
    expect(component.logoImageUrl).toBe('/assets/images/logo.svg');
  });

  it('should have default root link', () => {
    expect(component.logoLink).toBe('/');
  });

  it('should have the correct logo image URL', () => {
    const logoImage = fixture.nativeElement.querySelector('img');

    expect(logoImage).toBeTruthy();
    expect(logoImage.src).toContain(component.logoImageUrl);
    expect(logoImage.alt).toBe('Bibliothekslogo');
  });

  it('should have the correct logo link', () => {
    const logoLink = fixture.nativeElement.querySelector('a');

    expect(logoLink).toBeTruthy();
  });

});
