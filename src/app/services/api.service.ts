import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class apiService {
    githubData = signal<any>(null);
    linkedinJobs = signal<any>(null);
    aiAnswer = signal<string>("");

    constructor(private http: HttpClient) { }

    fetchGithub() {
        this.http.get("http://127.0.0.1:8000/sync/github?username=Ranit-collab")
            .subscribe({
                next: (res: any) => this.githubData.set(res.github_data),
                error: (err) => console.error("GitHub API error:", err)
            });
    }

    fetchLinkedIn() {
        this.http.get("http://127.0.0.1:8000/sync/linkedin")
            .subscribe({
                next: (res: any) => this.linkedinJobs.set(res.linkedin_jobs),
                error: (err) => console.error("LinkedIn API error:", err)
            });
    }


    askAI(question: string) {
        this.http.get("http://127.0.0.1:8000/ask?q=" + question)
            .subscribe((res: any) => this.aiAnswer.set(res.answer));
    }
}
