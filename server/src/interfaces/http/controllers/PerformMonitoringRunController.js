import express from 'express';
import PerformMonitoringRunCommand from '../../../domain/command/PerformMonitoringRunCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { monitoringConfigurationId, monitoringScope, runTimestamp, triggeredBy } = req.body;

    const result = await PerformMonitoringRunCommand.execute({
      monitoringConfigurationId,
      monitoringScope,
      runTimestamp,
      triggeredBy,
    });

    // According to OpenAPI, a successful creation returns 200 OK
    res.status(200).json(result);
  } catch (err) {
    // According to OpenAPI, client errors result in a 400 Bad Request
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/perform-monitoring-run',
  router,
};