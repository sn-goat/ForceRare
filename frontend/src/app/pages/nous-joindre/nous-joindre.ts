import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { ContentService, NousJoindreContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-nous-joindre',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, FaqComponent],
  templateUrl: './nous-joindre.html',
  styleUrl: './nous-joindre.scss',
})
export class NousJoindreComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly page: NousJoindreContent = this.content.getNousJoindre();
  readonly footer = this.content.getFooter();
  readonly submitted = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly heroImage = signal<string | null>(null);
  readonly showCustomSubject = signal(false);

  readonly maxName = 100;
  readonly maxEmail = 254;
  readonly maxCustomSubject = 100;
  readonly maxMessage = 5000;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.maxName)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(this.maxEmail)]],
    subject: ['', [Validators.required]],
    customSubject: [''],
    message: ['', [Validators.required, Validators.maxLength(this.maxMessage)]],
  });

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

    this.form.get('subject')!.valueChanges.subscribe((value) => {
      const isAutre = value === 'Autre';
      this.showCustomSubject.set(isAutre);
      const ctrl = this.form.get('customSubject')!;
      if (isAutre) {
        ctrl.setValidators([Validators.required, Validators.maxLength(this.maxCustomSubject)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue('');
      }
      ctrl.updateValueAndValidity();
    });
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { name, email, subject, customSubject, message } = this.form.value;

    this.http.post<{ detail?: string; errors?: Record<string, string> }>('/api/contact/', {
      name, email, subject, customSubject, message,
    }).subscribe({
      next: () => {
        this.submitted.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          const serverErrors = err.error.errors as Record<string, string>;
          for (const [field, msg] of Object.entries(serverErrors)) {
            const ctrl = this.form.get(field);
            if (ctrl) {
              ctrl.setErrors({ server: msg });
            }
          }
        } else {
          this.error.set('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
        this.loading.set(false);
      },
    });
  }
}
