import { Component, inject, OnInit, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NosPartenairesContent, PartnerInfo } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-nos-partenaires',
  standalone: true,
  imports: [LowerCasePipe, PageHeroComponent, CtaBannerComponent],
  templateUrl: './nos-partenaires.html',
  styleUrl: './nos-partenaires.scss',
})
export class NosPartenairesComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);

  readonly page: NosPartenairesContent = this.content.getNosPartenaires();
  readonly partners: PartnerInfo[] = this.content.getPartners();

  readonly heroImage = signal<string | null>(null);
  readonly partnerImages = signal<ImageAsset[]>([]);

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images) => {
        const bg = images.find(
          (img) =>
            img.title.toLowerCase().includes('team') ||
            img.title.toLowerCase().includes('équipe'),
        );
        if (bg) {
          this.heroImage.set(bg.url);
        }
      },
    });

    this.imageService.getAll('partner').subscribe({
      next: (images: ImageAsset[]) => {
        this.partnerImages.set(images);
      },
    });
  }

  getPartnerImage(partner: PartnerInfo): ImageAsset | undefined {
    const titleMap: Record<string, string> = {
      RQMO: 'logo rqmo',
      'Fonds Mille-Pattes': 'logo fdmp',
      CHUL: 'logo chul',
    };

    const expected = titleMap[partner.name];
    if (!expected) {
      return undefined;
    }

    return this.partnerImages().find(
      (img) => this.normalizeText(img.title) === expected,
    );
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }
}
