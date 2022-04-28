import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { RepliqueService } from './replique.service';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
import { AppSession } from '../auth/session.decorator';

@ApiCookieAuth()
@UseGuards(AuthRequiredGuard)
@ApiTags('replique')
@Controller('/api/replique')
export class RepliqueController {
  constructor(private readonly repliqueService: RepliqueService) {}

  @ApiOperation({
    summary: 'Get replique',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description:
      'Replique has been successfully retrieved and presented within a response.',
  })
  @ApiResponse({
    status: 404,
    description: 'No replique was found by the provided id.',
  })
  @Get(':id')
  async getReplique(@AppSession() app, @Param('id') id: number) {
    return await this.repliqueService.getReplique(app.session.user.id, id);
  }

  @ApiOperation({
    summary: 'Create replique',
  })
  @ApiBody({ type: CreateRepliqueDto })
  @ApiResponse({
    status: 201,
    description:
      'Replique has been successfully created and presented within a response.',
  })
  @ApiResponse({
    status: 400,
    description: 'Replique has not been created.',
  })
  @Post('/')
  async createReplique(
    @AppSession() app,
    @Body() dto: CreateRepliqueDto,
    @Res() response,
  ) {
    const replique = await this.repliqueService.createReplique(
      app.session.user.id,
      dto,
    );
    response.status(201).send(await this.repliqueService.getReplique(app.session.user.id, replique.id));
    return replique;
  }

  @ApiOperation({
    summary: 'Update replique',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateRepliqueDto })
  @ApiResponse({
    status: 204,
    description: 'Replique has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Replique has not been updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Replique has not been found.',
  })
  @Put(':id')
  @HttpCode(204)
  async updateReplique(
    @AppSession() app,
    @Param('id') id: number,
    @Body() dto: UpdateRepliqueDto,
  ) {
    return await this.repliqueService.updateReplique(
      app.session.user.id,
      id,
      dto,
    );
  }

  @ApiOperation({
    summary: 'Connect replique with its origin',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'oid', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Replique has been successfully connected.',
  })
  @ApiResponse({
    status: 400,
    description: 'Origin is not available for citing.',
  })
  @ApiResponse({
    status: 404,
    description: 'No origin replique was found by the provided id.',
  })
  @ApiResponse({
    status: 405,
    description:
      'Circular origination is not available for provided repliques.',
  })
  @Post(':id/originates/:oid')
  @HttpCode(204)
  async originateReplique(
    @AppSession() app,
    @Param('id') id,
    @Param('oid') originId,
    @Res() response,
  ) {
    await this.repliqueService.originateReplique(
      app.session.user.id,
      id,
      originId,
    );
    response.status(204).send(null);
  }

  @ApiOperation({
    summary: 'Disconnect replique from its origin',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'oid', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Replique has been successfully disconnected.',
  })
  @ApiResponse({
    status: 400,
    description: 'Origin is not available for citing.',
  })
  @ApiResponse({
    status: 404,
    description: 'No replique was found by provided id.',
  })
  @ApiResponse({
    status: 405,
    description: 'This origin can not be disconnected.',
  })
  @Delete(':id/originates/:oid')
  @HttpCode(204)
  async deleteOriginationReplique(
    @AppSession() app,
    @Param('id') id,
    @Param('oid') originId,
    @Res() response,
  ) {
    await this.repliqueService.removeOriginatingReplique(
      app.session.user.id,
      id,
      originId,
    );
    response.status(204).send(null);
  }
}
