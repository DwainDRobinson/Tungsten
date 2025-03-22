'use strict';

import logger from '../logger';
import models from '../models';

const seedDifficulties = async () => {
  const { Difficulty } = models;
  try {
    const count = await Difficulty.countDocuments();

    if (count > 0) {
      return;
    }

    const difficulties = [
      {
        name: 'Easy',
        value: 'EASY',
        description: 'Easy diffculty description'
      },
      {
        name: 'Medium',
        value: 'MEDIUM',
        description: 'Medium diffculty description'
      },
      {
        name: 'Hard',
        value: 'HARD',
        description: 'Hard diffculty description'
      }
    ];

    difficulties.forEach(difficulty => {
      const newDifficulty = new Difficulty(difficulty);
      newDifficulty.save();
    });
  } catch (err) {
    logger.error(`Error seeding difficulty data into db: ${err.message}`);
    throw err;
  }
};

export default seedDifficulties;
