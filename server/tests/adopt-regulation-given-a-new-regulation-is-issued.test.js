import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './adopt-regulation-given-a-new-regulation-is-issued.feature'));

defineFeature(feature, test => {
  let regulationRequestBody;
  let adoptedRegulationResponse;
  let regulationId;

  test(
    'Given: A new regulation is issued by Finansinspektionen. When: The Compliance Officer adopts the regulation. Then: The regulation is marked as adopted in the system.',
    ({ given, when, then }) => {
      given('A new regulation is issued by Finansinspektionen.', () => {
        regulationRequestBody = {
          regulationTitle: 'Payment Services Directive 2 (PSD2)',
          regulationNumber: 'EU 2015/2366',
          issuingBody: 'Finansinspektionen',
          effectiveDate: '2018-01-13',
          description: 'Payment services and electronic money for the EU market.',
        };
      });

      when('The Compliance Officer adopts the regulation.', async () => {
        adoptedRegulationResponse = await request(app)
          .post('/api/v1/adopt-regulation')
          .send(regulationRequestBody);
      });

      then('The regulation is marked as adopted in the system.', async () => {
        // Assert the immediate response from the adopt-regulation command
        expect(adoptedRegulationResponse.statusCode).toBe(200);
        expect(adoptedRegulationResponse.body).toBeDefined();
        
        // OpenAPI: The response schema for adopt-regulation is 'Regulation'
        expect(adoptedRegulationResponse.body).toHaveProperty('id');
        expect(typeof adoptedRegulationResponse.body.id).toBe('string');
        expect(adoptedRegulationResponse.body.id).not.toBe('');
        
        regulationId = adoptedRegulationResponse.body.id;

        expect(adoptedRegulationResponse.body).toHaveProperty('regulationTitle', regulationRequestBody.regulationTitle);
        expect(adoptedRegulationResponse.body).toHaveProperty('regulationNumber', regulationRequestBody.regulationNumber);
        expect(adoptedRegulationResponse.body).toHaveProperty('issuingBody', regulationRequestBody.issuingBody);
        expect(adoptedRegulationResponse.body).toHaveProperty('effectiveDate', regulationRequestBody.effectiveDate);
        expect(adoptedRegulationResponse.body).toHaveProperty('description', regulationRequestBody.description);

        // Query all regulations to find the newly adopted one and check its status
        const getAllRegulationsResponse = await request(app)
          .get('/api/v1/get-all-regulations')
          .expect(200);

        expect(getAllRegulationsResponse.body).toBeInstanceOf(Array);
        const adoptedRegulationInList = getAllRegulationsResponse.body.find(
          (reg) => reg.id === regulationId
        );

        expect(adoptedRegulationInList).toBeDefined();
        expect(adoptedRegulationInList).toHaveProperty('id', regulationId);
        // The GWT implies 'adopted', and GetAllRegulationsResponse schema explicitly includes a 'status' field.
        // Assuming the status value for an adopted regulation is 'Adopted'.
        expect(adoptedRegulationInList).toHaveProperty('status', 'Adopted');
      });
    }
  );
});