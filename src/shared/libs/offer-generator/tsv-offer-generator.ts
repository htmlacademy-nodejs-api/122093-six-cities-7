import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomBoolean } from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_BEDROOMS = 2;
const MAX_BEDROOMS = 5;
const MIN_ADULTS = 1;
const MAX_ADULTS = 3;
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
    const {name, isPro, avatarUrl, password, email} = getRandomItem(this.mockData.host);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();

    return [
      title, description, createdDate, cityName, cityLocation.latitude, cityLocation.longitude,
      previewImage, images, isPremium, isFavorite, rating, type, bedrooms, maxAdults, price, goods,
      offerLatitude, offerLongitude, name, email, avatarUrl, password, isPro
    ].join('\t');
  }
}
