import { Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';
import { ContentService, FounderInfo } from '../../services/content.service';

@Component({
  selector: 'app-team-section',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './team-section.html',
  styleUrl: './team-section.scss',
})
export class TeamSectionComponent implements OnInit {
  private readonly imageService = inject(ImageService);
  private readonly content = inject(ContentService);

  readonly founderImages = signal<ImageAsset[]>([]);
  readonly founders: FounderInfo[] = this.content.getFounders();

  ngOnInit(): void {
    this.imageService.getAll('founder').subscribe({
      next: (images: ImageAsset[]) => {
        this.founderImages.set(images);
      },
    });
  }

  getFounderImage(name: string): ImageAsset | undefined {
    const images = this.founderImages();
    const firstName = name.split(' ')[0].toLowerCase();
    return images.find(img =>
      img.title.toLowerCase().includes(firstName) ||
      img.alt_text.toLowerCase().includes(firstName)
    );
  }
}
