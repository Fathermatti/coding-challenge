import { AppService, Article } from '../src/app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('getArticles', () => {
    it('should return an array of cats', async () => {
      const fst = new Article('a', 'message');
      const snd = new Article('a', 'message');
      const trd = new Article('c', 'message');
      const articles = [fst, snd, trd];

      articles.forEach((x) => appService.addArticle(x));
      const actual = appService.getArticles();

      expect(actual[0].hash).toBe('a');
      expect(actual[1].hash).toBe('c');
    });
  });
});
