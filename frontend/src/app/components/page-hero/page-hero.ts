import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
})
export class PageHeroComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() backgroundImage?: string | null;
}
