import express from 'express';
import GetActivePoliciesReadModel from '../../../domain/readmodel/GetActivePoliciesReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activePolicies = await GetActivePoliciesReadModel.query();
    res.status(200).json(activePolicies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-active-policies',
  router,
};