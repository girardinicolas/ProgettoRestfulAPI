import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

interface FavoriteCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly visibleCount = 3;
  private readonly cardWidth = 360;
  private readonly cardGap = 24;
  private readonly transitionDuration = 600;

  readonly favorites = signal<FavoriteCard[]>([
    {
      id: 'salmon-sensation',
      title: 'Salmon Sensation',
      description: 'Salmone fresco, avocado, edamame, riso e salsa teriyaki.',
      image: '/salmon-sensation.png',
    },
    {
      id: 'tuna-tropicana',
      title: 'Tuna Tropicana',
      description:
        'Tonno pinna gialla, mango, alghe wakame, riso venere e salsa ponzu.',
      image: '/tuna-tropicana.png',
    },
    {
      id: 'vegan-delight',
      title: 'Vegan Delight',
      description:
        'Tofu marinato, carote, cetrioli, mais, quinoa e salsa di zenzero.',
      image: '/vegan-delight.png',
    },
    {
      id: 'chicken-special',
      title: 'Chicken Special',
      description: 'Riso, pollo, cipolla, avocado, pomodorini, mais, sesamo.',
      image: '/chickenspecial.png',
    },
  ]);

  readonly currentIndex = signal(0);

  readonly carouselItems = computed(() => {
    const cards = this.favorites();
    if (!cards.length) {
      return [] as FavoriteCard[];
    }
    const count = Math.min(this.visibleCount, cards.length);
    return [...cards, ...cards.slice(0, count)];
  });

  readonly canScroll = computed(
    () => this.favorites().length > this.visibleCount
  );

  readonly trackTransform = computed(() => {
    const translate = this.currentIndex() * (this.cardWidth + this.cardGap);
    return `translateX(-${translate}px)`;
  });

  readonly activeIndicator = computed(() => {
    const total = this.favorites().length;
    if (!total) {
      return 0;
    }
    return this.currentIndex() % total;
  });

  readonly isTransitionEnabled = signal(true);

  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.startAutoScroll();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.stopAutoScroll();
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/create-poke']);
  }

  scrollRight(): void {
    if (!this.isBrowser) {
      return;
    }
    const total = this.favorites().length;
    if (!total || !this.canScroll()) {
      return;
    }

    this.isTransitionEnabled.set(true);
    this.currentIndex.update((index) => index + 1);

    if (this.currentIndex() === total) {
      this.clearResetTimeout();
      this.resetTimeoutId = setTimeout(() => {
        this.isTransitionEnabled.set(false);
        this.currentIndex.set(0);
        setTimeout(() => {
          if (this.isBrowser) {
            this.isTransitionEnabled.set(true);
          }
        });
        this.clearResetTimeout();
      }, this.transitionDuration);
    }
  }

  private startAutoScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    if (this.carouselIntervalId !== null || !this.canScroll()) {
      return;
    }
    this.carouselIntervalId = setInterval(() => {
      this.scrollRight();
    }, 4000);
  }

  private stopAutoScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
      this.carouselIntervalId = null;
    }
    this.clearResetTimeout();
  }

  private clearResetTimeout(): void {
    if (!this.isBrowser) {
      return;
    }
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
  }
}
