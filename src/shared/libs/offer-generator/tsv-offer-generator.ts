import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomBoolean } from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

enum PriceRange {
  MIN_PRICE = 500,
  MAX_PRICE = 2000
}

enum RatingRange {
  MIN_RATING = 1,
  MAX_RATING = 5
}

enum BedroomsRange {
  MIN_BEDROOMS = 2,
  MAX_BEDROOMS = 5
}

enum AdultsRange {
  MIN_ADULTS = 1,
  MAX_ADULTS = 3
}

enum Days {
  FIRST_WEEK_DAY = 1,
  LAST_WEEK_DAY = 7
}

const MAX_IMAGE_COUNT = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.title);
    const description = getRandomItem(this.mockData.description);
    const {name: cityName, location: cityLocation} = getRandomItem(this.mockData.city);
    const previewImage = getRandomItem(this.mockData.previewImage);
    const images = getRandomItems(this.mockData.images).slice(0, MAX_IMAGE_COUNT).join(';');
    const type = getRandomItem(this.mockData.type);
    const goods = getRandomItems(this.mockData.goods).join(';');
    const {latitude: offerLatitude, longitude: offerLongitude} = getRandomItem(this.mockData.location);
    const {name, isPro, avatarUrl, email} = getRandomItem(this.mockData.host);
    const createdDate = dayjs()
      .subtract(generateRandomValue(Days.FIRST_WEEK_DAY, Days.LAST_WEEK_DAY), 'day')
      .toISOString();
    const price = generateRandomValue(PriceRange.MIN_PRICE, PriceRange.MAX_PRICE);
    const rating = generateRandomValue(RatingRange.MIN_RATING, RatingRange.MAX_RATING, 1);
    const bedrooms = generateRandomValue(BedroomsRange.MIN_BEDROOMS, BedroomsRange.MAX_BEDROOMS);
    const maxAdults = generateRandomValue(AdultsRange.MIN_ADULTS, AdultsRange.MAX_ADULTS);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();

    return [
      title, description, createdDate, cityName, cityLocation.latitude, cityLocation.longitude,
      previewImage, images, isPremium, isFavorite, rating, type, bedrooms, maxAdults, price, goods,
      offerLatitude, offerLongitude, name, email, avatarUrl, isPro
    ].join('\t');
  }
}
