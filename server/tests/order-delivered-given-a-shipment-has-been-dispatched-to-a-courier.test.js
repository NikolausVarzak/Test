import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'order-delivered-given-a-shipment-has-been-dispatched-to-a-courier.feature'));

defineFeature(feature, test => {
  let orderId;
  let deliverOrderResponse;

  const orderPayload = {
    customerId: 'CUST-001-TEST',
    shoppingCartId: 'CART-001-TEST',
    shippingAddress: '123 Main Street, Anytown',
    billingAddress: '123 Main Street, Anytown',
    paymentMethodType: 'Credit Card',
    currencyCode: 'USD',
    orderNotes: 'Fragile, handle with care.',
  };

  test(
    'Given a shipment has been dispatched to a courier; When the courier successfully delivers the order to the customer; Then an Order Delivered event is published.',
    ({ given, when, then }) => {
      given('a shipment has been dispatched to a courier', async () => {
        // Create an order
        const createOrderResponse = await request(app)
          .post('/api/v1/create-order')
          .send(orderPayload)
          .expect(200);

        orderId = createOrderResponse.body.id;

        // Confirm the order to simulate dispatch
        const confirmOrderPayload = {
          id: orderId,
          confirmationDate: '2025-09-25T07:39:31.663Z',
          confirmationChannel: 'Online',
          expectedShipmentDate: '2025-09-26T07:39:31.663Z',
        };

        const confirmOrderResponse = await request(app)
          .post('/api/v1/confirm-order')
          .send(confirmOrderPayload)
          .expect(200);

        expect(confirmOrderResponse.body.id).toBe(orderId);
      });

      when('the courier successfully delivers the order to the customer', async () => {
        const deliverOrderPayload = {
          id: orderId,
          shipmentId: 'SHIP-987654',
          deliveryDate: '2025-09-25T07:39:31.663Z',
          proofOfDelivery: 'Customer signature obtained',
          recipientNameConfirmed: 'Alice Smith',
          courierStaffId: 'COURIER-XYZ',
        };

        deliverOrderResponse = await request(app)
          .post('/api/v1/deliver-order')
          .send(deliverOrderPayload);
      });

      then('an Order Delivered event is published.', async () => {
        expect(deliverOrderResponse.statusCode).toBe(200);
        expect(deliverOrderResponse.body.id).toBe(orderId);
        expect(deliverOrderResponse.body.customerId).toBe(orderPayload.customerId);
        expect(deliverOrderResponse.body.shoppingCartId).toBe(orderPayload.shoppingCartId);
        expect(deliverOrderResponse.body.shippingAddress).toBe(orderPayload.shippingAddress);
        expect(deliverOrderResponse.body.billingAddress).toBe(orderPayload.billingAddress);
        expect(deliverOrderResponse.body.paymentMethodType).toBe(orderPayload.paymentMethodType);
        expect(deliverOrderResponse.body.currencyCode).toBe(orderPayload.currencyCode);
      });
    }
  );
});