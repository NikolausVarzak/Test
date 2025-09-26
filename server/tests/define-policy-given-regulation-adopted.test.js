import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'define-policy-given-regulation-adopted.feature'));

defineFeature(feature, test => {
  let regulationId;
  let policyPayload;
  let definePolicyResponse;

  test(
    'Given: A regulation has been adopted. When: The Compliance Officer defines a new policy based on the adopted regulation. Then: The new policy is recorded and linked to the regulation.',
    ({ given, when, then }) => {
      given('A regulation has been adopted.', async () => {
        const adoptRegulationRequest = {
          regulationTitle: 'New Data Protection Act',
          regulationNumber: 'DP-2025-001',
          issuingBody: 'National Data Authority',
          effectiveDate: '2025-09-26', // Current date part
          description: 'A new act to protect personal data.'
        };

        const response = await request(app)
          .post('/api/v1/adopt-regulation')
          .send(adoptRegulationRequest)
          .expect(200);

        regulationId = response.body.id;
        expect(regulationId).toBeDefined();
        expect(response.body).toMatchObject(adoptRegulationRequest);
      });

      when('The Compliance Officer defines a new policy based on the adopted regulation.', async () => {
        policyPayload = {
          regulationId: regulationId,
          policyTitle: 'Data Handling and Privacy Policy',
          policyDescription: 'Defines procedures for data collection, storage, and processing in accordance with DP-2025-001.',
          effectiveDate: '2025-09-26', // Current date part
          version: '1.0'
        };

        definePolicyResponse = await request(app)
          .post('/api/v1/define-policy')
          .send(policyPayload);
      });

      then('The new policy is recorded and linked to the regulation.', async () => {
        expect(definePolicyResponse.statusCode).toBe(200);
        expect(definePolicyResponse.body).toBeDefined();
        expect(definePolicyResponse.body.id).toBeDefined();
        expect(definePolicyResponse.body.regulationId).toBe(policyPayload.regulationId);
        expect(definePolicyResponse.body.policyTitle).toBe(policyPayload.policyTitle);
        expect(definePolicyResponse.body.policyDescription).toBe(policyPayload.policyDescription);
        expect(definePolicyResponse.body.effectiveDate).toBe(policyPayload.effectiveDate);
        expect(definePolicyResponse.body.version).toBe(policyPayload.version);

        // Optionally, verify it exists in the list of all policies
        const allPoliciesResponse = await request(app)
          .get('/api/v1/get-all-policys')
          .expect(200);
        
        const foundPolicy = allPoliciesResponse.body.find(
          (policy) => policy.id === definePolicyResponse.body.id
        );
        expect(foundPolicy).toBeDefined();
        expect(foundPolicy.policyTitle).toBe(policyPayload.policyTitle);
        expect(foundPolicy.effectiveDate).toBe(policyPayload.effectiveDate);
      });
    }
  );
});