import { IsString, MinLength } from 'class-validator';
export class CreateLabelDto {
  @IsString() @MinLength(1) profileNo: string;
  @IsString() @MinLength(1) alloy: string;
  @IsString() @MinLength(1) surfaceColor: string;
}
export class CreateLotDto { @IsString() labelId: string; }
