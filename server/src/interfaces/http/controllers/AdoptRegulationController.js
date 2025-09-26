import express from 'express';
import AdoptRegulationCommand from '../../../domain/command/AdoptRegulationCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { regulationTitle, regulationNumber, issuingBody, effectiveDate } = req.body;
    const result = await AdoptRegulationCommand.execute({
      regulationTitle,
      regulationNumber,
      issuingBody,
      effectiveDate,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/adopt-regulation',
  router,
};