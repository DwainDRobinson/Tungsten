'use strict';

import { dropAllCollections } from '../database';
import logger from '../logger';
import { isProductionEnvironment } from '../utilities/boolean';
import seedCategories from './categories';
import seedDifficulties from './difficulties';
import seedPermissions from './permissions';
import seedRoles from './roles';
import seedStatuses from './statuses';
import seedTags from './tags';
import seedUsers from './users';

const seedData = async () => {
  try {
    if (isProductionEnvironment()) {
      logger.info('Seeding skipped: Running in production mode.');
      return;
    }

    await dropAllCollections();

    await Promise.all([
      seedCategories(),
      seedDifficulties(),
      seedStatuses(),
      seedPermissions(),
      seedTags(),
      seedRoles(),
      seedUsers()
    ]);
  } catch (err) {
    logger.error(`Error seeding data into db: ${err.message}`);
    throw err;
  }
};

export default seedData;
