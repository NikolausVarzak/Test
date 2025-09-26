import db from '../../infrastructure/db/index.js';

class ReviewNonComplianceCaseCommand {
  static async execute({ id, reviewComment, reviewOutcome, reviewerId, reviewDate }) {
    const nonComplianceCase = await db.findById('Non-Compliance Case', id);

    if (!nonComplianceCase) {
      throw new Error(`Non-Compliance Case with ID ${id} not found.`);
    }

    const updatedCase = {
      reviewComment,
      reviewOutcome,
      reviewerId,
      reviewDate,
    };

    const result = await db.update('Non-Compliance Case', id, updatedCase);
    return result;
  }
}

export default ReviewNonComplianceCaseCommand;