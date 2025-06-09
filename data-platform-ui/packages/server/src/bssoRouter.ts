import express from 'express';
import isNil from 'lodash/isNil';
import { passport } from './configs/passport';
import createHttpError from 'http-errors';

const router = express.Router();

/**
 * Called after a user is logged in. Redirects the user to pre-login path stored in session, RelayState for saml or /.
 * @param req
 * @param res
 */
const completeLogin: express.RequestHandler = (req: express.Request, res: express.Response) => {
  let redirectLocation: string = '/';

  if ((req.session as any).originalUrl !== undefined) {
    redirectLocation = (req.session as any).originalUrl;
    delete (req.session as any).originalUrl;
  } else if (!isNil(req.body.RelayState)) {
    redirectLocation = req.body.RelayState;
  }

  res.redirect(redirectLocation);
};

/**
 * Saves pre login url to user's session, for redirection after a successful login
 * @param req
 * @param _
 * @param next
 */
function storeOriginalUrl(req: express.Request, _: express.Response, next: express.NextFunction): void {
  if (req.session !== undefined && 'originalUrl' in req.query && !isNil(req.query.originalUrl)) {
    (req.session as any).originalUrl = req.query.originalUrl;
  }
  next();
}

/**
 * Shares an authenticated user's details with browser apps
 * @param req
 * @param res
 */
function userInfo(req: express.Request, res: express.Response): void {
  if (!req.isAuthenticated()) {
    res.status(401).json('No user is defined for this session');
    return;
  }

  res.status(200).json(req.user);
}

router.get('/me', userInfo);

router.get('/login', storeOriginalUrl, passport.authenticate('saml'), completeLogin);

router.post('/login/callback', passport.authenticate('saml'), completeLogin);

router.get('/login/error', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errorMessage: string | undefined = req.query.errorMessage as any;

  const message = !isNil(errorMessage) ? errorMessage : 'No error specified';
  next(new createHttpError.Forbidden(message));
  return;
});

export default router;
