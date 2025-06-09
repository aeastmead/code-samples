import config, { NLSSConfiguration } from './config';
import winston from 'winston';

const consoleConfig: NLSSConfiguration['consoleLogger'] = config.get('consoleLogger');

const transports: winston.transport[] = [];

const namedFormat: () => winston.Logform.Format = winston.format((info: winston.Logform.TransformableInfo) => {
  info.name = 'datamarketplace';
  return info;
});

if (consoleConfig.enable) {
  const formats: winston.Logform.Format[] = [namedFormat(), winston.format.splat(), winston.format.timestamp()];

  if (consoleConfig.disableJSON) {
    formats.unshift(winston.format.colorize());
    formats.push(
      winston.format.printf(info => {
        let msg = `${info.timestamp} [${info.level}]: ${info.message}`;
        if (info.metadata) {
          msg += JSON.stringify(info.metadata);
        }
        return msg;
      })
    );
  } else {
    formats.push(winston.format.json());
  }

  transports.push(
    new winston.transports.Console({
      level: consoleConfig.level,
      format: winston.format.combine.apply(null, formats),
    })
  );
}

if (transports.length <= 0) {
  transports.push(
    new winston.transports.Console({
      level: 'error',
      silent: true,
      format: winston.format.json(),
    })
  );
}

const logger: winston.Logger = winston.createLogger({
  transports,
});

export default logger;
