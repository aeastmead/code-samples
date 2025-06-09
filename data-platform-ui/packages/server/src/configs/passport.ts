import { Profile, Strategy as SAMLStrategy, VerifiedCallback } from 'passport-saml';
import passport from 'passport';
import express, { Express } from 'express';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import config, { NLSSConfiguration } from '../config';
import castArray from 'lodash/castArray';

const { privateKey, callbackUrl, path, cert, issuer, entryPoint }: NLSSConfiguration['bsso'] = config.get('bsso');

passport.use(
  new SAMLStrategy(
    {
      path,
      cert,
      issuer,
      entryPoint,
      protocol: 'https://',
      identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
      privateKey: privateKey.replace(/\\n/g, '\n'),
      callbackUrl: callbackUrl !== null && !isEmpty(callbackUrl) ? callbackUrl : undefined,
    },
    (profile: Profile | null | undefined, cb: VerifiedCallback) => {
      if (isNil(profile)) {
        const error = new Error('Missing saml response');
        cb(error);
        return;
      }

      if (isNil(profile.uuid)) {
        const error = new TypeError('UUID missing from SAML callback');
        cb(error);
        return;
      }

      const user: Express.User = {
        id: +(profile as any).uuid,
        firstName: profile.firstName,
        lastName: profile.lastName,
        pvfLevels: !isNil(profile.pvfLevels) ? castArray(profile.pvfLevels) : [],
        username: profile.username,
      };

      cb(null, user as any);
    }
    // PassportSAML AbstractStrategy.logout's typing is not match Express.Request typing
  ) as any
);

passport.serializeUser((user: Express.User, done: (err: any, id?: Express.User) => void) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done: (err: any, user?: Express.User | false | null) => void) => {
  done(null, user);
});

export const isAuthorized: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.isAuthenticated() && isNil(req.user)) {
    res.status(401).json('Client requires a session');
    return;
  }
  next();
};

export { passport };
