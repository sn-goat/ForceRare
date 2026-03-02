import { Component, inject } from '@angular/core';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NotreHistoireContent } from '../../services/content.service';

@Component({
  selector: 'app-notre-histoire',
  standalone: true,
  imports: [PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './notre-histoire.html',
  styleUrl: './notre-histoire.scss',
})
export class NotreHistoireComponent {
  private readonly content = inject(ContentService);

  readonly donateUrl = this.content.donateUrl;
  readonly page: NotreHistoireContent = this.content.getNotreHistoire();
}
