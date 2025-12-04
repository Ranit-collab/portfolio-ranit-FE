import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  inject,
  signal,
  HostBinding
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';

interface TimelineStep {
  role: string;
  type: string;
  duration: string;
  location: string;
  skills: string[];
  description: string;
}

interface WorkItem {
  id: number;
  title: string;
  description: string;
  iconSvgPath: string;
  timeline: TimelineStep[];
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, Modal],
  templateUrl: './work.html',
  styleUrls: ['./work.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Work implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private el = inject(ElementRef);

  isVisible = signal(false);

  @HostBinding('class.in-view')
  get inView() {
    return this.isVisible();
  }

  @ViewChildren('cardEl') cardElements!: QueryList<ElementRef>;
  @ViewChild('moreEl') moreElement!: ElementRef;
  @ViewChild('headingEl') headingElement!: ElementRef;

  workItems: WorkItem[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      description: 'Take your client onboard seamlessly by our amazing tool of digital process process.',
      iconSvgPath: 'assets/sse.svg',
      timeline: [
        {
          role: 'Senior Software Engineer',
          type: 'Full-time',
          duration: 'Aug 2025 – Present · 4 mos',
          location: 'Chennai, India · Hybrid',
          skills: ['React.js', 'TypeScript', '+8 skills'],
          description: 'Led frontend architecture for enterprise-level onboarding systems.'
        },
        {
          role: 'Software Analyst',
          type: 'Full-time',
          duration: 'May 2023 – Jul 2025 · 2 yrs 3 mos',
          location: 'Chennai, India · Hybrid',
          skills: ['React Native', 'React.js', '+8 skills'],
          description: 'Developed cross-platform mobile experiences.'
        },
        {
          role: 'Intern',
          type: 'Internship',
          duration: 'Jan 2023 – May 2023 · 5 mos',
          location: 'Chennai, India · On-site',
          skills: ['React.js', 'Java', '+1 skill'],
          description: 'Full-stack training and hands-on backend exposure.'
        },

      ]
    }
  ];

  selectedWork = signal<WorkItem | null>(null);

  openModal(item: WorkItem) {
    this.selectedWork.set(item);
  }

  closeModal() {
    this.selectedWork.set(null);
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initObserver(): void {
    const options = { root: null, threshold: 0.2 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.animateCards();
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateCards(): void {

    if (this.headingElement) {
      this.headingElement.nativeElement.classList.add('card-slide-up');
    }

    const cards = this.cardElements.toArray();

    cards.forEach((card, index) => {
      setTimeout(() => card.nativeElement.classList.add('card-slide-up'), index * 150);
    });

    if (this.moreElement) {
      this.moreElement.nativeElement.classList.add('card-slide-up');
    }
  }

  navigateToWork(itemId: number) {
    const item = this.workItems.find(w => w.id === itemId);
    if (item) this.openModal(item);
  }

  navigateToLinkedin() {
    window.open("https://www.linkedin.com/in/ranit-sen-33b510193/", "_blank");
  }
}
