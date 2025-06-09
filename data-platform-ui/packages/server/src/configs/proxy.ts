import express from 'express';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import config, { NLSSConfiguration } from '../config';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import createHttpError from 'http-errors';
import logger from '../logger';
import https from 'https';
import { v4 } from 'uuid';

interface CatalogJWTPayload {
  id: number;
  uuid: number;
  pvfLevels: string[];
}

interface QsenapiJWTPayload {
  username: string;
}

interface GpmgrJWTPayload {
  //exp: number;
  iat: number;
  nbf: number;
  iss: string;
  request_id: string;
  path: string;
  host: string;
  method: string;
  region: string;
}

interface QliksenseAPIJWTPayload {
  iat: number;
  nbf: number;
  iss: string;
  request_id: string;
  path: string;
  host: string;
  method: string;
  region: string;
}

const catalogConfig: NLSSConfiguration['apis']['catalog'] = config.get('apis.catalog');

const CATALOG_SECRET = Buffer.from(catalogConfig.secret, 'base64');

function createJWT(user: Express.User): string {
  // @TODO: Find out if this is needed
  const jwtid = crypto.randomBytes(48).toString('hex');

  const payload: CatalogJWTPayload = {
    id: catalogConfig.kid,
    uuid: user.id,
    pvfLevels: user.pvfLevels,
  };

  return jsonwebtoken.sign(payload, CATALOG_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
    jwtid,
  });
}

export async function catalogProxy(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  let response: AxiosResponse;
  const jwt: string = createJWT(req.user as any);
  try {
    response = await axios.post(catalogConfig.url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'x-analysis-jwt': jwt,
      },
    });
  } catch (cause: unknown) {
    if (!axios.isAxiosError(cause) || cause.response === undefined) {
      next(cause);
      return;
    }

    response = cause.response;
  }

  res.status(response.status).json(response.data);
}

const qsenapiServiceConfig: NLSSConfiguration['apis']['qsenAPIService'] = config.get('apis.qsenAPIService');

const qsenapiClient: AxiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

/**
 * QSen API's signed JWT creation.
 * Note: JWTs are constructed separately to allow for independent and unimpeded key management.
 * @param user
 */
function createQsenapiToken(user: Express.User): string {
  const payload: QsenapiJWTPayload = {
    username: user.username,
    /**
     * Uncomment when ready
     */
    // pvfLevels: user.pvfLevels,
  };
  return jsonwebtoken.sign(payload, qsenapiServiceConfig.secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

/**
 * Creates axios request and jwt for QSen rest endpoints.
 *
 * @param req
 */
function createQsenapiProxyRequestConfig<TReqBody = unknown>(
  req: express.Request<unknown, unknown, TReqBody> & Express.AuthenticatedRequest
): Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> {
  const token: string = createQsenapiToken(req.user);

  const result: Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> = {
    url: `${qsenapiServiceConfig.baseUrl}${req.url}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const method: string = req.method.toUpperCase().trim();

  switch (method) {
    case 'POST':
    case 'PATCH':
    case 'PUT': {
      result.method = method;
      result.data = req.body;
      break;
    }
    case 'DELETE':
    case 'HEAD':
    case 'OPTIONS': {
      result.method = method;
      break;
    }
  }

  return result;
}

export async function qsenapiProxy<TReqBody = unknown>(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  if (!req.isAuthenticated()) {
    next(new createHttpError.Unauthorized());
    return;
  }

  let response: AxiosResponse;

  const requestConfig: Pick<
    AxiosRequestConfig<TReqBody>,
    'method' | 'url' | 'data' | 'headers'
  > = createQsenapiProxyRequestConfig(req);

  logger.debug(`dashboards ${requestConfig.method} path[${requestConfig.url}]`);

  try {
    response = await qsenapiClient.request(requestConfig);
  } catch (cause: unknown) {
    if (!axios.isAxiosError(cause)) {
      logger.error(
        '#BI #Proxy - Rejected proxy call; request[url=%s, method=%s, data=%o]; error %o',
        requestConfig.url,
        requestConfig.method,
        requestConfig.data,
        cause
      );
      next(new createHttpError.InternalServerError('Unable to complete request'));
      return;
    }
    if (cause.response === undefined) {
      next(new createHttpError.BadRequest(cause.message));
      return;
    }

    response = cause.response;
  }

  logger.debug(`dashboards [response]: status ${response.status}`);
  res.status(response.status).json(response.data);
}

const GpmgrAPIConfig: NLSSConfiguration['apis']['gpMgrService'] = config.get('apis.gpMgrService');

/**
 * signed JWT creation.
 * Note: JWTs are constructed separately to allow for independent and unimpeded key management.
 */

function createGpmgrAPIToken(redirecturlstring: string, reqmethod: string): string {
  /* current bare minimum jwt for bpaas/cis bisrebackup rest service
      const payload = {
          'exp': iat + JWT_EXPIRATION,
          'iat': iat,
          'nbf': iat,
          'iss': clientId,
          'method': request.method,
          'path': path,
          'host': host,
          'request_id': requestId,
          'region': 'ny'
      };
  */

  const iat = Math.floor(Date.now() / 1000);
  //const JWT_EXPIRATION = 30; // seconds
  const requestId = v4();
  const redirectURL: URL = new URL(redirecturlstring);
  const host = redirectURL.host;
  const path = redirectURL.pathname;

  const payload: GpmgrJWTPayload = {
    //exp: iat + JWT_EXPIRATION,
    iat: iat,
    nbf: iat,
    iss: GpmgrAPIConfig.clientId,
    request_id: requestId,
    path: path,
    host: host,
    method: reqmethod,
    region: GpmgrAPIConfig.region,
  };

  //convert from value provided in Hex
  const clientSecretBlob = Buffer.from(GpmgrAPIConfig.secret, 'hex');

  return jsonwebtoken.sign(payload, clientSecretBlob, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

/**
 * Creates axios request and jwt for rest endpoints.
 *
 * @param req
 */
function createGpmgrAPIConfigProxyRequestConfig<TReqBody = unknown>(
  req: express.Request<unknown, unknown, TReqBody> & Express.AuthenticatedRequest
): Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> {
  const token: string = createGpmgrAPIToken(`${GpmgrAPIConfig.baseUrl}${req.url}`, req.method.toUpperCase().trim());

  const result: Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> = {
    url: `${GpmgrAPIConfig.baseUrl}${req.url}`,
    method: 'GET',
    headers: {
      JWT: `${token}`,
    },
  };

  const method: string = req.method.toUpperCase().trim();

  switch (method) {
    case 'POST':
    case 'PATCH':
    case 'PUT': {
      result.method = method;
      result.data = req.body;
      break;
    }
    case 'DELETE':
    case 'HEAD':
    case 'OPTIONS': {
      result.method = method;
      break;
    }
  }

  return result;
}

export async function gpmgrProxy<TReqBody = unknown>(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  if (!req.isAuthenticated()) {
    next(new createHttpError.Unauthorized());
    return;
  }

  let response: AxiosResponse;

  const requestConfig: Pick<
    AxiosRequestConfig<TReqBody>,
    'method' | 'url' | 'data' | 'headers'
  > = createGpmgrAPIConfigProxyRequestConfig(req);

  logger.debug(`tools ${requestConfig.method} path[${requestConfig.url}]`);

  try {
    response = await axios.request(requestConfig);
  } catch (cause: unknown) {
    if (!axios.isAxiosError(cause)) {
      logger.error(
        '#BI #Proxy - Rejected proxy call; request[url=%s, method=%s, data=%o]; error %o',
        requestConfig.url,
        requestConfig.method,
        requestConfig.data,
        cause
      );
      next(new createHttpError.InternalServerError('Unable to complete request'));
      return;
    }
    if (cause.response === undefined) {
      next(new createHttpError.BadRequest(cause.message));
      return;
    }

    response = cause.response;
  }

  logger.debug(`tools [response]: status ${response.status}`);
  res.status(response.status).json(response.data);
}

const QliksenseAPIConfig: NLSSConfiguration['apis']['qliksenseAPIService'] = config.get('apis.qliksenseAPIService');
/**
 * signed JWT creation.
 * Note: JWTs are constructed separately to allow for independent and unimpeded key management.
 */
function createQliksenseAPIToken(redirecturlstring: string, reqmethod: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const requestId = v4();
  const redirectURL: URL = new URL(redirecturlstring);
  const host = redirectURL.host;
  const path = redirectURL.pathname;

  const payload: QliksenseAPIJWTPayload = {
    iat: iat,
    nbf: iat,
    iss: QliksenseAPIConfig.clientId,
    request_id: requestId,
    path: path,
    host: host,
    method: reqmethod,
    region: QliksenseAPIConfig.region,
  };

  //convert from value provided in Hex
  const clientSecretBlob = Buffer.from(QliksenseAPIConfig.secret, 'hex');

  return jsonwebtoken.sign(payload, clientSecretBlob, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

/**
 * Creates axios request and jwt for rest endpoints.
 *
 * @param req
 */
function createQliksenseAPIConfigProxyRequestConfig<TReqBody = unknown>(
  req: express.Request<unknown, unknown, TReqBody> & Express.AuthenticatedRequest
): Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> {
  const token: string = createQliksenseAPIToken(
    `${QliksenseAPIConfig.baseUrl}${req.url}`,
    req.method.toUpperCase().trim()
  );

  const result: Pick<AxiosRequestConfig<TReqBody>, 'method' | 'url' | 'data' | 'headers'> = {
    url: `${QliksenseAPIConfig.baseUrl}${req.url}`,
    method: 'GET',
    headers: {
      JWT: `${token}`,
    },
  };

  const method: string = req.method.toUpperCase().trim();

  switch (method) {
    case 'POST':
    case 'PATCH':
    case 'PUT': {
      result.method = method;
      result.data = req.body;
      break;
    }
    case 'DELETE':
    case 'HEAD':
    case 'OPTIONS': {
      result.method = method;
      break;
    }
  }

  return result;
}

export async function qliksenseAPIProxy<TReqBody = unknown>(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  if (!req.isAuthenticated()) {
    next(new createHttpError.Unauthorized());
    return;
  }

  let response: AxiosResponse;

  const requestConfig: Pick<
    AxiosRequestConfig<TReqBody>,
    'method' | 'url' | 'data' | 'headers'
  > = createQliksenseAPIConfigProxyRequestConfig(req);

  logger.debug(`tools ${requestConfig.method} path[${requestConfig.url}]`);

  try {
    response = await axios.request(requestConfig);
  } catch (cause: unknown) {
    if (!axios.isAxiosError(cause)) {
      logger.error(
        '#BI #Proxy - Rejected proxy call; request[url=%s, method=%s, data=%o]; error %o',
        requestConfig.url,
        requestConfig.method,
        requestConfig.data,
        cause
      );
      next(new createHttpError.InternalServerError('Unable to complete request'));
      return;
    }
    if (cause.response === undefined) {
      next(new createHttpError.BadRequest(cause.message));
      return;
    }

    response = cause.response;
  }

  logger.debug(`tools [response]: status ${response.status}`);
  res.status(response.status).json(response.data);
}
