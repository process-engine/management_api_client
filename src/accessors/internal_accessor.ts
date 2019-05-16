import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels, IManagementApi, IManagementApiAccessor, Messages,
} from '@process-engine/management_api_contracts';

export class InternalAccessor implements IManagementApiAccessor {

  private managementApiService: IManagementApi = undefined;

  constructor(managementApiService: IManagementApi) {
    this.managementApiService = managementApiService;
  }

  // Notifications
  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.managementApiService.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.managementApiService.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.managementApiService.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.managementApiService.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this._managementApiService.onBoundaryEventWaiting(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this._managementApiService.onBoundaryEventFinished(identity, callback, subscribeOnce);
  }

  public async onCallActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this._managementApiService.onCallActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this._managementApiService.onCallActivityFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.managementApiService.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    return this.managementApiService.removeSubscription(identity, subscription);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiService.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiService.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {
    return this.managementApiService.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {
    return this.managementApiService.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {
    return this.managementApiService.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    return this.managementApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.managementApiService.getProcessModelById(identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.managementApiService.getProcessModelByProcessInstanceId(identity, processInstanceId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    return this.managementApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    return this.managementApiService.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {

    return this.managementApiService.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    return this.managementApiService.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    return this.managementApiService.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {
    return this.managementApiService.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    return this.managementApiService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.managementApiService.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.managementApiService.triggerSignalEvent(identity, signalName, payload);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.managementApiService.getEmptyActivitiesForProcessModel(identity, processModelId);
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.managementApiService.getEmptyActivitiesForProcessInstance(identity, processInstanceId);
  }

  public async getEmptyActivitiesForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.managementApiService.getEmptyActivitiesForCorrelation(identity, correlationId);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.managementApiService.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    return this.managementApiService.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.managementApiService.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.managementApiService.getUserTasksForProcessInstance(identity, processInstanceId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.managementApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    return this.managementApiService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    return this.managementApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.managementApiService.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.managementApiService.getManualTasksForProcessInstance(identity, processInstanceId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.managementApiService.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    return this.managementApiService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {

    return this.managementApiService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    return this.managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    return this.managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiService.getActiveTokensForProcessModel(identity, processModelId);

  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiService.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiService.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this.managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {
    return this.managementApiService.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
  ): Promise<Array<DataModels.Logging.LogEntry>> {

    return this.managementApiService.getProcessInstanceLog(identity, processModelId, processInstanceId);
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

    return this.managementApiService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId);
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    return this.managementApiService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    return this.managementApiService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    return this.managementApiService.getTokensForProcessInstance(identity, processInstanceId);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {

    return this.managementApiService.terminateProcessInstance(identity, processInstanceId);
  }

}
