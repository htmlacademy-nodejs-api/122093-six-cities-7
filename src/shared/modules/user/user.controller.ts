import { Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestScheme } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { OfferDetailRdo, OfferService, OffersRdo } from '../offer/index.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestScheme>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthorization
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavorite,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Post,
      handler: this.postFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email "${body.email}" exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async checkAuthorization({ tokenPayload: { email }}: Request, res: Response): Promise<void> {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async logout({ tokenPayload }: Request, res: Response): Promise<void> {
    await this.userService.findByEmail(tokenPayload.email);
    this.noContent(res, {});
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { userId } = params;
    const uploadFile = { avatarUrl: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatarUrl }));
  }

  public async getFavorite({ tokenPayload }: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(tokenPayload.email) as UserEntity;
    const favoriteIds = Object.keys(user.favorites);
    const offers = await this.offerService.findFavorites(favoriteIds);
    const favoriteOffers = offers.map((offer) => ({...offer.toObject(), isFavorite: true, id: offer.id}));
    this.ok(res, fillDTO(OffersRdo, favoriteOffers));
  }

  public async postFavorite(
    { params, tokenPayload }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }
    await this.userService.addToFavorites(tokenPayload.id, offer.id);
    offer.isFavorite = true;
    this.ok(res, fillDTO(OfferDetailRdo, offer));
  }

  public async deleteFavorite(
    { params, tokenPayload }: Request<Record<string, string>, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }
    await this.userService.removeFromFavorites(tokenPayload.id, offer.id);
    offer.isFavorite = false;
    this.ok(res, fillDTO(OfferDetailRdo, offer));
  }
}
