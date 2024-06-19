import 'reflect-metadata';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
