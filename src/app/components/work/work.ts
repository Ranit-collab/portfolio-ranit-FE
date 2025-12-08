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

/**
 * Represents an individual step/position in a work timeline item.
 */
interface TimelineStep {
  role: string;
  type: string;
  duration: string;
  location: string;
  skills: string[];
  description: string;
}

/**
 * Represents a work item containing a series of timeline experiences.
 */
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

  /** IntersectionObserver used to detect when the Work section enters the viewport. */
  private observer?: IntersectionObserver;

  /** Host element reference for scroll/visibility detection. */
  private el = inject(ElementRef);

  /** Visibility state used to trigger animations. */
  isVisible = signal(false);

  /** Adds "in-view" class to the host when section is visible. */
  @HostBinding('class.in-view')
  get inView() {
    return this.isVisible();
  }

  /** Element references for staggered card animations. */
  @ViewChildren('cardEl') cardElements!: QueryList<ElementRef>;
  @ViewChild('moreEl') moreElement!: ElementRef;
  @ViewChild('headingEl') headingElement!: ElementRef;

  /**
   * Work timeline data to be rendered in the UI.
   * Each work item expands into a modal on click.
   */
  workItems: WorkItem[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      description: 'Jan 2023 - Present · Chennai, India',
      iconSvgPath: 'assets/sse.svg',
      timeline: [
        {
          role: 'Senior Software Engineer',
          type: 'Full-time',
          duration: 'Aug 2025 – Present · 4 mos',
          location: 'Chennai, India · Hybrid',
          skills: ['React.js', 'TypeScript', 'JavaScript', 'React Native', 'Stylus', 'TailwindCSS', 'Jest', 'Enzyme', 'Java 8', 'Spring Boot', 'Microservices', 'JUnit', 'HTML/CSS', 'Python 3', 'Drupal'],
          description: 'Engineered dynamic, high-performance content rendering components, improving user experience and reducing bundle size by 10%. Standardized development and QA processes with enhanced Jest test coverage, cutting production defects by 30%. Improved page performance and Core Web Vitals through LCP optimization, asset preloading, lazy loading, and code splitting. Managed Jenkins CI/CD pipelines, ensuring reliable builds, smooth releases, and rapid hotfix deployments.'
        },
        {
          role: 'Software Analyst',
          type: 'Full-time',
          duration: 'May 2023 – Jul 2025 · 2 yrs 3 mos',
          location: 'Chennai, India · Hybrid',
          skills: ['React.js', 'TypeScript', 'JavaScript', 'React Native', 'TailwindCSS', 'Jest', 'Enzyme', 'Java 8', 'Spring Boot', 'Microservices', 'JUnit', 'HTML/CSS', 'Python 3', 'Drupal'],
          description: 'Contributed to building a scalable project estimation platform using React, JavaScript, Tailwind CSS, and Java, improving estimation accuracy and workflow efficiency. Designed and integrated RESTful and third-party APIs and supported the transition to a gRPC-based microservices architecture, enhancing system performance. Developed backend validation pipelines with FastAPI along with a UI for automated data-quality checks. Additionally, Delivered high-performance React Native applications using reusable components and optimized state management, while integrating Responsys and Adobe Analytics to improve user engagement and feature adoption.'
        },
        {
          role: 'Intern',
          type: 'Internship',
          duration: 'Jan 2023 – May 2023 · 5 mos',
          location: 'Chennai, India · On-site',
          skills: ['React.js', 'Java', 'JavaScript', 'HTML/CSS'],
          description: 'Completed comprehensive full-stack training program. This involved mastering a range of front-end and back-end technologies. Throughout this experience, I developed five projects demonstrating my expertise in HTML and CSS, DOM manipulation and REST APIs, ReactJS, Java, and Spring.'
        },
      ]
    }
  ];

  /** Currently selected work item for modal display. */
  selectedWork = signal<WorkItem | null>(null);

  /**
   * Opens modal with full timeline details.
   */
  openModal(item: WorkItem) {
    this.selectedWork.set(item);
  }

  /**
   * Closes the active modal.
   */
  closeModal() {
    this.selectedWork.set(null);
  }

  /**
   * Lifecycle hook to initialize scroll visibility logic.
   */
  ngAfterViewInit(): void {
    this.initObserver();
  }

  /**
   * Cleanup to prevent memory leaks when component is destroyed.
   */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Sets up the IntersectionObserver to trigger animations
   * when the work section enters 20% of the viewport.
   */
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

  /**
   * Animates heading, cards, and "more" elements with staggered motion
   * when the user scrolls into the section.
   */
  private animateCards(): void {

    // Animate heading first
    if (this.headingElement) {
      this.headingElement.nativeElement.classList.add('card-slide-up');
    }

    // Animate each card with delay
    const cards = this.cardElements.toArray();
    cards.forEach((card, index) => {
      setTimeout(() => card.nativeElement.classList.add('card-slide-up'), index * 150);
    });

    // Animate "More" section at the end
    if (this.moreElement) {
      this.moreElement.nativeElement.classList.add('card-slide-up');
    }
  }

  /**
   * Opens modal for a specific work item by its ID.
   * Used by click handlers in the template.
   */
  navigateToWork(itemId: number) {
    const item = this.workItems.find(w => w.id === itemId);
    if (item) this.openModal(item);
  }

  /**
   * Opens LinkedIn profile in a new tab.
   */
  navigateToLinkedin() {
    window.open("https://www.linkedin.com/in/ranit-sen-33b510193/", "_blank");
  }
}
