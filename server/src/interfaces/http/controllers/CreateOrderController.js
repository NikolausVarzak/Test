import express from 'express';
import CreateOrderCommand from '../../../domain/command/CreateOrderCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { customerId, shoppingCartId, shippingAddress, billingAddress, paymentMethodType, currencyCode, orderNotes } = req.body;
    const result = await CreateOrderCommand.execute({
      customerId,
      shoppingCartId,
      shippingAddress,
      billingAddress,
      paymentMethodType,
      currencyCode,
      orderNotes,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/create-order',
  router,
};