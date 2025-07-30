import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatDividerModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                MainLayoutComponent,
                NoopAnimationsModule,
                RouterLinkActive,
                RouterLink,
                RouterOutlet
            ],
            providers: [
                {
                    provide: ActivatedRoute, useValue: {
                        data: {},
                        fragment: {},
                        params: {},
                        queryParams: {},
                        snapshot: {},
                        url: {},
                    },
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render sidenav links', fakeAsync(() => {
        tick();
        const sidenavItems = fixture.debugElement.queryAll(By.css('mat-nav-list a'));

        expect(sidenavItems.length).toBe(component.sidenavLinks.length);

        sidenavItems.forEach((item, index) => {
            const expectedLabel = component.sidenavLinks[index].label;
            const textContent = item.nativeElement.textContent.trim();

            expect(textContent).toContain(expectedLabel);
        });
    }));
});
