import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import session from './configs/session';
import { isAuthorized, passport } from './configs/passport';
import bssoRouter from './bssoRouter';
import { catalogProxy, qsenapiProxy, gpmgrProxy, qliksenseAPIProxy } from './configs/proxy';
import config from './config';
import http from 'http';
import { AddressInfo } from 'net';
import errorHandler from './errorHandling';
import path from 'path';
import serveStatic from 'serve-static';
import { ROOT_PROJECT_DIR } from './server.constants';
import logger from './logger';

const UI_BUILT_DIR = path.join(ROOT_PROJECT_DIR, 'dist');

type UIPaths = {
  dir: string;
  index: string;
};

function getUIPaths(subDir: string): UIPaths {
  const dir = path.join(UI_BUILT_DIR, subDir);

  return {
    dir,
    index: path.join(dir, 'index.html'),
  };
}

export default async function createApp(): Promise<http.Server> {
  const app: express.Application = express();

  app.enable('trust proxy');

  app.use(bodyParser.json({ type: '*/json' }));
  app.use(bodyParser.urlencoded({ extended: false }));

  const secureProtocol: boolean = config.get('secureProtocol');

  if (secureProtocol) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [
              "'self'",
              '*.bloomberg.com',
              '*.stacker.bloomberg.com',
              '*.bcs.bloomberg.com',
              '*.dev.bloomberg.com',
              '*.alpha.bloomberg.com',
              '*.beta.bloomberg.com',
              '*.prod.bloomberg.com',
            ],
            scriptSrc: ["'self'", "'unsafe-eval'"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    );
  }

  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Used by Stacker
   */
  app.use('/test', (_: express.Request, res: express.Response) => {
    res.status(200).send('OK');
    return;
  });

  app.use('/bsso', bssoRouter);
  app.use('/api/catalog', isAuthorized, catalogProxy);
  app.use('/api/qsenapisvc', isAuthorized, qsenapiProxy);
  app.use('/api/gpmgrsvc', isAuthorized, gpmgrProxy);
  app.use('/api/qliksenseapisvc', isAuthorized, qliksenseAPIProxy);

  /**
   * Cerebro image files
   */
  app.use(
    '/cerebro',
    serveStatic<express.Response>(path.join(__dirname, '../../cerebro/dist'), {
      redirect: false,
      fallthrough: false,
      index: false,
    })
  );

  const catalog: UIPaths = getUIPaths('catalog');
  const concourse: UIPaths = getUIPaths('concourse');
  const hub: UIPaths = getUIPaths('hub');
  const tools: UIPaths = getUIPaths('tools');

  app.get(/^\/catalog\/?$/i, (req: express.Request, res: express.Response): void => {
    res.redirect('/search', 308);
  });
  app.use('/catalog', serveStatic<express.Response>(catalog.dir));
  app.get('/catalog/*', (req: express.Request, res: express.Response): void => {
    res.sendFile(catalog.index);
  });

  app.get(/^\/(dataset|resource)(?:\/.*)?/i, (req: express.Request, res: express.Response): void => {
    res.redirect('/catalog' + req.path, 308);
  });

  app.use('/hub', serveStatic<express.Response>(hub.dir));
  app.get('/hub/*', (req: express.Request, res: express.Response): void => {
    res.sendFile(hub.index);
  });

  app.use(serveStatic<express.Response>(concourse.dir));
  app.get('*', (req: express.Request, res: express.Response): void => {
    res.sendFile(concourse.index);
  });

  app.use(errorHandler);

  const port: number = config.get('port');
  return new Promise((resolve: (value: http.Server) => void, reject: (cause: unknown) => void) => {
    try {
      const server: http.Server = app.listen(port, () => {
        const { address: host, port }: AddressInfo = server.address() as AddressInfo;
        logger.info(`Server listening at http://${host}:${port}`);
        resolve(server);
      });
    } catch (cause: unknown) {
      logger.error('Server failed to start; %O', cause);

      reject(cause);
    }
  });
}
