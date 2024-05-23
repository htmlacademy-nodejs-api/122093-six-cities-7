import { Offer } from '../../types/offer.type.js';
import { User } from '../../types/user.type.js';
import { FileReader } from './file-reader.interface.js';
import { Location } from '../../types/location.type.js';
import { City } from '../../types/city.type.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

const RADIX_TEN = 10;
const TRUE_VALUE = 'true';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16000;

  constructor(
    private readonly filePath: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      cityName,
      cityLocationLatitude,
      cityLocationLongitude,
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
      offerLocationLatitude,
      offerLocationLongitude,
      userName,
      email,
      avatarUrl,
      isPro
    ] = line.split('\t');

    return {
      title,
      description,
      createdDate: new Date(date),
      city: this.parseCity(cityName, this.parseLocation(cityLocationLatitude, cityLocationLongitude)),
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
      location: this.parseLocation(offerLocationLatitude, offerLocationLongitude),
      host: this.parseHost(userName, email, avatarUrl, this.parseBoolean(isPro))
    };
  }

  private parseStringToArray(string: string): string[] {
    return string.split(';');
  }

  private parseNumber(numberString: string): number {
    return Number.parseInt(numberString, RADIX_TEN);
  }

  private parseRating(ratingString: string): number {
    return Number.parseFloat(ratingString);
  }

  private parseBoolean(booleanString: string): boolean {
    return booleanString === TRUE_VALUE;
  }

  private parseHost(userName: string, email: string, avatarUrl: string, isPro: boolean): User {
    return { name: userName, email, avatarUrl, isPro };
  }

  private parseCity(cityName: string, location: Location): City {
    return { name: cityName, location };
  }

  private parseLocation(locationLatitudeString: string, locationLongitudeString: string): Location {
    const latitude = Number(locationLatitudeString);
    const longitude = Number(locationLongitudeString);
    return { latitude, longitude };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filePath, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8'
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
