import { Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { VideoShowcaseComponent } from '../../components/video-showcase/video-showcase';
import { ContentService, NotreHistoireContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-notre-histoire',
  standalone: true,
  imports: [NgOptimizedImage, PageHeroComponent, CtaBannerComponent, VideoShowcaseComponent],
  templateUrl: './notre-histoire.html',
  styleUrl: './notre-histoire.scss',
})
export class NotreHistoireComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);

  readonly donateUrl = this.content.donateUrl;
  readonly page: NotreHistoireContent = this.content.getNotreHistoire();

  readonly heroImage = signal<string | null>(null);
  readonly storyImage = signal<ImageAsset | null>(null);
  readonly logoImage = signal<ImageAsset | null>(null);
  readonly cloeImages = signal<ImageAsset[]>([]);

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images: ImageAsset[]) => {
        const field = images[3];
        if (field) {
          this.heroImage.set(field.url);
        }
        const team = images[5]
        if (team) {
          this.storyImage.set(team);
        }
      },
    });

      this.imageService.getAll('hero').subscribe({
      next: (images) => {
              if (images.length > 0) {
                this.logoImage.set(images[0]);
              }
            },
    });

    this.imageService.getAll('founder').subscribe({
      next: (images: ImageAsset[]) => {
        const cloe0 = images[4]; const cloe1 = images[5];
        this.cloeImages.set([cloe0,cloe1]);
      },
    });
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }
}
