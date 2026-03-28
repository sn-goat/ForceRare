import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';
import { ContentService, NotreEquipeContent, FounderInfo } from '../../services/content.service';

@Component({
  selector: 'app-notre-equipe',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, PageHeroComponent, CtaBannerComponent],
  templateUrl: './notre-equipe.html',
  styleUrl: './notre-equipe.scss',
})
export class NotreEquipeComponent implements OnInit {
  private readonly imageService = inject(ImageService);
  private readonly content = inject(ContentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page: NotreEquipeContent = this.content.getNotreEquipe();
  readonly founders: FounderInfo[] = this.content.getFounders();
  readonly founderImages = signal<ImageAsset[]>([]);
  readonly teamImage = signal<ImageAsset | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('founder').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => this.founderImages.set(images),
      error: () => undefined,
    });
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        this.teamImage.set(images[3]);
      },
      error: () => undefined,
    });
  }

  getFounderImage(name: string): ImageAsset | undefined {
    const firstName = name.split(' ')[0].toLowerCase();
    return this.founderImages().find(
      (img) =>
        img.title.toLowerCase().includes(firstName) ||
        img.alt_text.toLowerCase().includes(firstName),
    );
  }
}
