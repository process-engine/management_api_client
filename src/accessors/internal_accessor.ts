import {UnauthorizedError} from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi, IManagementApiAccessor, Messages} from '@process-engine/management_api_contracts';

export class InternalAccessor implements IManagementApiAccessor {

  private _managementApiService: IManagementApi = undefined;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  // Notifications
  public async onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onUserTaskWaiting(identity, callback);
  }

  public async onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onUserTaskFinished(identity, callback);
  }

  public async onUserTaskForIdentityWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onUserTaskForIdentityWaiting(identity, callback);
  }

  public async onUserTaskForIdentityFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onUserTaskForIdentityFinished(identity, callback);
  }

  public async onManualTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onManualTaskWaiting(identity, callback);
  }

  public async onManualTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onManualTaskFinished(identity, callback);
  }

  public async onManualTaskForIdentityWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onManualTaskForIdentityWaiting(identity, callback);
  }

  public async onManualTaskForIdentityFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onManualTaskForIdentityFinished(identity, callback);
  }

  public async onProcessStarted(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onProcessStarted(identity, callback);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
  ): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onProcessWithProcessModelIdStarted(identity, callback, processModelId);
  }

  public async onProcessTerminated(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessTerminatedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onProcessTerminated(identity, callback);
  }

  public async onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback): Promise<Subscription> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.onProcessEnded(identity, callback);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    return this._managementApiService.removeSubscription(identity, subscription);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
                                    startCallbackType: DataModels.ProcessModels.StartCallbackType =
                                      DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
                                          ): Promise<void> {

    return this._managementApiService.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    return this._managementApiService.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {

    return this._managementApiService.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    return this._managementApiService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    return this._managementApiService.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    return this._managementApiService.triggerSignalEvent(identity, signalName, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishManualTask(identity: IIdentity,
                                processInstanceId: string,
                                correlationId: string,
                                manualTaskInstanceId: string): Promise<void> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForProcessModel(identity, processModelId);

  }

  public async getActiveTokensForCorrelationAndProcessModel(identity: IIdentity,
                                                            correlationId: string,
                                                            processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance(identity: IIdentity,
                                                 processInstanceId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getTokensForFlowNodeInstance(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getTokensForFlowNodeInstance(identity, correlationId, processModelId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(identity: IIdentity,
                                           processInstanceId: string): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getTokensForProcessInstance(identity, processInstanceId);
  }

  private _ensureIsAuthorized(identity: IIdentity): void {

    // Note: When using an external accessor, this check is performed by the ConsumerApiHttp module.
    // Since that component is bypassed by the internal accessor, we need to perform this check here.
    const authTokenNotProvided: boolean = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }
  }
}
