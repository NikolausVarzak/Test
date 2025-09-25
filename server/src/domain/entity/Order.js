import { v4 as uuidv4 } from 'uuid';

class Order {
  constructor({
    id,
    customerId,
    shoppingCartId,
    shippingAddress,
    billingAddress,
    paymentMethodType,
    currencyCode,
    orderNotes
  }) {
    if (!id) throw new Error('Order ID is required');
    if (!customerId) throw new Error('Customer ID is required');
    if (!shoppingCartId) throw new Error('Shopping Cart ID is required');
    if (!shippingAddress) throw new Error('Shipping address is required');
    if (!billingAddress) throw new Error('Billing address is required');
    if (!paymentMethodType) throw new Error('Payment method type is required');
    if (!currencyCode) throw new Error('Currency code is required');

    this.id = id;
    this.customerId = customerId;
    this.shoppingCartId = shoppingCartId;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.paymentMethodType = paymentMethodType;
    this.currencyCode = currencyCode;
    this.orderNotes = orderNotes;
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      shoppingCartId: this.shoppingCartId,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      paymentMethodType: this.paymentMethodType,
      currencyCode: this.currencyCode,
      orderNotes: this.orderNotes
    };
  }
}

export default Order;