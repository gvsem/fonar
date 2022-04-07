import { ApiProperty } from '@nestjs/swagger';

export class CreateRepliqueDto {

  @ApiProperty()
  public title: string;

}
