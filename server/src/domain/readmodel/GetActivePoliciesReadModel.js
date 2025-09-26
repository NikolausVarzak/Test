import db from '../../infrastructure/db/index.js';

class GetActivePoliciesReadModel {
  static async query() {
    const allPolicies = await db.findAll('Monitoring Run');
    return allPolicies.filter(policy => policy.status === 'active');
  }
}

export default GetActivePoliciesReadModel;