import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ActiveToken,
  Correlation,
  EventList,
  EventTriggerPayload,
  FlowNodeRuntimeInformation,
  IManagementApi,
  IManagementApiAccessor,
  LogEntry,
  ManualTaskList,
  Messages,
  ProcessModelExecution,
  TokenHistoryEntry,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

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
  public async getAllCorrelations(identity: IIdentity): Promise<Array<Correlation>> {
    return this.managementApiAccessor.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<Correlation>> {
    return this.managementApiAccessor.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<Correlation> {
    return this.managementApiAccessor.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation> {
    return this.managementApiAccessor.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<Correlation>> {
    return this.managementApiAccessor.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<ProcessModelExecution.ProcessModelList> {
    return this.managementApiAccessor.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {
    return this.managementApiAccessor.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    if (!Object.values(ProcessModelExecution.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached && !endEventId) {
      throw new EssentialProjectErrors.BadRequestError(`Must provide an EndEventId, when using callback type 'CallbackOnEndEventReached'!`);
    }

    return this.managementApiAccessor.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {
    return this.managementApiAccessor.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload): Promise<void> {

    return this.managementApiAccessor.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {

    return this.managementApiAccessor.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    return this.managementApiAccessor.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<EventList> {

    return this.managementApiAccessor.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(identity: IIdentity, processModelId: string, correlationId: string): Promise<EventList> {

    return this.managementApiAccessor.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: EventTriggerPayload): Promise<void> {

    return this.managementApiAccessor.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: EventTriggerPayload): Promise<void> {

    return this.managementApiAccessor.triggerSignalEvent(identity, signalName, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<UserTaskList> {
    return this.managementApiAccessor.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<UserTaskList> {
    return this.managementApiAccessor.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(identity: IIdentity,
                              processInstanceId: string,
                              correlationId: string,
                              userTaskInstanceId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    return this.managementApiAccessor.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<ManualTaskList> {
    return this.managementApiAccessor.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<ManualTaskList> {
    return this.managementApiAccessor.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(identity: IIdentity,
                                                          processModelId: string,
                                                          correlationId: string): Promise<ManualTaskList> {

    return this.managementApiAccessor.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishManualTask(identity: IIdentity,
                                processInstanceId: string,
                                correlationId: string,
                                manualTaskInstanceId: string): Promise<void> {

    return this.managementApiAccessor.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {
    return this.managementApiAccessor.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    return this.managementApiAccessor.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {
    return this.managementApiAccessor.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {
    return this.managementApiAccessor.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<LogEntry>> {
    return this.managementApiAccessor.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            correlationId: string,
                                            processModelId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    return this.managementApiAccessor.getTokensForFlowNodeInstance(identity, correlationId, processModelId, flowNodeId);
  }

}
