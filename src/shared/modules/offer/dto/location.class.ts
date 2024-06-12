import { IsNumber } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class Location {
  @IsNumber({}, { message: CreateOfferValidationMessage.location.invalidFormat })
  public latitude: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.location.invalidFormat })
  public longitude: number;
}
