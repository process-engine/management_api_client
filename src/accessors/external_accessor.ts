/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as uuid from 'node-uuid';
import * as io from 'socket.io-client';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IHttpClient, IRequestOptions} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IManagementApiAccessor,
  IManagementSocketIoAccessor,
  Messages,
  restSettings,
  socketSettings,
} from '@process-engine/management_api_contracts';

/**
 * Associates a Socket with a userId taken from an IIdentity.
 */
type IdentitySocketCollection = {[userId: string]: SocketIOClient.Socket};

/**
 * Connects a Subscription ID to a specific callback.
 * This allows us to remove that Subscription from SocketIO
 * when "ExternalAccessor.removeSubscription" is called.
 */
type SubscriptionCallbackAssociation = {[subscriptionId: string]: any};

export class ExternalAccessor implements IManagementApiAccessor, IManagementSocketIoAccessor {

  public config: any;

  private baseUrl = 'api/management/v1';

  private socketCollection: IdentitySocketCollection = {};
  private subscriptionCollection: SubscriptionCallbackAssociation = {};

  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  public initializeSocket(identity: IIdentity): void {
    this.createSocketForIdentity(identity);
  }

  public disconnectSocket(identity: IIdentity): void {
    this.removeSocketForIdentity(identity);
  }

  // Notifications
  public async onEmptyActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.emptyActivityWaiting, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(identity, socketSettings.paths.emptyActivityFinished, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    const socketEventName: string = socketSettings.paths.emptyActivityForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    const socketEventName: string = socketSettings.paths.emptyActivityForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.userTaskWaiting, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.userTaskFinished, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.boundaryEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateThrowEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateCatchEventReached, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.intermediateCatchEventFinished, callback, subscribeOnce);
  }

  public async onCallActivityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.callActivityWaiting, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.callActivityFinished, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processTerminated, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processStarted, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const eventName: string = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    return this.createSocketIoSubscription(identity, eventName, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.manualTaskWaiting, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.manualTaskFinished, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this.createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {

    return this.createSocketIoSubscription(identity, socketSettings.paths.processEnded, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {

    const socketForIdentity = this.getSocketForIdentity(identity);
    if (!socketForIdentity) {
      return;
    }

    const callbackToRemove = this.subscriptionCollection[subscription.id];
    if (!callbackToRemove) {
      return;
    }

    socketForIdentity.off(subscription.eventName, callbackToRemove);

    delete this.subscriptionCollection[subscription.id];
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.applyBaseUrl(restSettings.paths.getAllCorrelations);

    const httpResponse = await this.httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.applyBaseUrl(restSettings.paths.getActiveCorrelations);

    const httpResponse = await this.httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths
      .getCorrelationById
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getCorrelationByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Correlations.Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getCorrelationsByProcessModelId
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.applyBaseUrl(restSettings.paths.processModels);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelByProcessInstanceId.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const url = this.buildStartProcessInstanceUrl(processModelId, startEventId, startCallbackType, endEventId);

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const httpResponse =
      // eslint-disable-next-line max-len
      await this.httpClient.post<DataModels.ProcessModels.ProcessStartRequestPayload, DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelStartEvents.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    const url = this.applyBaseUrl(restPath);

    await this.httpClient.post<DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.deleteProcessDefinitionsByProcessModelId.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(restPath);

    await this.httpClient.get(url, requestAuthHeaders);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingProcessModelEvents.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingCorrelationEvents.replace(restSettings.params.correlationId, correlationId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.waitingProcessModelCorrelationEvents
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.triggerMessageEvent
      .replace(restSettings.params.eventName, messageName);

    const url = this.applyBaseUrl(restPath);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.triggerSignalEvent
      .replace(restSettings.params.eventName, signalName);

    const url = this.applyBaseUrl(restPath);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelEmptyActivities
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processInstanceEmptyActivities
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.correlationEmptyActivities
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelCorrelationEmptyActivities
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishEmptyActivity(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    let url = restSettings.paths.finishEmptyActivity
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.emptyActivityInstanceId, emptyActivityInstanceId);

    url = this.applyBaseUrl(url);

    const body: {} = {};
    await this.httpClient.post(url, body, requestAuthHeaders);
  }

  // FlowNodeInstances
  public async getFlowNodeInstancesForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.FlowNodes.FlowNodeInstance>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getFlowNodeInstancesForProcessInstance.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.FlowNodes.FlowNodeInstance>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processInstanceUserTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    const url = this.applyBaseUrl(restPath);

    await this.httpClient.post<DataModels.UserTasks.UserTaskResult, void>(url, userTaskResult, requestAuthHeaders);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processModelManualTasks.replace(restSettings.params.processModelId, processModelId);
    const url = this.applyBaseUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processInstanceManualTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url = this.applyBaseUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.correlationManualTasks.replace(restSettings.params.correlationId, correlationId);
    const url = this.applyBaseUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.processModelCorrelationManualTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url = this.applyBaseUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const urlRestPart = restSettings.paths.finishManualTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.manualTaskInstanceId, manualTaskInstanceId);

    const url = this.applyBaseUrl(urlRestPart);

    await this.httpClient.post(url, {}, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Kpi.FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    let restPath = restSettings.paths.getProcessModelLog
      .replace(restSettings.params.processModelId, processModelId);

    if (correlationId) {
      restPath = `${restPath}?${restSettings.queryParams.correlationId}=${correlationId}`;
    }

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Logging.LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstanceLog(
    identity: IIdentity,
    processModelId: string,
    processInstanceId: string,
  ): Promise<Array<DataModels.Logging.LogEntry>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getProcessInstanceLog
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.Logging.LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNode(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<Array<DataModels.TokenHistory.TokenHistoryEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeByProcessInstanceId(
    identity: IIdentity,
    processInstanceId: string,
    flowNodeId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForFlowNodeByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.getTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async terminateProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.terminateProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseUrl(restPath);

    await this.httpClient.post(url, {}, requestAuthHeaders);
  }

  private buildStartProcessInstanceUrl(
    processModelId: string,
    startEventId: string,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId: string,
  ): string {

    let restPath = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId);

    restPath = `${restPath}?start_callback_type=${startCallbackType}`;

    const startEventIdGiven = startEventId !== undefined;
    if (startEventIdGiven) {
      restPath = `${restPath}&${restSettings.queryParams.startEventId}=${startEventId}`;
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached) {
      restPath = `${restPath}&${restSettings.queryParams.endEventId}=${endEventId}`;
    }

    const url = this.applyBaseUrl(restPath);

    return url;
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

    const authTokenNotProvided = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      return {};
    }

    const requestAuthHeaders = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private createSocketIoSubscription(identity: IIdentity, route: string, callback: any, subscribeOnce: boolean): Subscription {

    const socketForIdentity = this.createSocketForIdentity(identity);

    if (subscribeOnce) {
      socketForIdentity.once(route, callback);
    } else {
      socketForIdentity.on(route, callback);
    }

    const subscriptionId = uuid.v4();
    const subscription = new Subscription(subscriptionId, route, subscribeOnce);

    this.subscriptionCollection[subscriptionId] = callback;

    return subscription;
  }

  private createSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {

    const existingSocket = this.getSocketForIdentity(identity);
    if (existingSocket) {
      return existingSocket;
    }

    const noAuthTokenProvided = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const socketUrl = `${this.config.socketUrl}/${socketSettings.namespace}`;
    const socketIoOptions: SocketIOClient.ConnectOpts = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: identity.token,
          },
        },
      },
    };

    this.socketCollection[identity.userId] = io(socketUrl, socketIoOptions);

    return this.socketCollection[identity.userId];
  }

  private removeSocketForIdentity(identity: IIdentity): void {
    const socketForIdentity = this.getSocketForIdentity(identity);

    const noSocketFound = !socketForIdentity;
    if (noSocketFound) {
      return;
    }
    socketForIdentity.disconnect();
    socketForIdentity.close();

    delete this.socketCollection[identity.userId];
  }

  private getSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {
    return this.socketCollection[identity.userId];
  }

}
