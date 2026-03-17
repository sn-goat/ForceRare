import { Component, inject, OnInit, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-evenements',
  standalone: true,
  imports: [CommonModule, PageHeroComponent, CtaBannerComponent],
  templateUrl: './evenements.html',
  styleUrl: './evenements.scss',
})
export class EvenementsComponent implements OnInit {
  private readonly eventService = inject(EventService);

  @ViewChild('stripRef') stripRef!: ElementRef<HTMLDivElement>;

  readonly events = signal<Event[]>([]);
  readonly popupEvent = signal<Event | null>(null);
  readonly currentMonth = signal(new Date());

  readonly upcomingEvents = computed(() => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.events()
      .filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  readonly calendarDays = computed(() => {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  });

  readonly monthLabel = computed(() =>
    this.currentMonth().toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })
  );

  ngOnInit(): void {
    this.eventService.getAll().subscribe({
      next: (events) => this.events.set(events),
    });
  }

  getEventsForDay(day: number): Event[] {
    const date = this.currentMonth();
    return this.events().filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === day;
    });
  }

  openPopup(event: Event): void {
    this.popupEvent.set(event);
  }

  closePopup(): void {
    this.popupEvent.set(null);
  }

  prevMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  scrollStrip(): void {
    this.stripRef.nativeElement.scrollBy({ left: 280, behavior: 'smooth' });
  }
}
