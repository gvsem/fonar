import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters, UseInterceptors
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { HttpExceptionFilter } from "../http.exception.filter";

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user',
  })
  @ApiParam({ name: 'login', type: 'string' })
  @ApiResponse({
    status: 200,
    description:
      'User has been successfully retrieved and presented within a response.',
  })
  @ApiResponse({
    status: 404,
    description: 'No user was found by the provided id.',
  })
  @Get(':login')
  async getUser(userId = 1, @Param('login') login) {
    try {
      const replique = await this.userService.getUser(userId, login);
      return replique;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
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
  @Post('/')
  async createUser(@Body() dto: CreateUserDto) {
    try {
      return await this.userService.createUser(dto);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Update user',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 204,
    description:
      'User has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'User has not been updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized.',
  })
  @Put('/')
  async updateUser(userId = 1, @Body() dto: UpdateUserDto) {
    try {
      return await this.userService.updateUser(userId, dto);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
