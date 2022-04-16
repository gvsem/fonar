import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
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
    return this.userService.getUser(userId, login);
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
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
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
  @Put(':login')
  updateReplique(userId = 1, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
