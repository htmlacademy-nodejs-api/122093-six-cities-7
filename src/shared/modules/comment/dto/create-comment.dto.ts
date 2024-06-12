import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentValidationMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentValidationMessages.comment.invalidFormat })
  @Length(5, 1024, { message: 'min is 5, max is 1024 '})
  public comment: string;

  @IsInt({ message: CreateCommentValidationMessages.rating.invalidFormat })
  @Min(1, { message: CreateCommentValidationMessages.rating.minValue })
  @Max(5, { message: CreateCommentValidationMessages.rating.maxValue })
  public rating: number;

  @IsMongoId({ message: CreateCommentValidationMessages.offerId.invalidFormat })
  public offerId: string;

  @IsMongoId({ message: CreateCommentValidationMessages.offerId.invalidFormat })
  public userId: string;
}
