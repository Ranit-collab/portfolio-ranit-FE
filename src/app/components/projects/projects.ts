import {
  Component,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Modal } from '../modal/modal';

/**
 * Represents a single project displayed on the portfolio.
 */
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  imagePath: string;
  responsibilities: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, Modal],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements AfterViewInit, OnDestroy {
  
  /** Tracks whether the projects section is visible in the viewport. */
  isVisible = signal(false);

  /** Reference used for IntersectionObserver to detect when the component is scrolled into view. */
  @ViewChild('observeProject', { static: true }) observeProject!: ElementRef;

  /** IntersectionObserver instance for triggering entry animations. */
  private observer?: IntersectionObserver;

  /** Currently selected project for the modal. */
  selectedProject = signal<Project | null>(null);

  /**
   * Portfolio project list.
   * Each project contains metadata, tech stack, image, and responsibilities.
   */
  projects: Project[] = [
    {
      id: 1,
      title: 'AthenaHealth',
      category: 'Featured Project',
      description:
        'Athenahealth is a healthcare-technology company that provides a cloud-native platform to simplify and manage care for medical practices of all sizes.',
      tags: ['ReactJS', 'Javascript', 'Typescript', 'Jest', 'Jenkis', 'CI/CD', 'Drupal'],
      imagePath: '../../../assets/athena.png',
      responsibilities: [
        "Engineered and implemented a dynamic Drupal content rendering component utilizing Javascript and React featuring interactive UI animations to improve user experience while optimizing performance by refactoring stylus, reducing bundle size by 10%.",
        "Standardized coding practices and QA processes, implemented comprehensive Jest test coverage, streamlining error detection, and reducing production defects by 30%.",
        "Optimized Largest Contentful Paint (LCP) by 15% through strategic image lazy loading, preloading assets, CSS optimization and implementing code splitting to improve page speed and Core Web Vitals performance.",
        "Configured and monitored Jenkins CI/CD pipelines, ensuring reliable build automation, deployed and coordinated release management, and quick hotfix deployments for production environment."
      ]
    },
    {
      id: 2,
      title: 'Estimez',
      category: 'Featured Project',
      description:
        'Estimez focuses on estimating project budgets, creating dashboards, and managing resource-based planning.',
      tags: ['ReactJS', 'Javascript', 'TailwindCSS', 'RTK Query', 'Java 8', 'SpringBoot', 'Microservices', 'PostgreSQL'],
      imagePath: '../../../assets/estimez.png',
      responsibilities: [
        "Worked on a comprehensive project estimation tool using React, Javascript, Tailwind CSS and Java that allowed users to create, update and delete project estimates, improving accuracy by 20%.",
        "Implemented and integrated RESTful APIs and transitioned EstimEZ to a microservice architecture using gRPC for more efficient system communication.",
        "Built and deployed RESTful APIs using Python (FastAPI) and created UI for automated data quality validation workflows."
      ]
    },
    {
      id: 3,
      title: 'UOPX Transfer Path',
      category: 'Featured Project',
      description:
        'A mobile solution used by the University of Phoenix to manage and validate transfer credits from multiple institutions.',
      tags: ['React Native', 'TypeScript', 'Responsys', 'RTK Query', 'GlueStack', 'Java 8'],
      imagePath: '../../../assets/uopx.png',
      responsibilities: [
        "Worked on core modules in the microservices architecture using Spring Boot, implementing SAGA workflows using Netflix Conductor and REST API with reduced latency <= 100ms and Kafka.",
        "Delivered cross-platform mobile applications for iOS and Android using React Native, increasing development efficiency by 20%.",
        "Improved performance by 15% with optimized state management via Redux + RTK Query and integrated Responsys push notifications.",
        "Added Adobe Analytics tracking to improve feature insights and enhance user engagement by 20%."
      ]
    }
  ];

  constructor() {}

  /**
   * Opens the modal and displays details for the selected project.
   */
  openProjectModal(project: Project) {
    this.selectedProject.set(project);
  }

  /**
   * Closes the project modal.
   */
  closeProjectModal() {
    this.selectedProject.set(null);
  }

  /**
   * Initializes the IntersectionObserver to trigger animations
   * when the projects section scrolls into view.
   */
  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);

          // Stop observing after animation trigger
          this.observer?.unobserve(this.observeProject.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.observeProject.nativeElement);
  }

  /**
   * Disconnects the IntersectionObserver on component destruction
   * to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  /**
   * Redirects the user to GitHub in a new browser tab.
   */
  navigateToGithub() {
    window.open("https://github.com/Ranit-collab", "_blank");
  }
}
