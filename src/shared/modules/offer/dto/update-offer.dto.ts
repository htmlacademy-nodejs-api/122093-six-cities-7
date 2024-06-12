import { IsArray, IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsMongoId, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { HousingType, OfferGood } from '../../../types/index.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';
import { Type } from 'class-transformer';
import { City } from './city.class.js';
import { GOODS } from './const.js';
import { Location } from './location.class.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateOfferValidationMessage.createdDate.invalidFormat })
  public createdDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => City)
  public city?: City;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferValidationMessage.previewImage.maxLength })
  @IsString({ message: UpdateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.images.invalidFormat })
  @IsString({ each: true, message: UpdateOfferValidationMessage.images.invalidValue })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.rating.minValue })
  @Max(5, { message: UpdateOfferValidationMessage.rating.maxValue })
  public rating?: number;

  @IsOptional()
  @IsEnum(HousingType, { message: UpdateOfferValidationMessage.type.invalid })
  public type?: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.goods.invalidFormat })
  @IsString({ each: true, message: UpdateOfferValidationMessage.goods.invalidValue })
  @IsIn(GOODS, { each: true, message: UpdateOfferValidationMessage.goods.invalid })
  public goods?: OfferGood[];

  @IsOptional()
  @IsMongoId({ message: UpdateOfferValidationMessage.userId.invalidId })
  public userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  public location?: Location;
}
