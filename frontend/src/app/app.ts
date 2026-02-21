import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ImageGalleryComponent } from './components/image-gallery/image-gallery';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageGalleryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ForceRare');
}
