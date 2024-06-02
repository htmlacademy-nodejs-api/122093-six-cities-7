import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferCount } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().limit(OfferCount.DEFAULT).populate(['userId']).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate(['userId']).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {'$inc': {commentCount: 1}}).exec();
  }

  public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({createdAt: SortType.Down}).limit(count).populate(['userId']).exec();
  }

  public async findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({commentCount: SortType.Down}).limit(count).populate(['userId']).exec();
  }

  public async findPremiumsInCity(_city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({'isPremium': {$eq: true}}).sort({createdAt: SortType.Down}).limit(OfferCount.PREMIUM).populate(['userId']).exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({'isFavorite': {$eq: true}}).populate(['userId']).exec();
  }

  public async updateFavoriteStatus(offerId: string, status: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOneAndUpdate({_id: offerId}, {$set: {isFavorite: !!status}}, {new: true}).exec();
  }

  public async calculateAverageRating() {
    this.offerModel
      .aggregate([
        {
          $match: {
            id: '_id'
          }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'commentsData'
          }
        },
        {
          '$addFields': {
            'rating': {
              $round: [
                {
                  '$avg': '$commentsData.rating'
                },
                1
              ]
            }
          }
        },
        {
          $unset: 'commentsData'
        }
      ])
      .exec();
  }
}
