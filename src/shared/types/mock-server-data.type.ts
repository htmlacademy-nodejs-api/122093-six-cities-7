import { City } from './city.type.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export type MockServerData = {
  title: string[];
  description: string[];
  city: City[];
  previewImage: string[];
  images: string[];
  type: string[];
  goods: string[];
  location: Location[];
  host: User[];
}
