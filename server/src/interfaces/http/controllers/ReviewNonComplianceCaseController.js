import express from 'express';
import ReviewNonComplianceCaseCommand from '../../../domain/command/ReviewNonComplianceCaseCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, reviewComment, reviewOutcome, reviewerId, reviewDate } = req.body;

    const result = await ReviewNonComplianceCaseCommand.execute({
      id,
      reviewComment,
      reviewOutcome,
      reviewerId,
      reviewDate,
    });
    res.status(200).json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

export default {
  routeBase: '/review-non-compliance-case',
  router,
};