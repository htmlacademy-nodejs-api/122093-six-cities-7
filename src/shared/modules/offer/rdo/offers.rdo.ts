import { Expose } from 'class-transformer';
import { City, Location } from '../../../types/index.js';

export class OffersRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

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
  public previewImage: string;

  @Expose()
  public rating: number;
}
