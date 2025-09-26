import { v4 as uuidv4 } from 'uuid';
import Regulation from '../entity/Regulation.js';
import db from '../../infrastructure/db/index.js';

class AdoptRegulationCommand {
  static async execute({ regulationTitle, regulationNumber, issuingBody, effectiveDate }) {
    const id = uuidv4();
    const newRegulation = new Regulation({
      id,
      regulationTitle,
      regulationNumber,
      issuingBody,
      effectiveDate,
      // The description field is not part of the AdoptRegulationRequest,
      // so it's not provided by the command's input.
      // The entity constructor should handle its absence, potentially setting it to null or undefined.
    });

    await db.insert('Regulation', newRegulation.toJSON());
    return newRegulation.toJSON();
  }
}

export default AdoptRegulationCommand;