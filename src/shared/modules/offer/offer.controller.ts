import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { Response, Request } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { OffersRdo } from './rdo/offers.rdo.js';
import { OfferDetailRdo } from './rdo/offer-detail.rdo.js';
import { ParamOfferId } from './types/param-offerid.type.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { OfferCount } from './offer.constant.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'), new ValidateDtoMiddleware(UpdateOfferDto)] });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite });
    this.addRoute({ path: '/favorite/:offerId/:status', method: HttpMethod.Post, handler: this.updateFavoriteStatus, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getComments, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/new', method: HttpMethod.Get, handler: this.getNew });
    this.addRoute({ path: '/discussed', method: HttpMethod.Get, handler: this.getDiscussed });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OffersRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferDetailRdo, offer));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerDetail = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferDetailRdo, offerDetail));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferDetailRdo, updatedOffer));
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
    await this.offerService.updateFavoriteStatus(params.offerId, Number(params.status));
    this.ok(res, fillDTO(OfferDetailRdo, offer));
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async getNew(_req: Request, res: Response) {
    const newOffers = await this.offerService.findNew(OfferCount.NEW);
    this.ok(res, fillDTO(OffersRdo, newOffers));
  }

  public async getDiscussed(_req: Request, res: Response) {
    const discussedOffers = await this.offerService.findDiscussed(OfferCount.DISCUSSED);
    this.ok(res, fillDTO(OffersRdo, discussedOffers));
  }
}
