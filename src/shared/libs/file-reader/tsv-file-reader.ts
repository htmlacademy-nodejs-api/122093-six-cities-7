import { readFileSync } from 'node:fs';
import { Offer } from '../../types/offer.type.js';
import { User } from '../../types/user.type.js';
import { FileReader } from './file-reader.interface.js';
import { Location } from '../../types/location.type.js';
import { City } from '../../types/city.type.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filePath: string
  ) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      cityName,
      cityLocation,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      location,
      userName,
      email,
      avatarUrl,
      password,
      isPro
    ] = line.split('\t');

    return {
      title,
      description,
      createdDate: new Date(date),
      city: this.parseCity(cityName, this.parseLocation(cityLocation)),
      previewImage,
      images: this.parseStringToArray(images),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: this.parseRating(rating),
      type,
      bedrooms: this.parseNumber(bedrooms),
      maxAdults: this.parseNumber(maxAdults),
      price: this.parseNumber(price),
      goods: this.parseStringToArray(goods),
      location: this.parseLocation(location),
      host: this.parseHost(userName, email, avatarUrl, password, this.parseBoolean(isPro))
    };
  }

  private parseStringToArray(string: string): string[] {
    return string.split(';');
  }

  private parseNumber(numberString: string): number {
    return Number.parseInt(numberString, 10);
  }

  private parseRating(ratingString: string): number {
    return Number.parseFloat(ratingString);
  }

  private parseBoolean(booleanString: string): boolean {
    return booleanString === 'true';
  }

  private parseHost(userName: string, email: string, avatarUrl: string, password: string, isPro: boolean): User {
    return { name: userName, email, avatarUrl, password, isPro };
  }

  private parseCity(cityName: string, location: Location): City {
    return { name: cityName, location };
  }

  private parseLocation(locationString: string): Location {
    const [latitudeString, longitudeString] = locationString.split(';');
    const latitude = Number(latitudeString);
    const longitude = Number(longitudeString);
    return { latitude, longitude };
  }

  public read(): void {
    this.rawData = readFileSync(this.filePath, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
