class Regulation {
  constructor({ id, regulationTitle, regulationNumber, issuingBody, effectiveDate, description = null }) {
    if (!id) throw new Error('Regulation ID is required');
    if (!regulationTitle) throw new Error('Regulation title is required');
    if (!regulationNumber) throw new Error('Regulation number is required');
    if (!issuingBody) throw new Error('Issuing body is required');
    if (!effectiveDate) throw new Error('Effective date is required');

    this.id = id;
    this.regulationTitle = regulationTitle;
    this.regulationNumber = regulationNumber;
    this.issuingBody = issuingBody;
    this.effectiveDate = effectiveDate;
    this.description = description;
  }

  toJSON() {
    return {
      id: this.id,
      regulationTitle: this.regulationTitle,
      regulationNumber: this.regulationNumber,
      issuingBody: this.issuingBody,
      effectiveDate: this.effectiveDate,
      description: this.description,
    };
  }
}

export default Regulation;