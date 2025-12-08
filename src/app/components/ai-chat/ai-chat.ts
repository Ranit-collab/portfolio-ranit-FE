import {
  Component,
  signal,
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

  /** IntersectionObserver instance used for entry animation */
  private observer?: IntersectionObserver;

  /** Host element reference */
  private el = inject(ElementRef);

  /** Controls fade-in animation when component enters viewport */
  isVisible = signal(false);

  /** Reference to the chat scroll container */
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  /** Chat message list */
  messages = signal<ChatMessage[]>([]);

  /** User input model */
  input = signal("");

  /** Indicates if backend response is in progress */
  isLoading = signal(false);

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  /**
   * Replaces keywords with clickable hyperlinks.
   * Used for AI responses.
   */
  formatMessage(text: string) {
    return text
      .replace(/GitHub/gi, `<a href="https://github.com/Ranit-collab" target="_blank">GitHub</a>`)
      .replace(/LinkedIn/gi, `<a href="https://www.linkedin.com/in/ranit-sen-33b510193/" target="_blank">LinkedIn</a>`)
      .replace(/contact me/gi, `<a href="mailto:ranitsen02@gmail.com">contact me</a>`);
  }

  /**
   * Initializes an IntersectionObserver to trigger
   * animation when the component becomes visible.
   */
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

  /**
   * Sends user's message to backend and updates UI.
   * Handles optimistic UI update and loading state.
   */
  sendMessage() {
    const question = this.input().trim();
    if (!question || this.isLoading()) return;

    // Append user message
    this.messages.update(msgs => [...msgs, { sender: 'user', text: question }]);
    this.input.set("");

    // Add temporary placeholder for AI response
    this.isLoading.set(true);
    this.messages.update(msgs => [...msgs, { sender: 'ai', text: "Thinking..." }]);

    // API call to FastAPI backend
    this.http.get(`https://ranit-rag-backend.onrender.com/ask?q=${encodeURIComponent(question)}`)
      .subscribe({
        next: (res: any) => {
          const answer = res.answer || "I'm not sure.";

          // Replace placeholder response with actual answer
          this.messages.update(msgs => {
            const updated = [...msgs];
            updated[updated.length - 1] = { sender: 'ai', text: answer };
            return updated;
          });

          this.isLoading.set(false);
        },
        error: () => {
          // Fallback message on API errors
          this.messages.update(msgs => [
            ...msgs,
            { sender: 'ai', text: "Something went wrong. Try again." }
          ]);
          this.isLoading.set(false);
        }
      });
  }
}
