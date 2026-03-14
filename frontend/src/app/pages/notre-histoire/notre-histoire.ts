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
        const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
        const field = sorted.find(
          (img) =>
            img.title.toLowerCase().includes('football') ||
            img.title.toLowerCase().includes('terrain'),
        );
        if (field) {
          this.heroImage.set(field.url);
        }
        const team = sorted.find(
          (img) =>
            img.title.toLowerCase().includes('team') ||
            img.title.toLowerCase().includes('équipe'),
        );
        if (team) {
          this.storyImage.set(team);
        }
      },
    });

    this.imageService.getAll('hero').subscribe({
      next: (images: ImageAsset[]) => {
        const logo = [...images].sort((a, b) => a.display_order - b.display_order)[0];
        this.logoImage.set(logo);
      },
    });

    this.imageService.getAll('founder').subscribe({
      next: (images: ImageAsset[]) => {
        const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
        const cloe = sorted.filter((img) => {
          const normalized = this.normalizeText(img.title);
          return normalized.includes('cloe st-gelais') || normalized.includes('cloe st gelais');
        });
        this.cloeImages.set(cloe.slice(0, 2));
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
