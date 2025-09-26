import { v4 as uuidv4 } from 'uuid';

class Policy {
  constructor({
    id = uuidv4(),
    regulationId,
    policyTitle,
    policyDescription,
    effectiveDate,
    version,
  }) {
    if (!regulationId) throw new Error('regulationId is required');
    if (!policyTitle) throw new Error('policyTitle is required');
    if (!policyDescription) throw new Error('policyDescription is required');
    if (!effectiveDate) throw new Error('effectiveDate is required');
    if (!version) throw new Error('version is required');

    this.id = id;
    this.regulationId = regulationId;
    this.policyTitle = policyTitle;
    this.policyDescription = policyDescription;
    this.effectiveDate = effectiveDate;
    this.version = version;
  }

  toJSON() {
    return {
      id: this.id,
      regulationId: this.regulationId,
      policyTitle: this.policyTitle,
      policyDescription: this.policyDescription,
      effectiveDate: this.effectiveDate,
      version: this.version,
    };
  }
}

export default Policy;