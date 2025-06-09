import config, { NLSSConfiguration } from '../config';
import { BBRedis } from '@bbnpm/bbredis';
import RedisStoreSetup from 'connect-redis';
import session from 'express-session';
import Express from 'express';

const RedisStore: RedisStoreSetup.RedisStore = RedisStoreSetup(session);

const redisConfig: NLSSConfiguration['redis'] = config.get('redis');
const sessionIdConfig: NLSSConfiguration['sessionIdCookie'] = config.get('sessionIdCookie');

const redisStore = new RedisStore({
  client: new BBRedis(redisConfig.cacheName, redisConfig.cacheTier, { keyPrefix: 'SESSION:' }),
  prefix: '', // let bbredis handle the prefix
  ttl: sessionIdConfig.maxAge / 1000,
});

const appSession: Express.RequestHandler = session({
  proxy: true,
  secret: sessionIdConfig.secret,
  saveUninitialized: true,
  resave: false,
  name: 'session',
  rolling: true,
  cookie: { httpOnly: true, maxAge: sessionIdConfig.maxAge, secure: config.get('secureProtocol') },
  store: redisStore,
});

export default appSession;
