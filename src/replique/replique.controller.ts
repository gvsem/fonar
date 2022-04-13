import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseFilters
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RepliqueService } from "./replique.service";
import { CreateRepliqueDto } from "./dto/create.replique.dto";
import { UpdateRepliqueDto } from "./dto/update.replique.dto";
import { HttpExceptionFilter } from "src/http.exception.filter";

@ApiBearerAuth()
@ApiTags('replique')
@Controller('replique')
@UseFilters(new HttpExceptionFilter())
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
  async getReplique(userId = 1, @Param('id') id: number) {
    try {
      return await this.repliqueService.getReplique(userId, id);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
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
  async createReplique(userId = 1, @Body() dto: CreateRepliqueDto, @Res() response) {
    try {
      const replique = await this.repliqueService.createReplique(userId, dto);
      response.status(201).send(replique);
      return replique;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Update replique',
  })
  @ApiParam({ name: 'id', type: 'number' })
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
  async updateReplique(userId = 1, @Param('id') id: number, @Body() dto: UpdateRepliqueDto) {
    try {
      const replique = await this.repliqueService.updateReplique(userId, id, dto);
      return replique;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
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
  async originateReplique(userId = 1, @Param('id') id, @Param('oid') originId, @Res() response) {
    try {
      await this.repliqueService.originateReplique(userId, id, originId);
      response.status(204).send(null);
    } catch (e: any) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
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
    userId = 1,
    @Param('id') id,
    @Param('oid') originId,
    @Res() response,
  ) {
    try {
      await this.repliqueService.removeOriginatingReplique(userId, id, originId);
      response.status(204).send(null);
    } catch (e: any) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
