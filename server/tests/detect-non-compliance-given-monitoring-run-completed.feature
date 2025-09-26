Feature: Detect Non-Compliance

  Scenario: A monitoring run has completed with findings. Automation detects an instance of non-compliance. A Non-Compliance Case is created, detailing the detected issue.
    Given A monitoring run has completed with findings.
    When Automation detects an instance of non-compliance.
    Then A Non-Compliance Case is created, detailing the detected issue.