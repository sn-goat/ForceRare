import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly donateUrl = this.content.donateUrl;
  readonly page: NotreHistoireContent = this.content.getNotreHistoire();

  readonly heroImage = signal<string | null>(null);
  readonly storyImage = signal<ImageAsset | null>(null);
  readonly logoImage = signal<ImageAsset | null>(null);
  readonly cloeImage = signal<ImageAsset | null>(null);
  readonly websiteImage = signal<ImageAsset | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
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
      error: () => undefined,
    });

    this.imageService.getAll('hero').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images) => {
        if (images.length > 0) {
          this.logoImage.set(images[0]);
        }
      },
      error: () => undefined,
    });

    this.imageService.getAll('founder').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        const cloe = images[4];
        this.cloeImage.set(cloe);
      },
      error: () => undefined,
    });

    this.imageService.getAll('about').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        const img = images[0];
        if (img) {
          this.websiteImage.set(img);
        }
      },
      error: () => undefined,
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
