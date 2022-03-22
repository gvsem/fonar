import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getNavigation() : any {
    return {
      'menu': [
        {
          'title': 'Hemsida',
          'href': '/',
          'active': true,
        },
      ],
      'buttons': [
        {
          'title': 'UI Kit',
          'href': '/kit.html',
          'color': 'InfoGreen',
        },
      ]
    };
  };

  getSession(hash: string): any {
    if (hash == 'auth') {
      return {
        'authorized': true,
        'user': {
          'login': 'user',
          'name' : 'UserMan',
        }
      };
    } else {
      return {
        'authorized' : false
      };
    }
  }
}
