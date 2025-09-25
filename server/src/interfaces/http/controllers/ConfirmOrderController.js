import express from 'express';
import ConfirmOrderCommand from '../../../domain/command/ConfirmOrderCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, confirmationDate, confirmationChannel, expectedShipmentDate } = req.body;
    const result = await ConfirmOrderCommand.execute({
      id,
      confirmationDate,
      confirmationChannel,
      expectedShipmentDate,
    });
    res.status(200).json(result);
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

export default {
  routeBase: '/confirm-order',
  router,
};