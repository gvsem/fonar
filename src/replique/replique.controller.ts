import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RepliqueService } from './replique.service';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';

@ApiBearerAuth()
@ApiTags('replique')
@Controller('replique')
export class RepliqueController {
  constructor(private readonly repliqueService: RepliqueService) {}

  @ApiOperation({
    summary: 'Get replique',
  })
  @ApiParam({ name: 'id', type: 'string' })
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
  async getReplique(userId = 1, @Param('id') id) {
    return this.repliqueService.getReplique(userId, id);
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
  createReplique(userId = 1, @Body() dto: CreateRepliqueDto) {
    return this.repliqueService.createReplique(userId, dto);
  }

  @ApiOperation({
    summary: 'Update replique',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateRepliqueDto })
  @ApiResponse({
    status: 204,
    description:
      'Replique has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Replique has not been updated.',
  })
  @Put(':id')
  updateReplique(userId = 1, @Body() dto: UpdateRepliqueDto) {
    return this.repliqueService.updateReplique(userId, dto);
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
  async originateReplique(userId = 1, @Param('id') id, @Param('oid') originId) {
    return this.repliqueService.originateReplique(userId, id, originId);
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
  async deleteOriginationReplique(
    userId = 1,
    @Param('id') id,
    @Param('oid') originId,
  ) {
    return this.repliqueService.removeOriginatingReplique(userId, id, originId);
  }
}
