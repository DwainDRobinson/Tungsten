'use strict';

import logger from '../logger';
import models from '../models';

const seedCategories = async () => {
  const { Category } = models;
  try {
    const count = await Category.countDocuments();

    if (count > 0) {
      return;
    }

    const categories = [
      {
        name: 'Cognitive Development & Memory Training',
        value: 'COGNITIVE',
        description:
          'Boost cognitive skills and memory with engaging puzzles! Solve pattern recognition challenges, memory-matching games, and sequence-based puzzles designed to enhance recall, focus, and problem-solving. Strengthen neural connections while having fun with interactive brain-training tasks!'
      },
      {
        name: 'Motor Skills & Coordination',
        value: 'MOTOR',
        description:
          'Engage in puzzles that enhance fine motor skills and hand-eye coordination. Solve jigsaw puzzles, trace mazes, and manipulate tactile pieces to build dexterity. These activities support muscle control, spatial awareness, and cognitive-motor integration in a fun way!'
      },
      {
        name: 'Emotional & Social Therapy',
        value: 'SOCIAL',
        description:
          'Engage in puzzles designed to enhance emotional awareness and social skills. Solve story-based challenges, match facial expressions to emotions, and complete cooperative puzzles that encourage communication, empathy, and connection in a supportive, interactive way.'
      },
      {
        name: 'Sensory-Friendly & Mindfulness Puzzles',
        value: 'SENSORY',
        description:
          'Engage in calming, sensory-friendly puzzles designed to promote relaxation and mindfulness. Enjoy visually simple challenges, color-matching games, and guided breathing exercises that help reduce stress, improve focus, and create a soothing, therapeutic experience.'
      },
      {
        name: 'Speech & Language Therapy Puzzles',
        value: 'SPEECH',
        description:
          'Engage in fun, interactive puzzles designed to enhance speech and language skills. Solve rhyming word challenges, complete fill-in-the-blank stories, and sort words by category. These activities help improve vocabulary, pronunciation, and cognitive associations in an enjoyable way!'
      },
      {
        name: 'Executive Function & Focus Training',
        value: 'EXECUTIVE',
        description:
          'Executive Function & Focus Training tasks are designed to improve planning, problem-solving, time management, and concentration. Users engage in step-by-step logic puzzles, time-based challenges, and order-sequencing tasks to boost cognitive flexibility and focus.'
      }
    ];

    categories.forEach(user => {
      const newCategories = new Category(user);
      newCategories.save();
    });
  } catch (err) {
    logger.error(`Error seeding catageory data into db: ${err.message}`);
    throw err;
  }
};

export default seedCategories;
