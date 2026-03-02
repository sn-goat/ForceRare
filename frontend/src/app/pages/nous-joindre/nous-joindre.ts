import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { ContentService, NousJoindreContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-nous-joindre',
  standalone: true,
  imports: [FormsModule, PageHeroComponent, FaqComponent],
  templateUrl: './nous-joindre.html',
  styleUrl: './nous-joindre.scss',
})
export class NousJoindreComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);

  readonly page: NousJoindreContent = this.content.getNousJoindre();
  readonly footer = this.content.getFooter();
  readonly submitted = signal(false);
  readonly heroImage = signal<string | null>(null);

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images) => {
        const bg = images.find(
          (img) =>
            img.title.toLowerCase().includes('football') ||
            img.title.toLowerCase().includes('terrain'),
        );
        if (bg) {
          this.heroImage.set(bg.url);
        }
      },
    });
  }

  onSubmit(): void {
    // Build mailto link as a fallback until backend email endpoint is ready
    const subject = encodeURIComponent(this.formData.subject || 'Message depuis le site Force Rare');
    const body = encodeURIComponent(
      `Nom: ${this.formData.name}\nCourriel: ${this.formData.email}\n\n${this.formData.message}`,
    );
    window.open(`mailto:info@forcerare.ca?subject=${subject}&body=${body}`, '_self');
    this.submitted.set(true);
  }
}
