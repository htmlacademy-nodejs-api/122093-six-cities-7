import { UserType } from '../const';
import { CommentDto } from '../dto/comment/comment.dto';
import { OfferDetailDto } from '../dto/offer/offer-detail.dto';
import { OfferDto } from '../dto/offer/offer.dto';
import { UserWithTokenDto } from '../dto/user/user-with-token.dto';
import { UserDto } from '../dto/user/user.dto';
import { Comment, Offer, User } from '../types/types';

const adaptUserTypeToClient = (userType: boolean): UserType => {
  switch (userType) {
    case false:
      return UserType.Regular;
    case true:
      return UserType.Pro;
    default:
      return UserType.Regular;
  }
};

export const adaptLoginToClient = (user: UserWithTokenDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  type: adaptUserTypeToClient(user.isPro),
  token: user.token,
});

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  type: adaptUserTypeToClient(user.isPro),
  email: user.email,
  avatarUrl: user.avatarUrl,
});

export const adaptOfferDetailToClient = (offer: OfferDetailDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  previewImage: offer.previewImage,
  bedrooms: offer.bedrooms,
  description: offer.description,
  goods: offer.goods,
  images: offer.images,
  maxAdults: offer.maxAdults,
  type: offer.type,
  location: offer.location,
  city: offer.city,
  host: adaptUserToClient(offer.host)
});

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  previewImage: offer.previewImage,
  type: offer.type,
  location: offer.location,
  city: offer.city,
  bedrooms: 0,
  description: '',
  goods: [],
  images: [],
  maxAdults: 0,
  host: {
    name: '',
    avatarUrl: '',
    type: UserType.Regular,
    email: '',
  }
});

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.comment,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUserToClient(comment.user)
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers.map(((offer) => adaptOfferToClient(offer)));

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map(((comment) => adaptCommentToClient(comment)));
