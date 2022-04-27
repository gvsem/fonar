import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsHash,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Login used for authorization purposes',
    title: 'Login',
    example: 'gumilev',
    minLength: 6,
    maxLength: 18,
  })
  @IsString()
  @Length(6, 18)
  public login: string;

  @ApiProperty({
    description: 'Email used for authorization purposes',
    title: 'Email',
    example: 'gumilev@ak.me',
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  public email: string;

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

  @ApiProperty({
    description: 'sha512-encrypted password',
    title: 'Password hash',
    example:
      '99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8',
  })
  @IsDefined()
  @IsString()
  @IsHash('sha512')
  public password: string;
}
