import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'perform-monitoring-run-given-active-policies-are-in-place.feature'));

const CURRENT_DATE = '2025-09-26T11:04:35.672Z';

defineFeature(feature, test => {
  let regulationId;
  let policyId;
  let performMonitoringRunRequestBody;
  let response;
  let monitoringRunId;

  test(
    'Given: Active policies are in place. When: Automation performs a scheduled monitoring run. Then: A monitoring run record is created.',
    ({ given, when, then }) => {
      given('Active policies are in place.', async () => {
        // Create a Regulation
        const regulationRequestBody = {
          regulationTitle: 'Data Protection Regulation',
          regulationNumber: 'DPR-2025-001',
          issuingBody: 'Global Compliance Authority',
          effectiveDate: '2025-01-01',
          description: 'Ensures protection of personal data.',
        };

        const regulationResponse = await request(app)
          .post('/api/v1/adopt-regulation')
          .send(regulationRequestBody)
          .expect(200);

        regulationId = regulationResponse.body.id;

        // Create a Policy linked to the Regulation
        const policyRequestBody = {
          regulationId: regulationId,
          policyTitle: 'Data Access Control Policy',
          policyDescription: 'Defines rules for accessing sensitive data.',
          effectiveDate: '2025-02-01',
          version: '1.0',
        };

        const policyResponse = await request(app)
          .post('/api/v1/define-policy')
          .send(policyRequestBody)
          .expect(200);

        policyId = policyResponse.body.id;
      });

      when('Automation performs a scheduled monitoring run.', async () => {
        performMonitoringRunRequestBody = {
          monitoringConfigurationId: 'config-automation-001',
          monitoringScope: 'All Systems Data',
          runTimestamp: CURRENT_DATE,
          triggeredBy: 'Scheduler',
        };

        response = await request(app)
          .post('/api/v1/perform-monitoring-run')
          .send(performMonitoringRunRequestBody);
      });

      then('A monitoring run record is created.', async () => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(typeof response.body.id).toBe('string');
        expect(response.body.monitoringConfigurationId).toBe(performMonitoringRunRequestBody.monitoringConfigurationId);
        expect(response.body.monitoringScope).toBe(performMonitoringRunRequestBody.monitoringScope);
        expect(response.body.runTimestamp).toBe(performMonitoringRunRequestBody.runTimestamp);
        expect(response.body.triggeredBy).toBe(performMonitoringRunRequestBody.triggeredBy);

        monitoringRunId = response.body.id;
      });
    }
  );
});