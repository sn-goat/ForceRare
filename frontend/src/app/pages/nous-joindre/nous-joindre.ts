import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // ← AJOUTÉ

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
  private readonly http = inject(HttpClient);  // ← AJOUTÉ

  readonly page: NousJoindreContent = this.content.getNousJoindre();
  readonly footer = this.content.getFooter();
  readonly submitted = signal(false);
  readonly loading = signal(false);  // ← AJOUTÉ
  readonly error = signal<string | null>(null);  // ← AJOUTÉ
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

  // ↓ REMPLACE CETTE FONCTION COMPLÈTEMENT ↓
  onSubmit(): void {
    this.loading.set(true);
    this.error.set(null);

    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      message: `${this.formData.subject ? 'Sujet: ' + this.formData.subject + '\n\n' : ''}${this.formData.message}`
    };

    this.http.post('/api/contact/', payload).subscribe({
      next: () => {
        this.submitted.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur envoi email:', err);
        this.error.set('Une erreur est survenue. Veuillez réessayer plus tard.');
        this.loading.set(false);
      }
    });
  }
}
