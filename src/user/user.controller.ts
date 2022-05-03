import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { RepliqueService } from '../replique/replique.service';
import { AppSession } from '../auth/session.decorator';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';

@ApiCookieAuth()
@ApiTags('user')
@Controller('/api/user')
@UseGuards(AuthRequiredGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly repliqueService: RepliqueService,
  ) {}

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
  async getUser(@AppSession() app, @Param('login') login) {
    return await this.userService.getUser(app.session.user.id, login);
  }

  @ApiOperation({
    summary: 'Update user',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 204,
    description: 'User has been successfully updated.',
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
  async updateUser(@AppSession() app, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(app.session.user.id, dto);
  }

  @ApiOperation({
    summary: "Get user's repliques",
  })
  @ApiParam({ name: 'login', type: 'string', example: 'gumilev' })
  @ApiParam({ name: 'skip', type: 'number', required: false, example: 0 })
  @ApiParam({ name: 'quantity', type: 'number', required: false, example: 5 })
  @ApiResponse({
    status: 200,
    description:
      'Repliques have been successfully retrieved and presented within a response.',
  })
  @ApiResponse({
    status: 404,
    description: 'No user was found by the provided login.',
  })
  @Get('/:login/repliques/:skip?/:quantity?')
  async getRepliques(
    userId = 1,
    @Param('login') login: string,
    @Param('skip') skip?: number,
    @Param('quantity') quantity?: number,
  ) {
    if (skip === undefined) {
      skip = 0;
    }
    if (quantity === undefined) {
      quantity = 5;
    }

    const profile = await this.userService.getUser(userId, login);
    return await this.repliqueService.getRepliques(
      userId,
      login,
      skip,
      quantity,
      profile.id == userId ? undefined : true,
    );
  }
}
