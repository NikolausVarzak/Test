import db from '../../infrastructure/db/index.js';

class GetAllMonitoringRunsReadModel {
  static async query() {
    // The "Get Monitoring Run Results" description implies fetching all relevant data.
    // The OpenAPI specification's GetMonitoringRunResultsResponse schema dictates the expected output structure.
    // As per rules, we assume the database returns data matching this schema from the associated entity.
    return await db.findAll('Non-Compliance Case');
  }
}

export default GetAllMonitoringRunsReadModel;