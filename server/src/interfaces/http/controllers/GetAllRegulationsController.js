import express from 'express';
import GetAllRegulationsReadModel from '../../../domain/readmodel/GetAllRegulationsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const regulations = await GetAllRegulationsReadModel.query();
    res.status(200).json(regulations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-regulations',
  router,
};