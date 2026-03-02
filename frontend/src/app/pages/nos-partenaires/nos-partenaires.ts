import { Component, inject } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NosPartenairesContent, PartnerInfo } from '../../services/content.service';

@Component({
  selector: 'app-nos-partenaires',
  standalone: true,
  imports: [LowerCasePipe, PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './nos-partenaires.html',
  styleUrl: './nos-partenaires.scss',
})
export class NosPartenairesComponent {
  private readonly content = inject(ContentService);

  readonly page: NosPartenairesContent = this.content.getNosPartenaires();
  readonly partners: PartnerInfo[] = this.content.getPartners();
}
