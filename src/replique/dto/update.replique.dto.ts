import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateRepliqueDto {

  @ApiPropertyOptional()
  public title?: string;

  @ApiPropertyOptional()
  public abstractText?: string;

  @ApiPropertyOptional()
  public content?: string;

}