import { HttpService, Injectable } from '@nestjs/common';
import { Md5 } from 'ts-md5/dist/md5';

class NewsResponse {
  status: string;
  totalResults: number;
  articles: any[];
}

export class Article {
  hash: string;
  content: any;

  constructor(content) {
    this.hash = Md5.hashStr(JSON.stringify(content));
    this.content = content;
  }
}

@Injectable()
export class WorkerService {
  constructor(private httpService: HttpService) {}

  async fetchArticles(): Promise<Article[]> {
    const response = await this.httpService
      .get<NewsResponse>(
        'https://newsapi.org/v2/everything?q=weld&from=2021-11-20&sortBy=publishedAt&apiKey=83a325adabb34729bb3c68e0c7f12a5c',
      )
      .toPromise();
    return response.data.articles.map((x) => new Article(x));
  }
}
