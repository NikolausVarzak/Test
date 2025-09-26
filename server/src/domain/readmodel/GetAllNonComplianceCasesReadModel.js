import db from '../../infrastructure/db/index.js';

class GetAllNonComplianceCasesReadModel {
  static async query() {
    // The OpenAPI specification and cardinality indicate a request for all non-compliance cases.
    // The allDescriptions entry "Get Non-Compliance Case Details" does not provide specific filtering logic for a "get all" operation.
    // Therefore, retrieve all non-compliance cases without specific filters.
    return await db.findAll('Non-Compliance Case');
  }
}

export default GetAllNonComplianceCasesReadModel;