import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { Response, Request } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { OffersRdo } from './rdo/offers.rdo.js';
import { OfferDetailRdo } from './rdo/offer-detail.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getOfferDetail });
    this.addRoute({ path: '/delete/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/update/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite });
    this.addRoute({ path: '/favorite/:offerId/:status', method: HttpMethod.Post, handler: this.updateFavoriteStatus });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OffersRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferDetailRdo, result));
  }

  public async getOfferDetail(
    { params }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const offerDetail = await this.offerService.findById(params.offerId);

    if (!offerDetail) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} doesn't exist`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDetailRdo, offerDetail));
  }

  public async delete(
    { params }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    if (!this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} doesn't exist`,
        'OfferController'
      );
    }

    await this.offerService.deleteById(params.offerId);
    this.noContent(res, {});
  }

  public async update(
    { body, params }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} doesn't exist`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferDetailRdo, body));
  }

  public async getPremium(
    { params }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const premiumOffers = await this.offerService.findPremiumsInCity(params.city);
    this.ok(res, fillDTO(OffersRdo, premiumOffers));
  }

  public async getFavorite(_req: Request, res: Response): Promise<void> {
    const favoriteOffers = await this.offerService.findFavorites();
    this.ok(res, fillDTO(OffersRdo, favoriteOffers));
  }

  public async updateFavoriteStatus(
    { params }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} doesn't exist`,
        'OfferController'
      );
    }

    await this.offerService.updateFavoriteStatus(params.offerId, Number(params.status));
    this.ok(res, fillDTO(OfferDetailRdo, offer));
  }
}
