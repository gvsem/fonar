import { Injectable } from '@nestjs/common';

@Injectable()
export class PageService {

  getMeta() : any {
    return {
      'description': 'Lol',
      'keywords': 'Ah',
      'author': 'Oh'
    };
  };

  getPage(id: string): any {
    if (id == '/logged') {
      return {
        'meta': this.getMeta(),
        'title': 'Logged in state',
        'header': 'Wow! You are logged in!',
        'description': 'Great, so glad you\'re in.',
        'breadcrumbs': [
          {
            'title': 'Hemsida',
            'href': '/',
          },
        ],
        'content': 'Congrats, you are logged in',
      };
    } else {
      return {
        'meta': this.getMeta(),
        'title': 'Hemsida',
        'header': 'Hej!',
        'description': 'Så mycket skulle kunna skrivas här, men det ser redan bra ut.',
        'breadcrumbs': [
          {
            'title': 'Hemsida',
            'href': '/',
          },
        ],
        'content': 'Hello.',
      };
    }

  };


}
