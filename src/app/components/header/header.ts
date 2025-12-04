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

  lastScrollY = 0;
  lockHide = false;
  isHidden = false;
  isMenuOpen = false; // mobile menu toggle

  constructor() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  private handleScroll() {
    if (this.lockHide) return;

    const curr = window.scrollY;

    if (curr > this.lastScrollY && curr > 120) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }

    this.lastScrollY = curr;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  scrollTo(id: string) {
    const isMobile = window.innerWidth < 768;
    const offset = isMobile ? 20 : 50;   // smaller offset on mobile
    
    const el = document.getElementById(id);
    if (!el) return;

    // Close mobile menu if open
    this.closeMenu();

    this.lockHide = true;
    this.isHidden = false;

    const elementY = el.getBoundingClientRect().top + window.scrollY;
    const finalY = elementY - offset;

    window.scrollTo({ top: finalY, behavior: 'smooth' });

    // Unlock header hide after scroll finishes
    let lastY = window.scrollY;

    const checkDone = () => {
      const nowY = window.scrollY;

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
