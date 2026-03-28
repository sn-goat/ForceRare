import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContentService, AboutPreviewContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-about-preview',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.scss',
})
export class AboutPreviewComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly about: AboutPreviewContent = this.content.getHome().about;
  readonly aboutImage = signal<ImageAsset | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        if (images.length > 0) {
          this.aboutImage.set(images[0]);
        }
      },
      error: () => undefined,
    });
  }
}
