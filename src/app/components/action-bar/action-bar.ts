import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-bar.html',
  styleUrls: ['./action-bar.scss'],
})
export class ActionBar {
  isVisible = signal(true);

  @Output() close = new EventEmitter<void>();

  handleClose() {
    this.isVisible.set(false);
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  scrollToRag() {
    const el = document.getElementById("rag-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
