import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
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
  public currentText = '';
  private roles = ['Web Developer', 'Mobile Developer', 'FullStack Developer', 'AI Enthusiast'];
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    // Detect if this code is running in the browser or on the server
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }
    this.showRolesSequentially();
  }

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
            // Wait before erase or finish
            of(role).pipe(delay(1500)),
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
      .subscribe({
        complete: () => console.log('✅ Typing completed'),
      });
  }


  ngOnDestroy() {
    console.log('🧹 cleanup');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
