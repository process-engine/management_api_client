import {Logger} from 'loggerhythm';

import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels, IManagementApiAccessor, IManagementApiClient, Messages,
} from '@process-engine/management_api_contracts';

const logger = Logger.createLogger('processengine:management_api:client');

export class ManagementApiClient implements IManagementApiClient {

  private managementApiAccessor: IManagementApiAccessor = undefined;

  constructor(managementApiAccessor: IManagementApiAccessor) {
    this.managementApiAccessor = managementApiAccessor;
  }

  // Notifications
  public async onActivityReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onActivityReached(identity, callback, subscribeOnce);
  }

  public async onActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onActivityFinished(identity, callback, subscribeOnce);
  }

  // ------------ For backwards compatibility only

  public async onCallActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    logger.warn('"onCallActivityWaiting" is deprecated and will be removed with the next major release! Use "onActivityReached" instead!');

    return this.managementApiAccessor.onCallActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    logger.warn('"onCallActivityFinished" is deprecated and will be removed with the next major release! Use "onActivityFinished" instead!');

    return this.managementApiAccessor.onCallActivityFinished(identity, callback, subscribeOnce);
  }

  // ------------

  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityFinished(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onEmptyActivityForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskFinished(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onUserTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onBoundaryEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateThrowEventTriggered(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateCatchEventReached(identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onIntermediateCatchEventFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskFinished(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskForIdentityWaiting(identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onManualTaskForIdentityFinished(identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessStarted(identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessWithProcessModelIdStarted(identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessTerminated(identity, callback, subscribeOnce);
  }

  public async onProcessError(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessError(identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.onProcessEnded(identity, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.removeSubscription(identity, subscription);
  }

  // Cronjobs
  public async getAllActiveCronjobs(identity: IIdentity): Promise<Array<DataModels.Cronjobs.CronjobConfiguration>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getAllActiveCronjobs(identity);
  }

  public async getCronjobExecutionHistoryForProcessModel(
    identity: IIdentity,
    processModelId: string,
    startEventId?: string,
  ): Promise<Array<DataModels.Cronjobs.CronjobHistoryEntry>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId);
  }

  public async getCronjobExecutionHistoryForCrontab(
    identity: IIdentity,
    crontab: string,
  ): Promise<Array<DataModels.Cronjobs.CronjobHistoryEntry>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCronjobExecutionHistoryForCrontab(identity, crontab);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelById(identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelByProcessInstanceId(identity, processInstanceId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    this.ensureIsAuthorized(identity);

    if (!Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached && !endEventId) {
      throw new EssentialProjectErrors.BadRequestError('Must provide an EndEventId, when using callback type \'CallbackOnEndEventReached\'!');
    }

    return this.managementApiAccessor.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.triggerSignalEvent(identity, signalName, payload);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessModel(identity, processModelId);
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessInstance(identity, processInstanceId);
  }

  public async getEmptyActivitiesForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForCorrelation(identity, correlationId);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // FlowNodeInstances
  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.FlowNodeInstances.FlowNodeInstance>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getFlowNodeInstancesForProcessInstance(identity, processInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessInstance(identity, processInstanceId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessModel(identity, processModelId);
  }

  public async getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessInstance(identity, processInstanceId);
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForCorrelation(identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
  ): Promise<Array<DataModels.Logging.LogEntry>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getProcessInstanceLog(identity, processModelId, processInstanceId);
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId);
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.getTokensForProcessInstance(identity, processInstanceId);
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.managementApiAccessor.terminateProcessInstance(identity, processInstanceId);
  }

  private ensureIsAuthorized(identity: IIdentity): void {
    const authTokenNotProvided = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }

}
