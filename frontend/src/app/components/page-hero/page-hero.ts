import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
})
export class PageHeroComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
