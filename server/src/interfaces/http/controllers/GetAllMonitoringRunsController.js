import express from 'express';
import GetAllMonitoringRunsReadModel from '../../../domain/readmodel/GetAllMonitoringRunsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const monitoringRuns = await GetAllMonitoringRunsReadModel.query();
    res.status(200).json(monitoringRuns);
  } catch (err) {
    // According to OpenAPI spec, 400 for client errors, but generic server errors
    // are often caught as 500 if not specifically a bad request.
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-monitoring-run-results',
  router,
};