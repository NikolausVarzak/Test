import express from 'express';
import DefinePolicyCommand from '../../../domain/command/DefinePolicyCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { regulationId, policyTitle, policyDescription, effectiveDate, version } = req.body;

    // Execute the Define Policy command
    const newPolicy = await DefinePolicyCommand.execute({
      regulationId,
      policyTitle,
      policyDescription,
      effectiveDate,
      version,
    });

    // As per OpenAPI spec, success is 200 OK
    res.status(200).json(newPolicy);
  } catch (err) {
    // As per OpenAPI spec, client errors are 400 Bad Request
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/define-policy',
  router,
};