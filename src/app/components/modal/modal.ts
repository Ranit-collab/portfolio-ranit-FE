import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Represents a single step in a role timeline.
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
 * Data structure for the timeline-style modal.
 * Used when showing roles or work experience progression.
 */
interface ProjectTimeline {
  id: number;
  title: string;
  description: string;
  iconSvgPath: string;
  timeline: TimelineStep[];
}

/**
 * Data structure for list-style modal.
 * Used when showing project responsibilities in bullet list form.
 */
interface ProjectList {
  id: number;
  title: string;
  description: string;
  responsibilities: string[];
}

/** Union type representing both supported modal content formats. */
type ProjectData = ProjectTimeline | ProjectList | null;

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  /**
   * Data to be displayed in the modal.
   * Accepts either timeline format or list format.
   */
  @Input({ required: true }) project!: ProjectData;

  /**
   * Determines the rendering pattern of the modal.
   * - 'timeline' → show multi-step roles
   * - 'list' → show bullet-point responsibilities
   */
  @Input() mode: 'timeline' | 'list' = 'timeline';

  /** Emits an event when the user closes the modal. */
  @Output() close = new EventEmitter<void>();

  /**
   * Prevents background scrolling while the modal is open.
   */
  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Restores background scrolling when the modal is destroyed.
   */
  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  /**
   * Handles modal close action.
   * Useful for both close button and backdrop click.
   */
  handleClose() {
    this.close.emit();
  }

  /**
   * Type guard → Identifies whether the provided data is a timeline structure.
   * This improves template type-safety.
   */
  isTimeline(project: ProjectData): project is ProjectTimeline {
    return (project as ProjectTimeline).timeline !== undefined;
  }

  /**
   * Type guard → Identifies whether the provided data is a list structure.
   */
  isList(project: ProjectData): project is ProjectList {
    return (project as ProjectList).responsibilities !== undefined;
  }
}
