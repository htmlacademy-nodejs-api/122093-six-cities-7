import { CityDto } from './city.dto';
import { LocationDto } from './location.dto';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: CityDto;
  public location?: LocationDto;
  public type?: string;
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public price?: number;
  public images?: string[];
  public rating?: number;
  public goods?: string[];
  public bedrooms?: number;
  public maxAdults?: number;
}
