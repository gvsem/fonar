import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import * as emailpassword from 'supertokens-node/lib/build/recipe/emailpassword';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { AppSession } from './session.decorator';

@Controller('/')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/auth/signin')
  @Render('auth')
  @UseGuards(AuthGuard)
  async login(@AppSession() session) {
    return {
      ...session,
      page: { auth: { signin: true } },
    };
  }

  @Get('/auth/signup')
  @Render('auth')
  @UseGuards(AuthGuard)
  async signup(@AppSession() session) {
    return {
      ...session,
      page: { auth: { signup: true } },
    };
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
