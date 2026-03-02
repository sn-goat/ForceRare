import { Component, inject } from '@angular/core';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { ContentService, FaireUnDonContent } from '../../services/content.service';

@Component({
  selector: 'app-faire-un-don',
  standalone: true,
  imports: [PageHeroComponent, FaqComponent],
  templateUrl: './faire-un-don.html',
  styleUrl: './faire-un-don.scss',
})
export class FaireUnDonComponent {
  private readonly content = inject(ContentService);

  readonly donateUrl = this.content.donateUrl;
  readonly page: FaireUnDonContent = this.content.getFaireUnDon();
}
