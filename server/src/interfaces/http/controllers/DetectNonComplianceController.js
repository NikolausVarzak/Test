import express from 'express';
import DetectNonComplianceCommand from '../../../domain/command/DetectNonComplianceCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { monitoringRunId, detectedPolicyId, issueDescription, detectedDate, severity } = req.body;
    
    const result = await DetectNonComplianceCommand.execute({
      monitoringRunId,
      detectedPolicyId,
      issueDescription,
      detectedDate,
      severity,
    });
    
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/detect-non-compliance',
  router,
};