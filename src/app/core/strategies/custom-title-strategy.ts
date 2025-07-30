import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {

  private readonly title = inject(Title);
  
  constructor() {
    super();
  }

  /**
   * Updates the document title when the router state changes.
   *
   * It calls the base `buildTitle` method to get the title configured from the route,
   * add a prefix "Bibliothek - ". 
   * If no title is provided from the route, it does not change the document title.
   *
   * @param routerState - current router state snapshot containing route data.
   */
  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title) {
      this.title.setTitle(`Bibliothek - ${title}`);
    }
  }
}
