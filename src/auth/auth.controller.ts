import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as emailpassword from 'supertokens-node/lib/build/recipe/emailpassword';
//import * as session from 'supertokens-node/lib/build/;
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { AppSession } from './appsession.decorator';
import supertokens from 'supertokens-node';
import session from 'supertokens-node/recipe/session';

@ApiTags('auth')
@Controller('/')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth/signin')
  @UseGuards(AuthGuard)
  async login(@Res() resp, @AppSession() app) {
    if (app.session.authorized) {
      resp.redirect('/me');
      return;
    }
    return resp.render(
      'auth',
      {
        ...app,
        page: { auth: { signin: true } },
      },
      function (err, html) {
        resp.send(html);
      },
    );
  }

  @Get('/auth/signup')
  @UseGuards(AuthGuard)
  async signup(@Res() resp, @AppSession() app) {
    if (app.session.authorized) {
      resp.redirect('/me');
      return;
    }
    return resp.render(
      'auth',
      {
        ...app,
        page: { auth: { signup: true } },
      },
      function (err, html) {
        resp.send(html);
      },
    );
  }

  @Get('/auth/signout')
  @UseGuards(AuthGuard)
  async signout(@Req() req, @Res() resp, @AppSession() app) {
    if (app.session.authorized) {
      await req.session.revokeSession();
    }
    resp.redirect('/');
  }

  @ApiOperation({
    summary: 'Create user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description:
      'User has been successfully created and presented within a response.',
  })
  @ApiResponse({
    status: 400,
    description: 'User has not been created.',
  })
  @Post('/api/auth/signup')
  async createUser(@Body() dto: CreateUserDto) {
    const info = await emailpassword.signUp(dto.email, dto.password);

    if (info.status === 'OK') {
      await this.userService.createUser(dto, info.user.id);

      const auth = await emailpassword.signIn(dto.email, dto.password);
      if (auth.status === 'OK') {
      } else {
        throw new ConflictException(
          'Something sad happened on the side of Auth Provider.',
        );
      }
    } else {
      throw new ConflictException('User with presented email already exists.');
    }
  }

  @ApiOperation({
    summary: 'Check email before sign-up',
  })
  @ApiParam({ name: 'email', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns boolean value corresponding to availability.',
  })
  @Get('/api/auth/checkEmail/:email')
  async checkEmail(@Param('email') email) {
    return await this.userService.checkEmail(email);
  }

  @ApiOperation({
    summary: 'Check login before sign-up',
  })
  @ApiParam({ name: 'login', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns boolean value corresponding to availability.',
  })
  @Get('/api/auth/checkLogin/:login')
  async checkLogin(@Param('login') login) {
    return await this.userService.checkLogin(login);
  }
}
