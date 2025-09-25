Feature: Order Delivery

  Scenario: Given a shipment has been dispatched to a courier; When the courier successfully delivers the order to the customer; Then an Order Delivered event is published.
    Given a shipment has been dispatched to a courier
    When the courier successfully delivers the order to the customer
    Then an Order Delivered event is published