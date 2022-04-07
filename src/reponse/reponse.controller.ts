import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('reponse')
@Controller('reponse')
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
    return this.reponseService.getReponse(userId, id);
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
  @Post('new')
  createReponse(userId = 1, @Body() dto: CreateReponseDto) {
    return this.reponseService.createReponse(userId, dto);
  }
}
