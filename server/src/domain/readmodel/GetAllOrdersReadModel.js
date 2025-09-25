import db from '../../infrastructure/db/index.js';

class GetAllOrdersReadModel {
  static async query() {
    return await db.findAll('Order');
  }
}

export default GetAllOrdersReadModel;