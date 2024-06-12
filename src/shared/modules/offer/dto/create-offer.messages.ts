export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100'
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024'
  },
  createdDate: {
    invalidFormat: 'createdDate must be a valid ISO date'
  },
  city: {
    invalidFormat: 'Field city name must be string'
  },
  previewImage: {
    maxLength: 'Too long for field «previewImage»',
    invalidFormat: 'Field previewImage must be string',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    invalidValue: 'Values must be string'
  },
  isPremium: {
    invalidFormat: 'isPremium must be boolean'
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be boolean'
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5'
  },
  type: {
    invalid: 'type must be HousingType'
  },
  bedrooms: {
    invalidFormat: 'bedrooms must be an integer',
    minValue: 'Minimum bedrooms is 1',
    maxValue: 'Maximum bedrooms is 8'
  },
  maxAdults: {
    invalidFormat: 'maxAdults must be an integer',
    minValue: 'Minimum adults is 1',
    maxValue: 'Maximum adults is 10'
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000'
  },
  goods: {
    invalidFormat: 'Field goods must be an array',
    invalidValue: 'Values must be string',
    invalid: 'type must be OfferGood'
  },
  userId: {
    invalidId: 'userId field must be a valid id'
  },
  location: {
    invalidFormat: 'Field location must be an integer'
  }
} as const;
