import { v4 as uuidv4 } from 'uuid';

class MonitoringRun {
  constructor({
    id = uuidv4(),
    monitoringConfigurationId,
    monitoringScope,
    runTimestamp,
    triggeredBy
  }) {
    if (!monitoringConfigurationId) throw new Error('Monitoring Configuration ID is required');
    if (!monitoringScope) throw new Error('Monitoring Scope is required');
    if (!runTimestamp) throw new Error('Run Timestamp is required');
    if (!triggeredBy) throw new Error('Triggered By is required');

    this.id = id;
    this.monitoringConfigurationId = monitoringConfigurationId;
    this.monitoringScope = monitoringScope;
    this.runTimestamp = runTimestamp;
    this.triggeredBy = triggeredBy;
  }

  toJSON() {
    return {
      id: this.id,
      monitoringConfigurationId: this.monitoringConfigurationId,
      monitoringScope: this.monitoringScope,
      runTimestamp: this.runTimestamp,
      triggeredBy: this.triggeredBy,
    };
  }
}

export default MonitoringRun;