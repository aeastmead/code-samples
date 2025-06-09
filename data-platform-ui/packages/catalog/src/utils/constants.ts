enum ResourceType {
  HDFS = 1,
  HIVE = 2,
  COMDB2 = 3,
  POSTGRESQL = 4,
  SQL_SERVER = 5,
  MYSQL = 6,
  GREENPLUM = 7,
  QVD = 8,
  BCS = 9
}
const getResourceType: (typeId?: number | ResourceType) => string | undefined = (typeId?: number | ResourceType) => {
  switch (typeId) {
    case ResourceType.HDFS: {
      return 'HDFS';
    }
    case ResourceType.HIVE: {
      return 'Hive';
    }
    case ResourceType.COMDB2: {
      return 'Comdb2';
    }
    case ResourceType.POSTGRESQL: {
      return 'PostgreSQL';
    }
    case ResourceType.SQL_SERVER: {
      return 'SQL Server';
    }
    case ResourceType.MYSQL: {
      return 'MySQL';
    }
    case ResourceType.GREENPLUM: {
      return 'Greenplum';
    }
    case ResourceType.QVD: {
      return 'QVD';
    }
    case ResourceType.BCS: {
      return 'BCS';
    }
  }
  return undefined;
};

export default {
  ResourceType,
  getResourceType,
  TERMINAL_FUNCTION_LIMIT: 63,
  BLINK_MESSAGE_PREFIX: 'MSG ',
  BLINK_BASE_URL: 'https://blinks.bloomberg.com/screens',
  CARD_NAME_TRUNCATE_LENGTH: 22,
  POLICY_TAG_TYPE_ID: 1
};
