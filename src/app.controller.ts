import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import {LoggingInterceptor} from './logging.interceptor';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  private meta: any = {
    'description': 'Lol',
    'keywords': 'Ah',
    'author': 'Oh'
  };

  private navigation: any = {
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
    ],
  };


  @Get()
  @Render('index')
  root() {
    let page: any = {
      'meta': this.meta,
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
    let session_info: any =
    {
      'authorized' : false
    };
    return { navigation: this.navigation, page: page, session: session_info };
  }


  @Get('/logged')
  @Render('index')
  logged() {
    let page: any = {
      'meta': this.meta,
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
    let session_info: any =
    {
      'authorized': true,
      'user': {
        'login': 'user',
        'name' : 'UserMan',
      }
    };
    return { navigation: this.navigation, page: page, session: session_info };
  }


}
