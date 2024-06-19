import { IsArray, IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { HousingType, OfferGood } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { Type } from 'class-transformer';
import { City } from './city.class.js';
import { Location } from './location.class.js';
import { GOODS } from './const.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.createdDate.invalidFormat })
  public createdDate: Date;

  @ValidateNested()
  @Type(() => City)
  public city: City;

  @MaxLength(256, { message: CreateOfferValidationMessage.previewImage.maxLength })
  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @IsString({ each: true, message: CreateOfferValidationMessage.images.invalidValue })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite: boolean;

  @IsInt({ message: CreateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(HousingType, { message: CreateOfferValidationMessage.type.invalid })
  public type: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsString({ each: true, message: CreateOfferValidationMessage.goods.invalidValue })
  @IsIn(GOODS, { each: true, message: CreateOfferValidationMessage.goods.invalid })
  public goods: OfferGood[];

  public userId: string;

  @ValidateNested()
  @Type(() => Location)
  public location: Location;
}
