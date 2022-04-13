import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {

  @ApiProperty()
  @ApiPropertyOptional({
    title: 'First Name',
    example: 'Nikolai',
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  public firstName?: string;

  @ApiPropertyOptional({
    title: 'Last Name',
    example: 'Gumilev',
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  public lastName?: string;

  @ApiPropertyOptional({
    title: 'Invisibility of profile',
    description: 'Determines visibility of profile to other users',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  public isPrivate?: boolean;

  @ApiPropertyOptional({
    title: 'Author Alias',
    example: 'kolya',
    minLength: 6,
    maxLength: 25,
  })
  @IsOptional()
  @IsString()
  @Length(6, 25)
  public authorAlias?: string;

}
