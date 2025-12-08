import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  signal
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { concat, from, of, delay, concatMap, tap, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements AfterViewInit, OnDestroy {

  /** Stores the text currently shown by the typing animation */
  public currentText = '';

  /** Whether the hero section is visible in the viewport */
  public isVisible = signal(false);

  /** Role words used for the typing animation */
  private roles = ['Web Developer', 'Mobile Developer', 'FullStack Developer', 'AI Enthusiast'];

  /** Used to clean up subscriptions */
  private destroy$ = new Subject<void>();

  /** IntersectionObserver for viewport detection */
  private observer?: IntersectionObserver;

  /** Whether code is running in the browser (not SSR) */
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object,
    private host: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Waits for view initialization, then sets up an IntersectionObserver.
   * Typing animation begins only after the hero section becomes visible.
   */
  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.initVisibilityObserver();
  }

  /**
   * Initializes the IntersectionObserver to start animations lazily.
   */
  private initVisibilityObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          // Mark visible
          this.isVisible.set(true);

          // Start typing animation only once
          this.showRolesSequentially();

          // Stop observing after first trigger
          this.observer?.disconnect();
        }
      });
    }, { threshold: 0.3 });

    this.observer.observe(this.host.nativeElement);
  }

  /**
   * Calculates dynamic experience text based on start date.
   */
  getExperience(): string {
    const startDate = new Date(2023, 0, 31);
    const now = new Date();

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years ${months} months`;
  }

  /**
   * Sequential typing animation for each role word.
   */
  private showRolesSequentially() {
    from(this.roles)
      .pipe(
        concatMap((role, index) =>
          concat(
            // Type forward
            from(role.split('')).pipe(
              concatMap((_, i) =>
                of(role.substring(0, i + 1)).pipe(
                  delay(100),
                  tap(text => {
                    this.currentText = text;
                    this.cdr.detectChanges();
                  })
                )
              )
            ),

            // Pause after full word
            of(role).pipe(delay(1200)),

            // Erase (except last word)
            ...(index !== this.roles.length - 1
              ? [
                  from(role.split('')).pipe(
                    concatMap((_, i) =>
                      of(role.substring(0, role.length - i - 1)).pipe(
                        delay(50),
                        tap(text => {
                          this.currentText = text;
                          this.cdr.detectChanges();
                        })
                      )
                    )
                  ),
                ]
              : [])
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Cleanup
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }
}
