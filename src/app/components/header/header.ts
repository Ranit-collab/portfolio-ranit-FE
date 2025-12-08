import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  /** Tracks previous scroll position to detect scroll direction */
  lastScrollY = 0;

  /** Prevents auto-hide during smooth scrolling animations */
  lockHide = false;

  /** Toggles header visibility based on scroll direction */
  isHidden = false;

  /** Controls hamburger menu (mobile) */
  isMenuOpen = false;

  constructor() {
    // Attach scroll listener (passive for better performance)
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  /**
   * Handles auto-hide behavior when user scrolls down
   * and shows header when scrolling up.
   */
  private handleScroll() {
    if (this.lockHide) return;

    const curr = window.scrollY;

    // Hide on downward scroll after threshold
    if (curr > this.lastScrollY && curr > 120) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }

    this.lastScrollY = curr;
  }

  /** Toggles the mobile drawer menu */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** Ensures the mobile drawer is closed */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Smooth scrolls to a section while preventing header
   * from auto-hiding until scrolling has completed.
   */
  scrollTo(id: string) {
    const isMobile = window.innerWidth < 768;
    const offset = isMobile ? 20 : 50;

    const el = document.getElementById(id);
    if (!el) return;

    // Close the drawer before navigating
    this.closeMenu();

    // Disable auto-hide while scroll animation runs
    this.lockHide = true;
    this.isHidden = false;

    const elementY = el.getBoundingClientRect().top + window.scrollY;
    const finalY = elementY - offset;

    window.scrollTo({ top: finalY, behavior: 'smooth' });

    /**
     * Detect when scroll finishes by checking stability in scroll position.
     * This method avoids problems where scroll events continue firing briefly.
     */
    let lastY = window.scrollY;

    const checkDone = () => {
      const nowY = window.scrollY;

      // Consider scrolling complete when position stabilizes
      if (Math.abs(nowY - lastY) < 2) {
        setTimeout(() => (this.lockHide = false), 250);
      } else {
        lastY = nowY;
        requestAnimationFrame(checkDone);
      }
    };

    requestAnimationFrame(checkDone);
  }
}
