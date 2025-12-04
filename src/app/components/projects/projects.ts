import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Modal } from '../modal/modal';

// Interface for Project data
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
  selector: 'app-projects', // Changed to app-root
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, Modal], // Added NgOptimizedImage
  templateUrl: './projects.html', // Updated path
  styleUrl: './projects.scss', // Updated path
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements AfterViewInit, OnDestroy { // Renamed class to App
  // Use signal for visibility
  isVisible = signal(false);

  // Inject ElementRef
  // private elementRef = inject(ElementRef);
  @ViewChild('observeProject', { static: true }) observeProject!: ElementRef;
  private observer?: IntersectionObserver;
  selectedProject = signal<Project | null>(null);

  // Mock data for the projects
  projects: Project[] = [
    {
      id: 1,
      title: 'AthenaHealth',
      category: 'Featured Project',
      description: 'A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.',
      tags: ['ReactJS', 'Javascript', 'Typescript', 'Jest', 'Jenkis', 'CI/CD', 'Drupal'],
      imagePath: '../../../assets/athena.png',
      responsibilities: ["Engineered and implemented a dynamic Drupal content rendering component utilizing Javascript and React featuring interactive UI animations to improve user experience while optimizing performance by refactoring stylus, reducing bundle size by 10%.", "Standardized coding practices and QA processes, implemented comprehensive Jest test coverage, streamlining error detection, and reducing production defects by 30%.",
        "Optimized Largest Contentful Paint (LCP) by 15% through strategic image lazy loading, preloading assets, CSS optimization and implementing code splitting to improve page speed and Core Web Vitals performance.",
        "Configured and monitored Jenkins CI/CD pipelines, ensuring reliable build automation, deployed and coordinated release management, and quick hotfix deployments for production environment."]
    },
    {
      id: 2,
      title: 'Estimez',
      category: 'Featured Project',
      description: 'A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.',
      tags: ['ReactJS', 'Javascript', 'Java 8', 'SpringBoot', 'Microservices', 'PostgreSQL'],
      imagePath: '../../../assets/estimez.png',
      responsibilities: ["Worked on a comprehensive project estimation tool using React, Javascript, Tailwind CSS and Java that allowed users to create, update and delete project estimates for various practices such as Salesforce, Java, and Drupal, with resource planning, budgeting and deal desk analysis, improving the accuracy of project cost estimation by 20%.",
        "Implemented and integrated RESTful APIs and third-party APIs, transitioned the EstimEZ platform to a microservice architecture using the gRPC framework to improve flexibility, streamline communication between multiple servers and clients, and increase platform efficiency by 15%.",
        "Built and deployed RESTful APIs using Python (FastAPI) to connect the frontend with backend validation pipelines, and developed a data validation UI, enabling automated data quality checks.",]
    },
    {
      id: 3,
      title: 'UOPX Transfer Path',
      category: 'Featured Project',
      description: 'A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.',
      tags: ['React Native', 'TypeScript', 'Responsys', 'RTK Query'],
      imagePath: '../../../assets/uopx.png',
      responsibilities: ["Delivered cross-platform mobile applications for iOS and Android using React Native and Typescript, achieving a 20% increase in development efficiency by building reusable UI components and hooks and implementing a consistent design system throughout the project.",
        "Improved app performance by 15% through advanced code optimization and efficient state management using Redux and RTK Query, while successfully integrating APIs, including responsys for push notifications, to improve user functionality.",
        "Integrated Adobe Analytics into the website, allowing detailed tracking of user behavior, which increased feature engagement by 20% and optimized advertising and customer targeting strategies.",]
    },
  ];

  constructor() { }

  openProjectModal(project: Project) {
    this.selectedProject.set(project);
  }

  closeProjectModal() {
    this.selectedProject.set(null);
  }

  ngAfterViewInit(): void {
    // Set up the IntersectionObserver
    const options = {
      root: null, // relative to viewport
      rootMargin: '0px',
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          // We can unobserve once it's visible to stop checking
          if (this.observer) {
            this.observer.unobserve(this.observeProject.nativeElement);
          }
        }
      });
    }, options);

    // Start observing the component's host element
    this.observer.observe(this.observeProject.nativeElement);
  }

  ngOnDestroy(): void {
    // Clean up the observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Helper to determine animation direction
  getAnimationClass(index: number): string {
    return index % 2 === 0 ? 'slide-in-right' : 'slide-in-left';
  }

  navigateToGithub() {
    window.open("https://github.com/Ranit-collab", "_blank");
  }
}