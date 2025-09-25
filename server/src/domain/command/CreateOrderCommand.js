import { v4 as uuidv4 } from 'uuid';
import Order from '../entity/Order.js';
import db from '../../infrastructure/db/index.js';

class CreateOrderCommand {
  static async execute({ customerId, shoppingCartId, shippingAddress, billingAddress, paymentMethodType, currencyCode, orderNotes }) {
    const id = uuidv4();
    const order = new Order({
      id,
      customerId,
      shoppingCartId,
      shippingAddress,
      billingAddress,
      paymentMethodType,
      currencyCode,
      orderNotes,
    });

    await db.insert('Order', order.toJSON());
    return order.toJSON();
  }
}

export default CreateOrderCommand;