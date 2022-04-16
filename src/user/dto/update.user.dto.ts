import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {

  @ApiPropertyOptional()
  public firstName?: string;

  @ApiPropertyOptional()
  public lastName?: string;

  @ApiPropertyOptional()
  public isPrivate?: boolean;

  @ApiPropertyOptional()
  public authorAlias?: string;

}
