import { Component } from '@angular/core';

import { HeaderComponent } from './core/components/header/header.component';
import { MainLayoutComponent } from './core/components/layouts/main-layout/main-layout.component';


@Component({
  selector: 'lib-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    HeaderComponent,
    MainLayoutComponent
  ]
})
export class AppComponent {
  title = 'Library-web';
}
