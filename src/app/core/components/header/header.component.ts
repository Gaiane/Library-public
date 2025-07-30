import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchComponent } from './search/search.component';
import { HEADER } from '../../../shared/constants/common-constants';

/**
 * HeaderComponent
 * 
 * @description
 * Renders the application's header with logo and search functionality.
 * 
 * @example
 * <lib-header></lib-header>
 */
@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [RouterLink, SearchComponent]
})
export class HeaderComponent {

  public headerConstants = HEADER;
  public logoImageUrl = '/assets/images/logo.svg';
  public logoLink = '/';

}