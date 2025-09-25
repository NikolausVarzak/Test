import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-order-given-customer-has-added-products.feature'));

defineFeature(feature, test => {
  let requestBody;
  let response;

  test(
    'Given a customer has added products to their shopping cart; When the customer confirms and creates the order; Then an Order Created event is published.',
    ({ given, when, then }) => {
      given('a customer has added products to their shopping cart', async () => {
        requestBody = {
          customerId: 'CUST-001',
          shoppingCartId: 'CART-001',
          shippingAddress: '123 Main St',
          billingAddress: '123 Main St',
          paymentMethodType: 'Credit Card',
          currencyCode: 'USD',
          orderNotes: 'Gift wrap needed',
        };
      });

      when('the customer confirms and creates the order', async () => {
        response = await request(app).post('/api/v1/create-order').send(requestBody);
      });

      then('an Order Created event is published.', async () => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(typeof response.body.id).toBe('string');
        expect(response.body.customerId).toBe(requestBody.customerId);
        expect(response.body.shoppingCartId).toBe(requestBody.shoppingCartId);
        expect(response.body.shippingAddress).toBe(requestBody.shippingAddress);
        expect(response.body.billingAddress).toBe(requestBody.billingAddress);
        expect(response.body.paymentMethodType).toBe(requestBody.paymentMethodType);
        expect(response.body.currencyCode).toBe(requestBody.currencyCode);
        expect(response.body.orderNotes).toBe(requestBody.orderNotes);
      });
    }
  );
});