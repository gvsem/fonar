import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {

  @ApiProperty()
  public login: string;

  @ApiPropertyOptional()
  public firstName?: string;

  @ApiPropertyOptional()
  public lastName?: string;

  @ApiProperty()
  public password: string;

}
