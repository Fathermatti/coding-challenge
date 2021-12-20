import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(
    @Inject('DATA_STREAMS') private client: ClientProxy,
    private readonly workerService: WorkerService,
  ) {}

  @EventPattern('job_triggered')
  async findAll() {
    console.log('Fetching articles');

    const articles = await this.workerService.fetchArticles();
    articles.forEach((x) => {
      this.client.emit('article_fetched', x);
    });
  }
}
