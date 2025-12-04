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

interface TechnologyCategory {
  name: string;
  technologies: Technology[];
}

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
  private observer?: IntersectionObserver;
  private el = inject(ElementRef);
  isVisible = signal(false);

  @HostBinding('class.in-view') get inView() {
    return this.isVisible();
  }

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
        { name: 'MongoDB', iconPath: 'assets/mongo.svg' },
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

  visibleTechnologies: Technology[] = this.allTechnologies.slice(0, 5);

  get allTechnologies(): Technology[] {
    return this.technologyCategories.flatMap((cat) => cat.technologies);
  }

  // Keep CommonModule import and component metadata as before

  // Use container width to compute sizes (we return CSS strings)
  getOrbitSize(index: number): string {
    const isMobile = window.innerWidth <= 768; // you can adjust breakpoint

    // Use smaller base for mobile
    const base = isMobile ? 32 * 16 * 0.5 : 50 * 16 * 0.5; // 32rem for mobile, 40rem for desktop
    const step = isMobile ? 60 : 90; // smaller gap between orbits for mobile

    return `${base + index * step}px`;
  }

  getOrbitDuration(index: number): string {
    return `${20 + index * 4}s`;
  }


  constructor() { }

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
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, options);
    this.observer.observe(this.el.nativeElement);
  }
}
