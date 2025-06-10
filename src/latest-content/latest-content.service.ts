import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LatestContent } from 'src/interfaces/latest-content.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class LatestContentService {
  constructor(private readonly dataSource: DataSource) { }

  async find10LatestContent(): Promise<LatestContent[]> {
    try {
      return await this.dataSource.query(`
        SELECT CONCAT('jdr_', id) AS uid, id, title, date, 'JDR' AS page_name, 'jdr' AS page_link FROM jdr
        UNION ALL
        SELECT CONCAT('news_', id) AS uid, id, title, date, 'Nouvelle' AS page_name, 'news' AS page_link FROM news
        UNION ALL
        SELECT CONCAT('hero_', id) AS uid, id, title, date, 'Histoire dont vous êtes le héros' AS page_name, 'yourHeroStories' AS page_link FROM hero
        ORDER BY date DESC
        LIMIT 10;
      `);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération des 10 derniers ajouts du site.'
      );
    }
  }
}