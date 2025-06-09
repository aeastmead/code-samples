import convict from 'convict';
import { BBRedisTier } from '@bbnpm/bbredis';
import path from 'path';

export const enum EnvironmentType {
  BETA = 'beta',
  CI = 'ci',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const enum LoggingLevel {
  ERROR = 'error',
  WARN = 'warn',
  HELP = 'help',
  DATA = 'data',
  INFO = 'info',
  DEBUG = 'debug',
  PROMPT = 'prompt',
  VERBOSE = 'verbose',
  INPUT = 'input',
  SILLY = 'silly',
}

const enum LocalMode {
  CATALOG = 'catalog',
  CONCOURSE = 'concourse',
  HUB = 'hub',
  TOOLS = 'tools',
  // Local build.
  BUILT = 'built',
}

export interface NLSSConfiguration {
  env: EnvironmentType;
  port: number;
  /**
   * Whether the server is running with "https://" or "http://". Applicable to session id's cookie and SAML request
   */
  secureProtocol: boolean;

  /**
   * Helper for setting callbackUrl Local
   */
  localMode: LocalMode | null;

  bsso: {
    callbackUrl: string | null;
    path: string;
    entryPoint: string;
    issuer: string;
    cert: string;
    privateKey: string;
  };
  apis: {
    catalog: {
      url: string;
      /**
       * JWT secret
       */
      secret: string;
      kid: number;
    };
    qsenAPIService: {
      baseUrl: string;
      /**
       * username of client user
       */
      username: string;
      /**
       * encrypted token
       */
      secret: string;
    };
    gpMgrService: {
      baseUrl: string;
      /**
       * BB CIS gateway clientId for service
       */
      clientId: string;
      /**
       * BB CIS gateway sercret for service
       */
      secret: string;
      region: string;
    };
    qliksenseAPIService: {
      baseUrl: string;
      /**
       * BB CIS gateway clientId for service
       */
      clientId: string;
      /**
       * BB CIS gateway sercret for service
       */
      secret: string;
      region: string;
    };
  };
  redis: {
    cacheTier: BBRedisTier;
    cacheName: string;
  };
  sessionIdCookie: {
    secret: string;
    maxAge: number;
  };
  fileLogger: {
    enable: boolean;
    level: LoggingLevel;
    path: string;
  };

  consoleLogger: {
    enable: boolean;
    disableJSON: boolean;
    level: LoggingLevel;
  };
}

const config: convict.Config<NLSSConfiguration> = convict<NLSSConfiguration>({
  env: {
    env: 'NODE_ENV',
    default: null,
    format: [
      EnvironmentType.LOCAL,
      EnvironmentType.DEVELOPMENT,
      EnvironmentType.CI,
      EnvironmentType.BETA,
      EnvironmentType.PRODUCTION,
      EnvironmentType.TEST,
    ],
    nullable: false,
  },
  port: {
    doc: 'HTTP Port to listen on',
    format: 'port',
    default: 9123,
    arg: 'port',
    env: 'PORT',
  },
  localMode: {
    default: null,
    format: [LocalMode.HUB, LocalMode.CONCOURSE, LocalMode.CATALOG, LocalMode.TOOLS, LocalMode.BUILT],
    env: 'LOCAL_MODE',
    nullable: true,
  },
  fileLogger: {
    enable: {
      format: Boolean,
      default: true,
      arg: 'logging-file-enable',
      env: 'LOGGING_FILE_ENABLE',
    },
    level: {
      format: [
        LoggingLevel.ERROR,
        LoggingLevel.WARN,
        LoggingLevel.HELP,
        LoggingLevel.DATA,
        LoggingLevel.INFO,
        LoggingLevel.DEBUG,
        LoggingLevel.PROMPT,
        LoggingLevel.VERBOSE,
        LoggingLevel.INPUT,
        LoggingLevel.SILLY,
      ],
      default: LoggingLevel.INFO,
      arg: 'logging-file-level',
      env: 'LOGGING_FILE_LEVEL',
    },
    path: {
      format: String,
      default: 'datamarketplace.log',
      arg: 'logging-file-path',
      env: 'LOGGING_FILE_PATH',
    },
  },
  consoleLogger: {
    enable: {
      format: Boolean,
      default: true,
      arg: 'logging-stdout-enable',
      env: 'LOGGING_STDOUT_ENABLE',
    },
    disableJSON: {
      format: Boolean,
      default: false,
      arg: 'logging-stdout-disable-json',
      env: 'LOGGING_STDOUT_DISABLE_JSON',
      doc: 'log as plain text instead of json',
    },
    level: {
      format: [
        LoggingLevel.ERROR,
        LoggingLevel.WARN,
        LoggingLevel.HELP,
        LoggingLevel.DATA,
        LoggingLevel.INFO,
        LoggingLevel.DEBUG,
        LoggingLevel.PROMPT,
        LoggingLevel.VERBOSE,
        LoggingLevel.INPUT,
        LoggingLevel.SILLY,
      ],
      default: LoggingLevel.INFO,
      arg: 'logging-stdout-level',
      env: 'LOGGING_STDOUT_LEVEL',
    },
  },
  bsso: {
    callbackUrl: {
      doc: 'The full callback url when going to a different endpoint than the original, if empty path is used',
      format: String,
      default: null,
      arg: 'bsso-callback-url',
      env: 'BSSO_CALLBACK_URL',
      nullable: true,
    },
    cert: {
      doc: 'The x509 certificate for BSSO',
      format: String,
      default: null,
      arg: 'bsso-cert',
      env: 'BSSO_CERT',
      nullable: false,
      sensitive: true,
    },
    entryPoint: {
      doc: 'URL to call for BSSO initialization',
      format: String,
      default: 'https://bssobeta.blpprofessional.com/idp/SSO.saml2',
      arg: 'bsso-entry-point',
      env: 'BSSO_ENTRY_POINT',
    },
    issuer: {
      doc: 'The website of the bsso call',
      format: String,
      default: 'datamarketplace.dev.bloomberg.com',
      arg: 'bsso-issuer',
      env: 'BSSO_ISSUER',
    },
    path: {
      doc: 'The path of the bsso callback, overridden by callbackUrl if that is specified',
      format: String,
      default: '/bsso/login/callback',
      arg: 'bsso-callback-path',
      env: 'BSSO_CALLBACK_PATH',
    },
    privateKey: {
      doc: 'The private key for BSSO',
      format: String,
      default: null,
      arg: 'bsso-private-key',
      env: 'BSSO_PRIVATE_KEY',
      nullable: false,
      sensitive: true,
    },
  },
  apis: {
    catalog: {
      url: {
        default: 'https://analysis-api-ci.dev.bloomberg.com',
        format: String,
        arg: 'api-endpoints-graph',
        env: 'API_ENDPOINT_GRAPH',
      },
      secret: {
        default: null,
        format: String,
        arg: 'secrets-graph',
        env: 'SECRETS_GRAPH',
        nullable: false,
        sensitive: true,
      },
      kid: {
        format: 'int',
        default: 1,
        arg: 'constants-graph-client-id',
        env: 'CONSTANTS_GRAPH_CLIENT_ID',
      },
    },
    qsenAPIService: {
      baseUrl: {
        default: 'https://qsenapi.dev.bloomberg.com/hub/v1',
        format: String,
        env: 'API_QSENAPI_BASE_URL',
      },
      username: {
        default: 'mrubbo',
        format: String,
        env: 'API_QSENAPI_USERNAME',
      },
      secret: {
        default: null,
        format: String,
        env: 'API_QSENAPI_SECRET',
      },
    },
    gpMgrService: {
      baseUrl: {
        default: 'https://internal-dev-api.dev.bloomberg.com/bi/sre',
        format: String,
        env: 'API_GPMGR_BASE_URL',
      },
      clientId: {
        //default: null,
        default: 'e714648c9259ff507963887c0bd91371',
        format: String,
        env: 'API_GPMGR_CLIENTID',
      },
      secret: {
        //default: null,
        default: '32b28778882f20c05e527de4483be7eb86d6aa145bc9d1ade9470f647e633abb',
        format: String,
        env: 'API_GPMGR_SECRET',
      },
      region: {
        //default: null,
        default: 'ny',
        format: String,
        env: 'API_GPMGR_REGION',
      },
    },
    qliksenseAPIService: {
      baseUrl: {
        default: 'https://internal-dev-api.dev.bloomberg.com/bi/qliksense',
        format: String,
        env: 'API_QLIKAPI_BASE_URL',
      },
      clientId: {
        //default: null,
        default: 'e714648c9259ff507963887c0bd91371',
        format: String,
        env: 'API_QLIKAPI_CLIENTID',
      },
      secret: {
        //default: null,
        default: '32b28778882f20c05e527de4483be7eb86d6aa145bc9d1ade9470f647e633abb',
        format: String,
        env: 'API_QLIKAPI_SECRET',
      },
      region: {
        //default: null,
        default: 'ny',
        format: String,
        env: 'API_QLIKAPI_REGION',
      },
    },
  },
  redis: {
    cacheName: {
      doc: 'Name of the bbredis cache',
      format: String,
      default: 'nlss-redis-dev',
      arg: 'redis-cache-name',
      env: 'REDIS_CACHE_NAME',
    },
    cacheTier: {
      doc: 'Name of the bbredis tier',
      format: [
        BBRedisTier.ALPHA,
        BBRedisTier.BETA,
        BBRedisTier.DEV,
        BBRedisTier.PALPHA,
        BBRedisTier.PROD,
        BBRedisTier.DMZ,
      ],
      default: BBRedisTier.DEV,
      arg: 'redis-cache-tier',
      env: 'REDIS_CACHE_TIER',
    },
    keyPrefix: {
      default: 'SESSION:',
      format: String,
      env: 'REDIS_KEY_PREFIX',
    },
  },
  sessionIdCookie: {
    maxAge: {
      doc: 'The max age of the cookie in milliseconds',
      format: 'int',
      default: 7200000, // unit: milliseconds, currently 2 hours
      arg: 'cookie-max-age',
      env: 'COOKIE_MAX_AGE',
    },
    secret: {
      doc: 'Secret for the cookie encryption',
      format: String,
      default: 'uYuL8zegTFqRhErUu4HKW50aj3j0g9pKlGtNbVTBekslwutvlRnQAPwvb71a',
      arg: 'cookie-secret',
      env: 'COOKIE_SECRET',
    },
  },
  secureProtocol: {
    doc: 'If the cookies should be marked secure',
    format: Boolean,
    default: true,
    arg: 'cookie-secure',
    env: 'COOKIE_SECURE',
  },
});

const BSSO_PATH: string = config.get('bsso.path');

function modeToBSSOCallback(mode: LocalMode): string {
  let port: number = 4000;
  switch (mode) {
    case LocalMode.CONCOURSE: {
      port = 3000;
      break;
    }
    case LocalMode.HUB: {
      port = 4040;
      break;
    }
    case LocalMode.TOOLS: {
      port = 4050;
      break;
    }
    case LocalMode.BUILT: {
      port = config.get('port');
      break;
    }
  }

  return `http://localhost:${port}${BSSO_PATH}`;
}

const baseConfigDir = path.join(__dirname, '../../../config');

const env: EnvironmentType = config.get('env');

const configFile = path.join(baseConfigDir, `${env}.json`);
config.loadFile(configFile);

const localMode: LocalMode | null = config.get('localMode');

/**
 * Overriding config file's value with environment variable.
 *
 * Used locally for the separate app servers
 */
if (env === EnvironmentType.LOCAL && localMode !== null) {
  const modeCB: string = modeToBSSOCallback(localMode);
  config.set('bsso.callbackUrl', modeCB);
}

config.validate({
  strict: true,
});

export default config;
