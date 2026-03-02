import { Component, inject, OnInit, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NosPartenairesContent, PartnerInfo } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-nos-partenaires',
  standalone: true,
  imports: [LowerCasePipe, PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './nos-partenaires.html',
  styleUrl: './nos-partenaires.scss',
})
export class NosPartenairesComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);

  readonly page: NosPartenairesContent = this.content.getNosPartenaires();
  readonly partners: PartnerInfo[] = this.content.getPartners();

  readonly heroImage = signal<string | null>(null);

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
  }
}
