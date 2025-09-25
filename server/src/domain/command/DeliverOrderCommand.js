import db from '../../infrastructure/db/index.js';

class DeliverOrderCommand {
  static async execute({ id, shipmentId, deliveryDate, proofOfDelivery, recipientNameConfirmed, courierStaffId }) {
    const orderCollectionName = 'Order'; // From Related Entity Information

    // 1. Given a shipment has been dispatched to a courier; When the courier successfully delivers the order to the customer;
    const existingOrder = await db.findById(orderCollectionName, id);

    if (!existingOrder) {
      throw new Error('Order not found');
    }

    // Prepare updates with delivery details.
    // The `sqliteAdapter.update` will merge these into the existing order data.
    // This allows storing delivery information without needing to modify the `Order` entity's explicit schema.
    const updates = {
      // id is required for the update lookup but also can be part of the updated data
      id,
      shipmentId,
      deliveryDate,
      proofOfDelivery,
      recipientNameConfirmed,
      courierStaffId,
    };

    const updatedOrderWithDeliveryDetails = await db.update(orderCollectionName, id, updates);

    // 2. Then an Order Delivered event is published. (This implies a successful outcome and state change)
    // To strictly conform to OpenAPI response schema, we filter the returned object
    // to only include fields defined in the `Order` schema.
    const finalOrderResponse = {
      id: updatedOrderWithDeliveryDetails.id,
      customerId: updatedOrderWithDeliveryDetails.customerId,
      shoppingCartId: updatedOrderWithDeliveryDetails.shoppingCartId,
      shippingAddress: updatedOrderWithDeliveryDetails.shippingAddress,
      billingAddress: updatedOrderWithDeliveryDetails.billingAddress,
      paymentMethodType: updatedOrderWithDeliveryDetails.paymentMethodType,
      currencyCode: updatedOrderWithDeliveryDetails.currencyCode,
      orderNotes: updatedOrderWithDeliveryDetails.orderNotes,
    };

    return finalOrderResponse;
  }
}

export default DeliverOrderCommand;