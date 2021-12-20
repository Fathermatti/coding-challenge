import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { Article, AppService, ScheduledJob } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { Cron, Interval } from '@nestjs/schedule';

class Trigger {}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('WORKER') private client: ClientProxy,
  ) {}

  @Get('/')
  getArticles(): Article[] {
    return this.appService.getArticles();
  }

  @Post('/jobs')
  startJobSchedule() {
    const jobId = this.appService.createJob();
    this.client.emit('job_triggered', new Trigger());
    return jobId;
  }

  @Delete('/jobs/:id')
  removeJobSchedule(@Param('id') id: string) {
    this.appService.removeJob(id);
  }

  @EventPattern('article_fetched')
  handleArticleFetched(article: Article) {
    this.appService.addArticle(article);
  }

  @Interval(60000)
  handleRunJobs() {
    console.log('Checking jobs');
    const schedules = this.appService.getDueJobs();

    schedules.forEach((x) => {
      console.log('Running job ' + x.id);
      this.client.emit('job_triggered', new Trigger());
    });
  }
}
