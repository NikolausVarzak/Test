import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './confirm-order-given-stock-has-been-reserved-and-payment-has-been-approved-for-an-order.feature'));

defineFeature(feature, test => {
  let orderId;
  let confirmOrderResponse;

  const CURRENT_DATE = '2025-09-25T07:39:13.430Z';
  const EXPECTED_SHIPMENT_DATE = '2025-09-27T07:39:13.430Z'; // Example date a few days after current date

  test(
    'Given stock has been reserved and payment has been approved for an order; When the automation confirms the order; Then an Order Confirmed event is published.',
    ({ given, when, then }) => {
      given('stock has been reserved and payment has been approved for an order', async () => {
        const createOrderPayload = {
          customerId: 'CUST-001',
          shoppingCartId: 'CART-001',
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          paymentMethodType: 'Credit Card',
          currencyCode: 'USD',
          orderNotes: 'Gift wrap needed',
        };

        const createResponse = await request(app)
          .post('/api/v1/create-order')
          .send(createOrderPayload)
          .expect(200);

        orderId = createResponse.body.id;
        expect(orderId).toBeDefined();
      });

      when('the automation confirms the order', async () => {
        const confirmOrderPayload = {
          id: orderId,
          confirmationDate: CURRENT_DATE,
          confirmationChannel: 'AUTOMATION',
          expectedShipmentDate: EXPECTED_SHIPMENT_DATE,
        };

        confirmOrderResponse = await request(app)
          .post('/api/v1/confirm-order')
          .send(confirmOrderPayload);
      });

      then('an Order Confirmed event is published.', async () => {
        expect(confirmOrderResponse.statusCode).toBe(200);
        expect(confirmOrderResponse.body).toBeDefined();
        expect(confirmOrderResponse.body.id).toBe(orderId);
        expect(typeof confirmOrderResponse.body.customerId).toBe('string');
        expect(typeof confirmOrderResponse.body.shoppingCartId).toBe('string');
        expect(typeof confirmOrderResponse.body.shippingAddress).toBe('string');
        expect(typeof confirmOrderResponse.body.billingAddress).toBe('string');
        expect(typeof confirmOrderResponse.body.paymentMethodType).toBe('string');
        expect(typeof confirmOrderResponse.body.currencyCode).toBe('string');
      });
    }
  );
});