import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { DonateFabComponent } from './layout/donate-fab/donate-fab';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, DonateFabComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
