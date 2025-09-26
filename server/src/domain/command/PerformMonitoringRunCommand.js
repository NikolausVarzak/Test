import { v4 as uuidv4 } from 'uuid';
import MonitoringRun from '../entity/MonitoringRun.js';
import db from '../../infrastructure/db/index.js';

class PerformMonitoringRunCommand {
  static async execute({ monitoringConfigurationId, monitoringScope, runTimestamp, triggeredBy }) {
    const id = uuidv4(); // Generate a unique ID for the new monitoring run

    const monitoringRun = new MonitoringRun({
      id,
      monitoringConfigurationId,
      monitoringScope,
      runTimestamp,
      triggeredBy,
    });

    // The GWT description states "A monitoring run record is created."
    // We insert the new MonitoringRun entity into the database.
    await db.insert('Monitoring Run', monitoringRun.toJSON());

    return monitoringRun.toJSON();
  }
}

export default PerformMonitoringRunCommand;