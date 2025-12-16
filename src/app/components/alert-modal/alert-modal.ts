import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  imports: [],
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.scss',
})
export class AlertModal {
  @Output() close = new EventEmitter<void>();

  handleClose() {
    this.close.emit();
  }

  previewResume() {
    fetch('/assets/Ranit_Resume.pdf')
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    })
    .catch(err => console.error('PDF failed to open:', err));
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = '/assets/Ranit_Resume.pdf';
    link.download = 'Ranit_Sen_Resume.pdf';
    link.click();
  }
}
