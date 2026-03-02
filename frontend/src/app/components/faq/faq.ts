import { Component, inject, signal } from '@angular/core';

import { ContentService, FaqItem } from '../../services/content.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqComponent {
  private readonly content = inject(ContentService);

  readonly items: FaqItem[] = this.content.getFaq();
  readonly heading = 'Foire aux questions';
  readonly openIndex = signal<number | null>(null);

  toggle(index: number): void {
    this.openIndex.update((v) => (v === index ? null : index));
  }
}
