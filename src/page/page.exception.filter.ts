import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException, NotFoundException
} from "@nestjs/common";
import { Request, Response } from 'express';
import { AppService } from '../app.service';
import { HttpAdapterHost } from "@nestjs/core";

@Catch(HttpException)
export class PageExceptionFilter implements ExceptionFilter {

  constructor(private adapterHost: HttpAdapterHost) {
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      response.redirect(AppService.getAppConfiguration().links.signin);
      return;
    }

    if (exception.getStatus() == 404) {
      const instance = this.adapterHost.httpAdapter.getInstance();
      request.url = '/404';
      instance._router.handle(request, response, null);
      return;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
