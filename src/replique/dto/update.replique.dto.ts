import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, Length } from 'class-validator';

export class UpdateRepliqueDto {
  @ApiPropertyOptional({
    description: 'Contentful name of publication visible to users',
    title: 'Title of Replique',
    minLength: 2,
    maxLength: 100,
    example: 'The Lost Tram',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  public title?: string;

  @ApiPropertyOptional({
    description: 'A paragraph usually dedicated to an introduction',
    title: 'Text of Abstract',
    minLength: 0,
    maxLength: 2000,
    example:
      'Nikolay Stepanovich Gumilyov was an influential Russian poet, literary critic, traveler, and military officer. He was a cofounder of the Acmeist movement.',
  })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  public abstractText?: string;

  @ApiPropertyOptional({
    description: 'Content of the replique itself',
    title: 'Text of content',
    minLength: 0,
    example:
      'I was walking down an unfamiliar street,\n' +
      'and suddenly I heard the caws of crows,\n' +
      'and distant thunder, and a ringing lute:\n' +
      'a tram flew by, before my eyes.',
  })
  @IsOptional()
  @IsString()
  @Length(0)
  public content?: string;
}
