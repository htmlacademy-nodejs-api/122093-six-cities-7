import { IsString, ValidateNested } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { Location } from './location.class.js';

export class City {
  @IsString({ each: true, message: CreateOfferValidationMessage.city.invalidFormat })
  public name: string;

  @ValidateNested()
  public location: Location;
}
