import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NotreMissionContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-notre-mission',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, PageHeroComponent, CtaBannerComponent],
  templateUrl: './notre-mission.html',
  styleUrl: './notre-mission.scss',
})
export class NotreMissionComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page: NotreMissionContent = this.content.getNotreMission();

  readonly heroImage = signal<string | null>(null);
  readonly missionImage = signal<ImageAsset | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        if (images.length > 0) {
          this.missionImage.set(images[5]);
          this.heroImage.set(images[3].url);
        }
      },
      error: () => undefined,
    });
  }
}
