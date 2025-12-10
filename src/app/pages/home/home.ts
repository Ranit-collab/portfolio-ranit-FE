import { Component, signal } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Work } from '../../components/work/work';
import { TechStack } from "../../components/tech-stack/tech-stack";
import { Projects } from "../../components/projects/projects";
import { AiChat } from '../../components/ai-chat/ai-chat';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ActionBar } from '../../components/action-bar/action-bar';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Work, TechStack, Projects, AiChat, Header, Footer, ActionBar],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  isActionBarVisible = signal(true);

  handleActionBarClosed() {
    this.isActionBarVisible.set(false);
  }
}
