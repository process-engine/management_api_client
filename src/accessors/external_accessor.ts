/*tslint:disable:max-file-line-count*/
import * as uuid from 'node-uuid';
import * as io from 'socket.io-client';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
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
  private baseUrl: string = 'api/management/v1';

  private _socketCollection: IdentitySocketCollection = {};
  private _subscriptionCollection: SubscriptionCallbackAssociation = {};

  private _httpClient: IHttpClient;

  public config: any;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  // Notifications

  public initializeSocket(identity: IIdentity): void {
    this._createSocketForIdentity(identity);
  }

  public disconnectSocket(identity: IIdentity): void {
    this._removeSocketForIdentity(identity);
  }

  public async onUserTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.userTaskWaiting, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.userTaskFinished, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this._createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    const socketEventName: string = socketSettings.paths.userTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this._createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.processTerminated, callback, subscribeOnce);
  }

  public async onProcessStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.processStarted, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    const eventName: string = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    return this._createSocketIoSubscription(identity, eventName, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.manualTaskWaiting, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.manualTaskFinished, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this._createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    const socketEventName: string = socketSettings.paths.manualTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, identity.userId);

    return this._createSocketIoSubscription(identity, socketEventName, callback, subscribeOnce);
  }

  public async onProcessEnded(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {

    return this._createSocketIoSubscription(identity, socketSettings.paths.processEnded, callback, subscribeOnce);
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {

    const socketForIdentity: SocketIOClient.Socket = this._getSocketForIdentity(identity);
    if (!socketForIdentity) {
      return;
    }

    const callbackToRemove: any = this._subscriptionCollection[subscription.id];
    if (!callbackToRemove) {
      return;
    }

    socketForIdentity.off(subscription.eventName, callbackToRemove);

    delete this._subscriptionCollection[subscription.id];

    return Promise.resolve();
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getAllCorrelations);

    const httpResponse: IResponse<Array<DataModels.Correlations.Correlation>> =
      await this._httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getActiveCorrelations);

    const httpResponse: IResponse<Array<DataModels.Correlations.Correlation>> =
      await this._httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<DataModels.Correlations.Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths
      .getCorrelationById
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Correlations.Correlation> =
      await this._httpClient.get<DataModels.Correlations.Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.Correlations.Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getCorrelationByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Correlations.Correlation> =
      await this._httpClient.get<DataModels.Correlations.Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Correlations.Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getCorrelationsByProcessModelId
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Correlations.Correlation>> =
      await this._httpClient.get<Array<DataModels.Correlations.Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.processModels);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModelList> =
      await this._httpClient.get<DataModels.ProcessModels.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModel> =
      await this._httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelByProcessInstanceId.replace(restSettings.params.processInstanceId, processInstanceId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModel> =
      await this._httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

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

    const url: string = this._buildStartProcessInstanceUrl(processModelId, startEventId, startCallbackType, endEventId);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessStartResponsePayload> =
      await this._httpClient.post<DataModels.ProcessModels.ProcessStartRequestPayload,
        DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelStartEvents.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Events.EventList> = await this._httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(
    identity: IIdentity,
    name: string,
    payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload,
  ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.deleteProcessDefinitionsByProcessModelId.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.get(url, requestAuthHeaders);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingProcessModelEvents.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Events.EventList> = await this._httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingCorrelationEvents.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Events.EventList> = await this._httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingProcessModelCorrelationEvents
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Events.EventList> = await this._httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.triggerMessageEvent
      .replace(restSettings.params.eventName, messageName);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<DataModels.Events.EventTriggerPayload, any>(url, payload, requestAuthHeaders);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.triggerSignalEvent
      .replace(restSettings.params.eventName, signalName);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<DataModels.Events.EventTriggerPayload, any>(url, payload, requestAuthHeaders);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processInstanceUserTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<DataModels.UserTasks.UserTaskResult, any>(url, userTaskResult, requestAuthHeaders);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processModelManualTasks.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processInstanceManualTasks.replace(restSettings.params.processInstanceId, processInstanceId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.correlationManualTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(
    identity: IIdentity,
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processModelCorrelationManualTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishManualTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.finishManualTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.manualTaskInstanceId, manualTaskInstanceId);

    const url: string = this._applyBaseUrl(urlRestPart);

    await this._httpClient.post(url, {}, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> =
      await this._httpClient.get<Array<DataModels.Kpi.FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Kpi.FlowNodeRuntimeInformation> =
      await this._httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<DataModels.Logging.LogEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let restPath: string = restSettings.paths.getProcessModelLog
      .replace(restSettings.params.processModelId, processModelId);

    if (correlationId) {
      restPath = `${restPath}?${restSettings.queryParams.correlationId}=${correlationId}`;
    }

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Logging.LogEntry>> =
      await this._httpClient.get<Array<DataModels.Logging.LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeInstance(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.TokenHistory.TokenHistoryEntry>> =
      await this._httpClient.get<Array<DataModels.TokenHistory.TokenHistoryEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.TokenHistory.TokenHistoryGroup> =
      await this._httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForProcessInstance
    .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.TokenHistory.TokenHistoryGroup> =
      await this._httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _buildStartProcessInstanceUrl(
    processModelId: string,
    startEventId: string,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId: string,
  ): string {

    let restPath: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId);

    restPath = `${restPath}?start_callback_type=${startCallbackType}`;

    const startEventIdGiven: boolean = startEventId !== undefined;
    if (startEventIdGiven) {
      restPath = `${restPath}&${restSettings.queryParams.startEventId}=${startEventId}`;
    }

    if (startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached) {
      restPath = `${restPath}&${restSettings.queryParams.endEventId}=${endEventId}`;
    }

    const url: string = this._applyBaseUrl(restPath);

    return url;
  }

  private _createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

    const authTokenNotProvided: boolean = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      return {};
    }

    const requestAuthHeaders: IRequestOptions = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private _applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private _createSocketIoSubscription(identity: IIdentity, route: string, callback: any, subscribeOnce: boolean): Subscription {

    const socketForIdentity: SocketIOClient.Socket = this._createSocketForIdentity(identity);

    if (subscribeOnce) {
      socketForIdentity.once(route, callback);
    } else {
      socketForIdentity.on(route, callback);
    }

    const subscriptionId: string = uuid.v4();
    const subscription: Subscription = new Subscription(subscriptionId, route, subscribeOnce);

    this._subscriptionCollection[subscriptionId] = callback;

    return subscription;
  }

  private _createSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {

    const existingSocket: SocketIOClient.Socket = this._getSocketForIdentity(identity);
    if (existingSocket) {
      return existingSocket;
    }

    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const socketUrl: string = `${this.config.socketUrl}/${socketSettings.namespace}`;
    const socketIoOptions: SocketIOClient.ConnectOpts = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: identity.token,
          },
        },
      },
    };

    this._socketCollection[identity.userId] = io(socketUrl, socketIoOptions);

    return this._socketCollection[identity.userId];
  }

  private _removeSocketForIdentity(identity: IIdentity): void {
    const socketForIdentity: SocketIOClient.Socket = this._getSocketForIdentity(identity);

    const noSocketFound: boolean = !socketForIdentity;
    if (noSocketFound) {
      return;
    }
    socketForIdentity.disconnect();
    socketForIdentity.close();

    delete this._socketCollection[identity.userId];
  }

  private _getSocketForIdentity(identity: IIdentity): SocketIOClient.Socket {
    return this._socketCollection[identity.userId];
  }
}
