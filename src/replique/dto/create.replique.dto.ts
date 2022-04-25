import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export class CreateRepliqueDto {
  @ApiPropertyOptional({
    description: 'Contentful name of publication visible to users',
    title: 'Title of Replique',
    minLength: 2,
    maxLength: 100,
    example: 'The Lost Tram',
  })
  @IsDefined()
  @IsString()
  @Length(2, 100)
  public title: string;
}
