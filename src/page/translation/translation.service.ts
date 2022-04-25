import { Injectable } from '@nestjs/common';
import * as Ru from './ru.json';

@Injectable()
export class TranslationService {
  private static translations = {
    ru: Ru,
  };

  static get(locale = 'ru'): any {
    if (this.translations[locale] !== undefined) {
      return this.translations[locale];
    }
    return Ru;
  }

  static getFromHeaders(acceptLanguages?: string): any {
    if (acceptLanguages !== undefined) {
      const preferences = acceptLanguages.split(',');
      for (const p of preferences) {
        const locale = p.split(';', 2)[0];
        if (this.translations[locale] !== undefined) {
          return this.translations[locale];
        }
      }
    }
    return Ru;
  }
}
