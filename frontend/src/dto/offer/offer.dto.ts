import { Type } from '../../types/types';
import { CityDto } from './city.dto';
import { LocationDto } from './location.dto';

export class OfferDto {
  public id!: string;
  public title!: string;
  public city!: CityDto;
  public location!: LocationDto;
  public type!: Type;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public price!: number;
  public previewImage!: string;
  public rating!: number;
}
