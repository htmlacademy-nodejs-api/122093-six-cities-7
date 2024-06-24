import { Type } from '../../types/types';
import { UserDto } from '../user/user.dto';
import { CityDto } from './city.dto';
import { LocationDto } from './location.dto';

export class OfferDetailDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public city!: CityDto;
  public location!: LocationDto;
  public type!: Type;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public price!: number;
  public previewImage!: string;
  public images!: string[];
  public rating!: number;
  public goods!: string[];
  public bedrooms!: number;
  public maxAdults!: number;
  public host!: UserDto;
}
