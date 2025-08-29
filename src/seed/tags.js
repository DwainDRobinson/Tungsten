'use strict';

import logger from '../logger';
import models from '../models';

const tags = [
  {
    name: 'Puzzle',
    value: 'PUZZLE',
    description: 'Puzzle tag description'
  },
  {
    name: 'Daily',
    value: 'DAILY',
    description: 'Daily tag description'
  },
  {
    name: 'Timed',
    value: 'TIMED',
    description: 'Timed tag description'
  },
  {
    name: 'Bonus',
    value: 'BONUS',
    description: 'Bonus tag description'
  },
  {
    name: 'One-Time',
    value: 'ONE_TIME',
    description: 'One-Time tag description'
  }
];

const seedTags = async () => {
  const { Tag } = models;
  try {
    const count = await Tag.countDocuments();

    if (count > 0) {
      return;
    }

    await Tag.insertMany(tags);
  } catch (err) {
    logger.error(`Error seeding tag data into db: ${err.message}`);
    throw err;
  }
};

export { tags };
export default seedTags;
