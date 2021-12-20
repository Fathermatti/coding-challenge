import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export class Article {
  hash: string;
  content: any;

  constructor(hash: string, content: any) {
    this.hash = hash;
    this.content = content;
  }
}

export class ScheduledJob {
  id: string;
  lastRun: Date;
  minutes: number;

  constructor(minuntes: number) {
    this.id = uuid();
    this.lastRun = new Date();
    this.minutes = minuntes;
  }
}

@Injectable()
export class AppService {
  articles: { [key: string]: Article };
  schedules: { [key: string]: ScheduledJob };

  constructor() {
    this.articles = {};
    this.schedules = {};
  }

  addArticle(article: Article) {
    this.articles[article.hash] = article;
  }

  getArticles(): Article[] {
    const articles = [];
    for (const key in this.articles) {
      articles.push(this.articles[key]);
    }
    return articles;
  }

  createJob(): string {
    const job = new ScheduledJob(5);
    this.schedules[job.id] = job;
    return job.id;
  }

  removeJob(id: string) {
    delete this.schedules[id];
  }

  getDueJobs(): ScheduledJob[] {
    const due = [];

    for (const key in this.schedules) {
      const schedule = this.schedules[key];

      const now = new Date();
      const last = schedule.lastRun;
      const nextRun = new Date(last);
      nextRun.setMinutes(last.getMinutes() + schedule.minutes);

      if (nextRun < now) {
        this.schedules[key].lastRun = now;
        due.push(schedule);
      }
    }
    return due;
  }
}
