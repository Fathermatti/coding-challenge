import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppService, Article } from '../src/app.service';
import { AppController } from '../src/app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const article = new Article('hash', 'content');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'WORKER',
            transport: Transport.TCP,
            options: { port: 3001 },
          },
        ]),
      ],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppService)
      .useValue({ getArticles: () => [article] })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect([{ hash: 'hash', content: 'content' }]);
  });
});
