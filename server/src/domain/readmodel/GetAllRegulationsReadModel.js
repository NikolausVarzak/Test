import db from '../../infrastructure/db/index.js';

class GetAllRegulationsReadModel {
  static async query() {
    return await db.findAll('Regulation');
  }
}

export default GetAllRegulationsReadModel;