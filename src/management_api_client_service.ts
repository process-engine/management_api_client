import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi, IManagementApiAccessor, Messages} from '@process-engine/management_api_contracts';

export class ManagementApiClientService implements IManagementApi {

  private managementApiAccessor: IManagementApiAccessor = undefined;

  constructor(managementApiAccessor: IManagementApiAccessor) {
    this.managementApiAccessor = managementApiAccessor;
  }

  // Notifications
  public onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): void {
    this.managementApiAccessor.onUserTaskWaiting(identity, callback);
  }

  public onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): void {
    this.managementApiAccessor.onUserTaskFinished(identity, callback);
  }

  public onManualTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): void {
    this.managementApiAccessor.onManualTaskWaiting(identity, callback);
  }

  public onProcessStarted(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback): void {
    this.managementApiAccessor.onProcessStarted(identity, callback);
  }

  public onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
  ): void {
    this.managementApiAccessor.onProcessWithProcessModelIdStarted(identity, callback, processModelId);
  }

  public onProcessTerminated(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessTerminatedCallback): void {
    this.managementApiAccessor.onProcessTerminated(identity, callback);
  }

  public onManualTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): void {
    this.managementApiAccessor.onManualTaskFinished(identity, callback);
  }

  public onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback): void {
    this.managementApiAccessor.onProcessEnded(identity, callback);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiAccessor.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiAccessor.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {
    return this.managementApiAccessor.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {
    return this.managementApiAccessor.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiAccessor.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    return this.managementApiAccessor.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.managementApiAccessor.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
                                    startCallbackType: DataModels.ProcessModels.StartCallbackType =
                                      DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    if (!Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached && !endEventId) {
      throw new EssentialProjectErrors.BadRequestError(`Must provide an EndEventId, when using callback type 'CallbackOnEndEventReached'!`);
    }

    return this.managementApiAccessor.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    return this.managementApiAccessor.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload): Promise<void> {

    return this.managementApiAccessor.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {

    return this.managementApiAccessor.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    return this.managementApiAccessor.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {

    return this.managementApiAccessor.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    return this.managementApiAccessor.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    return this.managementApiAccessor.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    return this.managementApiAccessor.triggerSignalEvent(identity, signalName, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.managementApiAccessor.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.managementApiAccessor.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(identity: IIdentity,
                              processInstanceId: string,
                              correlationId: string,
                              userTaskInstanceId: string,
                              userTaskResult: DataModels.UserTasks.UserTaskResult): Promise<void> {

    return this.managementApiAccessor.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.managementApiAccessor.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.managementApiAccessor.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(identity: IIdentity,
                                                          processModelId: string,
                                                          correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    return this.managementApiAccessor.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishManualTask(identity: IIdentity,
                                processInstanceId: string,
                                correlationId: string,
                                manualTaskInstanceId: string): Promise<void> {

    return this.managementApiAccessor.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {
    return this.managementApiAccessor.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    return this.managementApiAccessor.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiAccessor.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForCorrelationAndProcessModel(identity: IIdentity,
                                                            correlationId: string,
                                                            processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    return this.managementApiAccessor.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance(identity: IIdentity,
                                                 processInstanceId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    return this.managementApiAccessor.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiAccessor.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {
    return this.managementApiAccessor.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            correlationId: string,
                                            processModelId: string,
                                            flowNodeId: string): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

    return this.managementApiAccessor.getTokensForFlowNodeInstance(identity, correlationId, processModelId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(identity: IIdentity,
                                                      correlationId: string,
                                                      processModelId: string): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    return this.managementApiAccessor.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(identity: IIdentity,
                                           processInstanceId: string): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    return this.managementApiAccessor.getTokensForProcessInstance(identity, processInstanceId);
  }
}
