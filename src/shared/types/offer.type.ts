import { City } from './city.type.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { OfferGood } from './offer-good.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  createdDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: OfferGood[];
  host: User;
  location: Location;
}
