import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReponseService } from './reponse.service';
import { CreateReponseDto } from './dto/create.reponse.dto';
import { HttpExceptionFilter } from '../http.exception.filter';

@ApiBearerAuth()
@ApiTags('reponse')
@Controller('reponse')
@UseFilters(new HttpExceptionFilter())
export class ReponseController {
  constructor(private readonly reponseService: ReponseService) {}

  @ApiOperation({
    summary: 'Get Reponse',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description:
      'Reponse has been successfully retrieved and presented within a response.',
  })
  @ApiResponse({
    status: 404,
    description: 'No Reponse was found by the provided id.',
  })
  @Get(':id')
  async getReponse(userId = 1, @Param('id') id) {
    try {
      return await this.reponseService.getReponse(userId, id);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({
    summary: 'Create Reponse',
  })
  @ApiBody({ type: CreateReponseDto })
  @ApiResponse({
    status: 201,
    description:
      'Reponse has been successfully created and presented within a response.',
  })
  @ApiResponse({
    status: 400,
    description: 'Reponse has not been created.',
  })
  @Post('/')
  async createReponse(userId = 1, @Body() dto: CreateReponseDto) {
    try {
      return await this.reponseService.createReponse(userId, dto);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
