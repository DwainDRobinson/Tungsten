'use strict';

import logger from '../logger';
import models from '../models';

const seedTags = async () => {
  const { Tag } = models;
  try {
    const count = await Tag.countDocuments();

    if (count > 0) {
      return;
    }

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

    tags.forEach(tag => {
      const newTag = new Tag(tag);
      newTag.save();
    });
  } catch (err) {
    logger.error(`Error seeding tag data into db: ${err.message}`);
    throw err;
  }
};

export default seedTags;
