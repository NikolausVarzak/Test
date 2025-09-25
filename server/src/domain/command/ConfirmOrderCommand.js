import db from '../../infrastructure/db/index.js';

class ConfirmOrderCommand {
  static async execute({ id, confirmationDate, confirmationChannel, expectedShipmentDate }) {
    if (!id) {
      const error = new Error('Order ID is required.');
      error.statusCode = 400;
      throw error;
    }

    let order = await db.findById('Order', id);

    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    const updates = {
      confirmationDate,
      confirmationChannel,
      expectedShipmentDate,
      // The GWT implies an "Order Confirmed event is published."
      // As there's no explicit 'status' field in the OpenAPI Order schema,
      // and we cannot invent fields, we primarily apply the confirmation details.
    };

    const updatedOrder = await db.update('Order', id, updates);

    // Strictly conform to OpenAPI Order schema for the response
    // Filter out any properties from the database that are not part of the defined Order schema.
    const orderSchemaFields = [
      'id', 'customerId', 'shoppingCartId', 'shippingAddress', 'billingAddress',
      'paymentMethodType', 'currencyCode', 'orderNotes'
    ];

    const responseOrder = {};
    for (const field of orderSchemaFields) {
      if (updatedOrder && updatedOrder[field] !== undefined) {
        responseOrder[field] = updatedOrder[field];
      }
    }

    return responseOrder;
  }
}

export default ConfirmOrderCommand;