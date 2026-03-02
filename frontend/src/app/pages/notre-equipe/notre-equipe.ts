import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';
import { ContentService, NotreEquipeContent, FounderInfo } from '../../services/content.service';

@Component({
  selector: 'app-notre-equipe',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './notre-equipe.html',
  styleUrl: './notre-equipe.scss',
})
export class NotreEquipeComponent implements OnInit {
  private readonly imageService = inject(ImageService);
  private readonly content = inject(ContentService);

  readonly page: NotreEquipeContent = this.content.getNotreEquipe();
  readonly founders: FounderInfo[] = this.content.getFounders();
  readonly founderImages = signal<ImageAsset[]>([]);
  readonly teamImage = signal<ImageAsset | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('founder').subscribe({
      next: (images: ImageAsset[]) => this.founderImages.set(images),
    });
    this.imageService.getAll('general').subscribe({
      next: (images: ImageAsset[]) => {
        const team = images.find(
          (img) =>
            img.title.toLowerCase().includes('team') ||
            img.title.toLowerCase().includes('équipe'),
        );
        if (team) {
          this.teamImage.set(team);
        }
      },
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
