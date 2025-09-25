import express from 'express';
import GetAllOrdersReadModel from '../../../domain/readmodel/GetAllOrdersReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await GetAllOrdersReadModel.query();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-orders',
  router,
};