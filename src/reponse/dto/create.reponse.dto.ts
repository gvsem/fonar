import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateReponseDto {
  @ApiProperty({
    description: 'Id of Replique to which the Reponse will be attached',
    title: 'Replique Id',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  public repliqueId: number;

  @ApiProperty({
    description: 'Text of Reponse',
    title: 'Text of Reponse',
    example: 'Bravi! Gioia ultima!',
    minLength: 0,
    maxLength: 2000,
  })
  @IsString()
  @Length(0, 2000)
  public text: string;
}
