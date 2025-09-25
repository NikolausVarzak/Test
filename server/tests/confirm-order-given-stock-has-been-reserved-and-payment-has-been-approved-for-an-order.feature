Feature: Order Confirmation

  Scenario: Given stock has been reserved and payment has been approved for an order; When the automation confirms the order; Then an Order Confirmed event is published.
    Given stock has been reserved and payment has been approved for an order
    When the automation confirms the order
    Then an Order Confirmed event is published.