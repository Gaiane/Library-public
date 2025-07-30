import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SIDENAV_LINKS } from '../../../../shared/constants/side-navigation-constants';

/**
 * MainLayoutComponent
 * 
 * @description
 * Serves as the main layout structure for the application.
 * It includes a side navigation menu with link-items and a main content area.
 * 
 * @example
 * <lib-main-layout></lib-main-layout>
 */
@Component({
  selector: 'lib-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
  ]
})
export class MainLayoutComponent {

  // Array of navigation links to be displayed in the sidenav menu
  public sidenavLinks = SIDENAV_LINKS;

}
