import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-donate-fab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './donate-fab.html',
  styleUrl: './donate-fab.scss',
})
export class DonateFabComponent {}
