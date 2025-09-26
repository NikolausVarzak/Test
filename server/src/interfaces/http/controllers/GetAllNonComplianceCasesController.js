import express from 'express';
import GetAllNonComplianceCasesReadModel from '../../../domain/readmodel/GetAllNonComplianceCasesReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nonComplianceCases = await GetAllNonComplianceCasesReadModel.query();
    res.status(200).json(nonComplianceCases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-non-compliance-cases',
  router,
};