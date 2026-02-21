import { Component, inject, OnInit, signal } from '@angular/core';

import { ImageAsset } from '../../models/image-asset';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.scss',
})
export class ImageGalleryComponent implements OnInit {
  private readonly imageService = inject(ImageService);

  readonly images = signal<ImageAsset[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.imageService.getAll().subscribe({
      next: (data) => {
        this.images.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load images', err);
        this.error.set('Could not load images.');
        this.loading.set(false);
      },
    });
  }
}
