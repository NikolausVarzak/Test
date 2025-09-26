import { v4 as uuidv4 } from 'uuid';
import NonComplianceCase from '../entity/NonComplianceCase.js';
import db from '../../infrastructure/db/index.js';

class DetectNonComplianceCommand {
  static async execute({
    monitoringRunId,
    detectedPolicyId,
    issueDescription,
    detectedDate,
    severity,
  }) {
    // Given: A monitoring run has completed with findings.
    // When: Automation detects an instance of non-compliance.
    // Then: A Non-Compliance Case is created, detailing the detected issue.

    const id = uuidv4();

    const nonComplianceCase = new NonComplianceCase({
      id,
      monitoringRunId,
      detectedPolicyId,
      issueDescription,
      detectedDate,
      severity,
      // Default values for required fields not provided in the initial detection request
      reviewOutcome: 'Pending',
      reviewerId: 'N/A', // Automation detected, no human reviewer yet
      reviewDate: detectedDate, // As a placeholder, using the detection date
      // reviewComment is not required by OpenAPI and not part of initial detection
    });

    await db.insert('Non-Compliance Case', nonComplianceCase.toJSON());

    return nonComplianceCase.toJSON();
  }
}

export default DetectNonComplianceCommand;