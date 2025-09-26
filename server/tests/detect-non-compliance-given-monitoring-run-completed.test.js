import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'detect-non-compliance-given-monitoring-run-completed.feature'));

defineFeature(feature, test => {
  let monitoringRunId;
  let detectedPolicyId;
  let regulationId;
  let nonComplianceCaseRequest;
  let createNonComplianceCaseResponse;

  const CURRENT_DATE = '2025-09-26'; // For detectedDate
  const CURRENT_TIMESTAMP = '2025-09-26T11:04:53.006Z'; // For runTimestamp and reviewDate

  test(
    'A monitoring run has completed with findings. Automation detects an instance of non-compliance. A Non-Compliance Case is created, detailing the detected issue.',
    ({ given, when, then }) => {

      given('A monitoring run has completed with findings.', async () => {
        // First, adopt a regulation
        const adoptRegulationPayload = {
          regulationTitle: 'Data Protection Regulation X',
          regulationNumber: 'DPR-X-2025',
          issuingBody: 'Global Data Council',
          effectiveDate: '2025-01-01',
          description: 'A new global data protection regulation.'
        };
        const adoptRegulationRes = await request(app)
          .post('/api/v1/adopt-regulation')
          .send(adoptRegulationPayload);
        expect(adoptRegulationRes.statusCode).toBe(200);
        regulationId = adoptRegulationRes.body.id;

        // Then, define a policy linked to the regulation
        const definePolicyPayload = {
          regulationId: regulationId,
          policyTitle: 'Data Access Control Policy',
          policyDescription: 'Ensures data access is compliant with DPR-X-2025.',
          effectiveDate: '2025-03-01',
          version: '1.0'
        };
        const definePolicyRes = await request(app)
          .post('/api/v1/define-policy')
          .send(definePolicyPayload);
        expect(definePolicyRes.statusCode).toBe(200);
        detectedPolicyId = definePolicyRes.body.id;

        // Finally, perform a monitoring run
        const performMonitoringRunPayload = {
          monitoringConfigurationId: 'config-alpha-123',
          monitoringScope: 'All User Data',
          runTimestamp: CURRENT_TIMESTAMP,
          triggeredBy: 'Automated System'
        };
        const performMonitoringRunRes = await request(app)
          .post('/api/v1/perform-monitoring-run')
          .send(performMonitoringRunPayload);
        expect(performMonitoringRunRes.statusCode).toBe(200);
        monitoringRunId = performMonitoringRunRes.body.id;
      });

      when('Automation detects an instance of non-compliance.', async () => {
        nonComplianceCaseRequest = {
          monitoringRunId: monitoringRunId,
          detectedPolicyId: detectedPolicyId,
          issueDescription: 'Unauthorized data access attempt detected in "All User Data" scope.',
          detectedDate: CURRENT_DATE,
          severity: 'Critical'
        };

        createNonComplianceCaseResponse = await request(app)
          .post('/api/v1/detect-non-compliance')
          .send(nonComplianceCaseRequest);
      });

      then('A Non-Compliance Case is created, detailing the detected issue.', async () => {
        expect(createNonComplianceCaseResponse.statusCode).toBe(200);
        expect(createNonComplianceCaseResponse.body).toBeDefined();
        expect(createNonComplianceCaseResponse.body.id).toBeDefined();
        expect(typeof createNonComplianceCaseResponse.body.id).toBe('string');
        expect(createNonComplianceCaseResponse.body.monitoringRunId).toBe(nonComplianceCaseRequest.monitoringRunId);
        expect(createNonComplianceCaseResponse.body.detectedPolicyId).toBe(nonComplianceCaseRequest.detectedPolicyId);
        expect(createNonComplianceCaseResponse.body.issueDescription).toBe(nonComplianceCaseRequest.issueDescription);
        expect(createNonComplianceCaseResponse.body.detectedDate).toBe(nonComplianceCaseRequest.detectedDate);
        expect(createNonComplianceCaseResponse.body.severity).toBe(nonComplianceCaseRequest.severity);
        // Expect default values or required fields not provided in creation request but required in schema
        expect(createNonComplianceCaseResponse.body.reviewOutcome).toBeDefined();
        expect(createNonComplianceCaseResponse.body.reviewerId).toBeDefined();
        expect(createNonComplianceCaseResponse.body.reviewDate).toBeDefined();
      });
    }
  );
});