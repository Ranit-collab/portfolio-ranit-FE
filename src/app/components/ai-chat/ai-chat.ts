import {
  Component,
  signal,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ai-chat.html',
  styleUrls: ['./ai-chat.scss']
})
export class AiChat implements AfterViewInit, OnDestroy {

  private observer?: IntersectionObserver;
  private el = inject(ElementRef);

  isVisible = signal(false);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages = signal<ChatMessage[]>([]);
  input = signal("");
  isLoading = signal(false);

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // ⭐ Add this inside the component
  formatMessage(text: string) {
    return text
      .replace(/GitHub/gi, `<a href="https://github.com/Ranit-collab" target="_blank">GitHub</a>`)
      .replace(/LinkedIn/gi, `<a href="https://www.linkedin.com/in/ranit-sen-33b510193/" target="_blank">LinkedIn</a>`)
      .replace(/contact me/gi, `<a href="mailto:ranitsen02@gmail.com">contact me</a>`);
  }

  private initObserver() {
    const options = { root: null, threshold: 0.2 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.chatContainer.nativeElement.classList.add('chat--visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  sendMessage() {
    const question = this.input().trim();
    if (!question || this.isLoading()) return;

    this.messages.update(msgs => [...msgs, { sender: 'user', text: question }]);
    this.input.set("");
    this.isLoading.set(true);

    this.messages.update(msgs => [...msgs, { sender: 'ai', text: "Thinking..." }]);

    this.http.get(`http://127.0.0.1:8000/ask?q=${encodeURIComponent(question)}`)
      .subscribe({
        next: (res: any) => {
          const answer = res.answer || "I'm not sure.";

          this.messages.update(msgs => {
            const updated = [...msgs];
            updated[updated.length - 1] = { sender: 'ai', text: answer };
            return updated;
          });

          this.isLoading.set(false);
        },
        error: () => {
          this.messages.update(msgs => [
            ...msgs,
            { sender: 'ai', text: "Something went wrong. Try again." }
          ]);
          this.isLoading.set(false);
        }
      });
  }
}
