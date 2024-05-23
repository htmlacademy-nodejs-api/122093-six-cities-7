import { Ref, Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, Location } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {allowMixed: Severity.ALLOW}
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true})
  public title: string;

  @prop({ trim: true })
  public description: string;

  @prop()
  public createdDate: Date;

  @prop()
  public city: City;

  @prop()
  public previewImage: string;

  @prop()
  public images: string[];

  @prop()
  public isPremium: boolean;

  @prop()
  public isFavorite: boolean;

  @prop()
  public rating: number;

  @prop()
  public type: string;

  @prop()
  public bedrooms: number;

  @prop()
  public maxAdults: number;

  @prop()
  public price: number;

  @prop()
  public goods: string[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId: Ref<UserEntity>;

  @prop()
  public location: Location;

  @prop({default: 0})
  public commentCount: number;
}

export const OfferModel = getModelForClass(OfferEntity);
