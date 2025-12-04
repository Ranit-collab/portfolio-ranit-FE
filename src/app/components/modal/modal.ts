import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineStep {
  role: string;
  type: string;
  duration: string;
  location: string;
  skills: string[];
  description: string;
}

interface ProjectTimeline {
  id: number;
  title: string;
  description: string;
  iconSvgPath: string;
  timeline: TimelineStep[];
}

interface ProjectList {
  id: number;
  title: string;
  description: string;
  responsibilities: string[];
}

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
  @Input({ required: true }) project!: ProjectData;

  // NEW → controls which layout to show
  @Input() mode: 'timeline' | 'list' = 'timeline';

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  handleClose() {
    this.close.emit();
  }

  // Type guard → helps template know what’s available
  isTimeline(project: ProjectData): project is ProjectTimeline {
    return (project as ProjectTimeline).timeline !== undefined;
  }

  isList(project: ProjectData): project is ProjectList {
    return (project as ProjectList).responsibilities !== undefined;
  }
}
