'use strict';

import logger from '../logger';
import models from '../models';

const statuses = [
  {
    name: 'Created',
    value: 'CREATED',
    description: 'Created status description'
  },
  {
    name: 'In-Progress',
    value: 'INPROGRESS',
    description: 'In-Progress status description'
  },
  {
    name: 'Completed',
    value: 'COMPLETED',
    description: 'Completed status description'
  },
  {
    name: 'Cancelled',
    value: 'CANCELLED',
    description: 'Cancelled status description'
  }
];

const seedStatuses = async () => {
  const { Status } = models;
  try {
    const count = await Status.countDocuments();

    if (count > 0) {
      return;
    }

    statuses.forEach(status => {
      const newStatus = new Status(status);
      newStatus.save();
    });
  } catch (err) {
    logger.error(`Error seeding status data into db: ${err.message}`);
    throw err;
  }
};

export { statuses };
export default seedStatuses;
