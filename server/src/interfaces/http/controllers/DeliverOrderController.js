import express from 'express';
import DeliverOrderCommand from '../../../domain/command/DeliverOrderCommand.js';

const router = express.Router();
const routeBase = '/deliver-order'; // From OpenAPI Specification paths

router.post('/', async (req, res) => {
  try {
    // Extract all fields from the request body as defined by the DeliverOrderRequest schema
    const { id, shipmentId, deliveryDate, proofOfDelivery, recipientNameConfirmed, courierStaffId } = req.body;

    const result = await DeliverOrderCommand.execute({
      id,
      shipmentId,
      deliveryDate,
      proofOfDelivery,
      recipientNameConfirmed,
      courierStaffId,
    });
    res.status(200).json(result); // OpenAPI specifies 200 OK
  } catch (err) {
    if (err.message === 'Order not found') {
      res.status(404).json({ message: err.message }); // OpenAPI specifies 404 Not Found
    } else {
      res.status(400).json({ message: err.message }); // OpenAPI specifies 400 Bad Request
    }
  }
});

export default {
  routeBase,
  router,
};