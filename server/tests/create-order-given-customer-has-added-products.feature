Feature: Order Management

  Scenario: Given a customer has added products to their shopping cart; When the customer confirms and creates the order; Then an Order Created event is published.
    Given a customer has added products to their shopping cart
    When the customer confirms and creates the order
    Then an Order Created event is published.