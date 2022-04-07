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
  @Get(':id')
  async getUser(userId = 1, @Param('id') id) {
    return this.userService.getUser(userId, id);
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
  @Post('new')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @ApiOperation({
    summary: 'Update user',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 201,
    description:
      'User has been successfully updated and presented within a response.',
  })
  @ApiResponse({
    status: 400,
    description: 'User has not been updated.',
  })
  @Put(':id')
  updateReplique(userId = 1, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
