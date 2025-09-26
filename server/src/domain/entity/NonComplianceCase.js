import { v4 as uuidv4 } from 'uuid';

class NonComplianceCase {
  constructor({
    id = uuidv4(),
    monitoringRunId,
    detectedPolicyId,
    issueDescription,
    detectedDate,
    severity,
    reviewOutcome,
    reviewerId,
    reviewDate,
    reviewComment
  }) {
    if (!monitoringRunId) throw new Error('monitoringRunId is required');
    if (!detectedPolicyId) throw new Error('detectedPolicyId is required');
    if (!issueDescription) throw new Error('issueDescription is required');
    if (!detectedDate) throw new Error('detectedDate is required');
    if (!severity) throw new Error('severity is required');
    if (!reviewOutcome) throw new Error('reviewOutcome is required');
    if (!reviewerId) throw new Error('reviewerId is required');
    if (!reviewDate) throw new Error('reviewDate is required');

    this.id = id;
    this.monitoringRunId = monitoringRunId;
    this.detectedPolicyId = detectedPolicyId;
    this.issueDescription = issueDescription;
    this.detectedDate = detectedDate;
    this.severity = severity;
    this.reviewOutcome = reviewOutcome;
    this.reviewerId = reviewerId;
    this.reviewDate = reviewDate;
    this.reviewComment = reviewComment;
  }

  toJSON() {
    return {
      id: this.id,
      monitoringRunId: this.monitoringRunId,
      detectedPolicyId: this.detectedPolicyId,
      issueDescription: this.issueDescription,
      detectedDate: this.detectedDate,
      severity: this.severity,
      reviewOutcome: this.reviewOutcome,
      reviewerId: this.reviewerId,
      reviewDate: this.reviewDate,
      reviewComment: this.reviewComment
    };
  }
}

export default NonComplianceCase;