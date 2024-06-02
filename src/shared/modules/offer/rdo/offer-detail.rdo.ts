import { Expose } from 'class-transformer';
import { City, Location, User } from '../../../types/index.js';

export class OfferDetailRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public city: City;

  @Expose()
  public location: Location;

  @Expose()
  public type: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public price: number;

  @Expose()
  public images: string[];

  @Expose()
  public rating: number;

  @Expose()
  public goods: string[];

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public host: User;
}
