import { ApiProperty } from '@nestjs/swagger';

export class CreateReponseDto {

  @ApiProperty()
  public repliqueId: number;

  @ApiProperty()
  public text: string;

}
