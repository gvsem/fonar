import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public static getAppConfiguration(): any {
    return {
      links: {
        signin: '/auth/signin',
        signup: '/auth/signup',
        signout: '/auth/signout',
        feed: '/feed',
        all_users: '/authors',
        my_page: '/me',
      },
    };
  }
}
