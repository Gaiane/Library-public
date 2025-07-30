import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Retrieves the route data from the most deeply nested active route
   * 
   * @returns Observable of route data
   */
  public getRouteData(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.findLeafRouteData())
    );
  }

  /**
   * Finds the data of the most deeply nested active route
   * 
   * @returns The route data object from the active leaf route
   */
  private findLeafRouteData() {
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot.data;
  }
}
