/*tslint:disable:max-file-line-count*/
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

export class ExternalAccessor implements IManagementApiAccessor, IManagementSocketIoAccessor {

  private baseUrl: string = 'api/management/v1';

  private _socket: SocketIOClient.Socket;
  private _httpClient: IHttpClient;

  public config: any;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  // Notifications
  public initializeSocket(identity: IIdentity): void {
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
    this._socket = io(socketUrl, socketIoOptions);
  }

  public disconnectSocket(identity: IIdentity): void {
    this._socket.disconnect();
    this._socket.close();
  }

  public async onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskWaiting, callback); // TODO
  }

  public async onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskFinished, callback); // TODO
  }

  public async onUserTaskForIdentityWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskWaiting, callback); // TODO
  }

  public async onUserTaskForIdentityFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskFinished, callback); // TODO
  }

  public async onManualTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskWaiting, callback); // TODO
  }

  public async onManualTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskFinished, callback); // TODO
  }

  public async onManualTaskForIdentityWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskWaiting, callback); // TODO
  }

  public async onManualTaskForIdentityFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskFinished, callback); // TODO
  }

  public async onProcessTerminated(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessTerminatedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processTerminated, callback); // TODO
  }

  public async onProcessStarted(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processStarted, callback); // TODO
  }

  public async onProcessWithProcessModelIdStarted(
    identity: IIdentity,
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
  ): Promise<any> {
    this._ensureIsAuthorized(identity);

    /*
     * This will create the event name dynamically; the name consists of the event root path + the Process Model ID.
     */
    const eventName: string = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    this._socket.on(eventName, callback); // TODO
  }

  public async onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback): Promise<any> {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processEnded, callback); // TODO
  }

  public async removeSubscription(identity: IIdentity, subscription: Subscription): Promise<void> {
    this._ensureIsAuthorized(identity);

    return Promise.resolve(); // TODO
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

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
                                    startCallbackType: DataModels.ProcessModels.StartCallbackType =
                                      DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated,
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

  public async updateProcessDefinitionsByName(identity: IIdentity,
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

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(identity: IIdentity,
                              processInstanceId: string,
                              correlationId: string,
                              userTaskInstanceId: string,
                              userTaskResult: DataModels.UserTasks.UserTaskResult): Promise<void> {

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

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.correlationManualTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(identity: IIdentity,
                                                          processModelId: string,
                                                          correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processModelCorrelationManualTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<DataModels.ManualTasks.ManualTaskList> =
      await this._httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishManualTask(identity: IIdentity,
                                processInstanceId: string,
                                correlationId: string,
                                manualTaskInstanceId: string): Promise<void> {

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

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

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

  public async getActiveTokensForCorrelationAndProcessModel(identity: IIdentity,
                                                            correlationId: string,
                                                            processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

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

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            correlationId: string,
                                            processModelId: string,
                                            flowNodeId: string): Promise<Array<DataModels.TokenHistory.TokenHistoryEntry>> {

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

  public async getTokensForCorrelationAndProcessModel(identity: IIdentity,
                                                      correlationId: string,
                                                      processModelId: string): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.TokenHistory.TokenHistoryGroup> =
      await this._httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForProcessInstance(identity: IIdentity,
                                           processInstanceId: string): Promise<DataModels.TokenHistory.TokenHistoryGroup> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForProcessInstance
    .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.TokenHistory.TokenHistoryGroup> =
      await this._httpClient.get<DataModels.TokenHistory.TokenHistoryGroup>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _buildStartProcessInstanceUrl(processModelId: string,
                                        startEventId: string,
                                        startCallbackType: DataModels.ProcessModels.StartCallbackType,
                                        endEventId: string): string {

    let restPath: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.startEventId, startEventId);

    restPath = `${restPath}?start_callback_type=${startCallbackType}`;

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

  private _ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }
  }
}
