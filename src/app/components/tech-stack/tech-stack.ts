import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  signal,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Represents a category grouping multiple related technologies.
 */
interface TechnologyCategory {
  name: string;
  technologies: Technology[];
}

/**
 * Represents an individual technology with display name and icon.
 */
interface Technology {
  name: string;
  iconPath: string;
}

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack.html',
  styleUrls: ['./tech-stack.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStack implements AfterViewInit, OnDestroy {
  
  /** IntersectionObserver used to trigger animations when section enters viewport. */
  private observer?: IntersectionObserver;

  /** Host element reference for visibility detection. */
  private el = inject(ElementRef);

  /** Flag indicating when the component is visible to the user. */
  isVisible = signal(false);

  /** Binds CSS class to the host element when in view for animation triggers. */
  @HostBinding('class.in-view')
  get inView() {
    return this.isVisible();
  }

  /**
   * The categorized list of technologies displayed in orbit animations and grouped UI.
   * Icons must be stored locally under assets/.
   */
  technologyCategories: TechnologyCategory[] = [
    {
      name: 'Frontend/Backend',
      technologies: [
        { name: 'React', iconPath: 'assets/react.svg' },
        { name: 'Javascript', iconPath: 'assets/javascript.svg' },
        { name: 'Typescript', iconPath: 'assets/typescript.svg' },
        { name: 'Python', iconPath: 'assets/python.svg' },
        { name: 'Java', iconPath: 'assets/java.svg' },
        { name: 'Spring Boot', iconPath: 'assets/springBoot.svg' },
        { name: 'PostgreSQL', iconPath: 'assets/postgresql.svg' },
        { name: 'Redux', iconPath: 'assets/redux.svg' },
        { name: 'Angular', iconPath: 'assets/angular.svg' },
        { name: 'ThreeJS', iconPath: 'assets/three.svg' },
        { name: 'CICD', iconPath: 'assets/ci-cd.svg' },
        { name: 'AI', iconPath: 'assets/ai.svg' },
        { name: 'Figma', iconPath: 'assets/figma.svg' },
      ],
    },
    {
      name: 'Design/AI',
      technologies: [
        { name: 'Adobe XD', iconPath: 'assets/adobexd.svg' },
        { name: 'Figma', iconPath: 'assets/figma.svg' },
        { name: 'Adobe Illustrator', iconPath: 'assets/illustrator.svg' },
        { name: 'Machine Learning/AI', iconPath: 'assets/ai.svg' },
        { name: 'Microservices', iconPath: 'assets/microservices.svg' },
        { name: 'MongoDB', iconPath: 'assets/mongodb.svg' },
      ],
    },
  ];

  /**
   * Initial subset of technologies shown before orbit rendering becomes active.
   */
  visibleTechnologies: Technology[] = this.allTechnologies.slice(0, 5);

  /**
   * Flattens categorized technology groups into one linear list.
   */
  get allTechnologies(): Technology[] {
    return this.technologyCategories.flatMap((cat) => cat.technologies);
  }

  /**
   * Computes dynamic orbit sizes based on screen width.
   * Returns CSS values used for animated orbit radiuses.
   */
  getOrbitSize(index: number): string {
    const isMobile = window.innerWidth <= 768;
    const base = isMobile ? 32 * 16 * 0.5 : 50 * 16 * 0.5; // base radius in px
    const step = isMobile ? 60 : 90;                      // orbit spacing
    return `${base + index * step}px`;
  }

  /**
   * Produces animation duration for each orbit layer.
   * Inner orbits rotate faster, outer ones more slowly.
   */
  getOrbitDuration(index: number): string {
    return `${20 + index * 4}s`;
  }

  constructor() {}

  /**
   * Lifecycle hook to initialize IntersectionObserver after the view is rendered.
   */
  ngAfterViewInit(): void {
    this.initObserver();
  }

  /**
   * Ensures IntersectionObserver is removed on component destroy
   * to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Configures and attaches an IntersectionObserver to detect when the component
   * enters the viewport and trigger animations.
   */
  private initObserver(): void {
    const options = { root: null, threshold: 0.2 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }
}
