
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    //return next.handle().pipe(map(data => ({ data })));
    //return next.handle().pipe({..., 'client_server':});

    const now = Date.now();

    return next.handle().pipe(
      map(response => {
        response.loadingtime = Date.now() - now;
        return response;
      }),
    );

  }

  // intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
  //   console.log('Before...');
  //
  //   const now = Date.now();
  //   return next.handle().pipe(
  //     //tap(() => console.log(`After... ${Date.now() - now}ms`)),
  //      map( data => ({ 'data' : 'ada'/*Date.now() - now*/ })),
  //   );
  //   // return next
  //   //   .handle()
  //   //   .pipe(
  //   //     map( server_loading_time => ({ Date.now() - now })),
  //   //     tap(() => console.log(`After... ${Date.now() - now}ms`)),
  //   //   );
  // }
}