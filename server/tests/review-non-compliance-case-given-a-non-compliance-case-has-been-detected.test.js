import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'review-non-compliance-case-given-a-non-compliance-case-has-been-detected.feature'));

defineFeature(feature, test => {
  let nonComplianceCaseId;
  let response;
  const CURRENT_DATE = '2025-09-26T11:05:09.037Z';

  test(
    'Given: A Non-Compliance Case has been detected. When: The Compliance Officer reviews the Non-Compliance Case. Then: The Non-Compliance Case is marked as reviewed.',
    ({ given, when, then }) => {
      given('A Non-Compliance Case has been detected', async () => {
        const createPayload = {
          monitoringRunId: 'mrun-101',
          detectedPolicyId: 'pol-A01',
          issueDescription: 'Unauthorized data access',
          detectedDate: '2023-10-26',
          severity: 'High',
        };

        const createResponse = await request(app)
          .post('/api/v1/detect-non-compliance')
          .send(createPayload)
          .set('Accept', 'application/json');

        expect(createResponse.statusCode).toBe(200);
        expect(createResponse.body).toBeDefined();
        expect(createResponse.body.id).toBeDefined();
        nonComplianceCaseId = createResponse.body.id;
      });

      when('The Compliance Officer reviews the Non-Compliance Case', async () => {
        const reviewPayload = {
          id: nonComplianceCaseId,
          reviewOutcome: 'Confirmed',
          reviewerId: 'user-CO-01',
          reviewDate: CURRENT_DATE,
          reviewComment: 'Details verified',
        };

        response = await request(app)
          .post('/api/v1/review-non-compliance-case')
          .send(reviewPayload)
          .set('Accept', 'application/json');
      });

      then('The Non-Compliance Case is marked as reviewed', async () => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(nonComplianceCaseId);
        expect(response.body.reviewOutcome).toEqual('Confirmed');
        expect(response.body.reviewerId).toEqual('user-CO-01');
        expect(response.body.reviewDate).toEqual(CURRENT_DATE);
        expect(response.body.reviewComment).toEqual('Details verified');
      });
    }
  );
});