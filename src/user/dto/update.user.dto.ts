import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    title: 'Last Name',
    example: 'Gumilev',
    minLength: 1,
    maxLength: 20,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  public firstName?: string;

  @ApiProperty({
    title: 'Last Name',
    example: 'Gumilev',
    minLength: 1,
    maxLength: 20,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  public lastName?: string;

  @ApiProperty({
    title: 'Invisibility of profile',
    description: 'Determines visibility of profile to other users',
    example: false,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public isPrivate?: boolean;

  @ApiProperty({
    title: 'Author Alias',
    example: 'kolya',
    minLength: 6,
    maxLength: 25,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(6, 25)
  public authorAlias?: string;
}
