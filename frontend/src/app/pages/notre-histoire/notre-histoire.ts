import { Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NotreHistoireContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-notre-histoire',
  standalone: true,
  imports: [NgOptimizedImage, PageHeroComponent, FaqComponent, CtaBannerComponent],
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

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images: ImageAsset[]) => {
        // Use football/field image for hero background
        const field = images.find(
          (img) =>
            img.title.toLowerCase().includes('football') ||
            img.title.toLowerCase().includes('terrain'),
        );
        if (field) {
          this.heroImage.set(field.url);
        }
        // Use team image for inline story illustration
        const team = images.find(
          (img) =>
            img.title.toLowerCase().includes('team') ||
            img.title.toLowerCase().includes('équipe'),
        );
        if (team) {
          this.storyImage.set(team);
        }
      },
    });
  }
}
