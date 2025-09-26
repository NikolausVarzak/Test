import { v4 as uuidv4 } from 'uuid';
import Policy from '../entity/Policy.js';
import db from '../../infrastructure/db/index.js';

class DefinePolicyCommand {
  static async execute({ regulationId, policyTitle, policyDescription, effectiveDate, version }) {
    // Given: A regulation has been adopted. (Assumed by existence of regulationId)
    // When: The Compliance Officer defines a new policy based on the adopted regulation.
    // Then: The new policy is recorded and linked to the regulation.

    const id = uuidv4(); // Generate a unique ID for the new policy

    const policy = new Policy({
      id,
      regulationId,
      policyTitle,
      policyDescription,
      effectiveDate,
      version,
    });

    await db.insert('Policy', policy.toJSON());
    return policy.toJSON();
  }
}

export default DefinePolicyCommand;