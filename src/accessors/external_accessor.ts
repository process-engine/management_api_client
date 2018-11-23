/*tslint:disable:max-file-line-count*/

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ActiveToken,
  Correlation,
  EventList,
  EventTriggerPayload,
  FlowNodeRuntimeInformation,
  IManagementApiAccessor,
  LogEntry,
  ManualTaskList,
  Messages,
  ProcessModelExecution,
  restSettings,
  socketSettings,
  TokenHistoryEntry,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

import * as io from 'socket.io-client';

export class ExternalAccessor implements IManagementApiAccessor {

  private baseUrl: string = 'api/management/v1';

  private _socket: SocketIOClient.Socket = undefined;
  private _httpClient: IHttpClient = undefined;

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

  public onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskWaiting, callback);
  }

  public onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.userTaskFinished, callback);
  }

  public onManualTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskWaitingCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskWaiting, callback);
  }

  public onManualTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnManualTaskFinishedCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.manualTaskFinished, callback);
  }

  public onProcessTerminated(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessTerminatedCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processTerminated, callback);
  }

  public onProcessStarted(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processStarted, callback);
  }

  public onProcessWithProcessModelIdStarted(
    identity: IIdentity, callback: Messages.CallbackTypes.OnProcessStartedCallback, processModelId: string,
  ): void {
    this._ensureIsAuthorized(identity);

    const eventName: string = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    this._socket.on(eventName, callback);
  }

  public onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback): void {
    this._ensureIsAuthorized(identity);
    this._socket.on(socketSettings.paths.processEnded, callback);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getAllCorrelations);

    const httpResponse: IResponse<Array<Correlation>> = await this._httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getActiveCorrelations);

    const httpResponse: IResponse<Array<Correlation>> = await this._httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths
      .getCorrelationById
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Correlation> =
      await this._httpClient.get<Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getCorrelationByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Correlation> = await this._httpClient.get<Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getCorrelationsByProcessModelId
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<Correlation>> =
      await this._httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<ProcessModelExecution.ProcessModelList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.processModels);

    const httpResponse: IResponse<ProcessModelExecution.ProcessModelList> =
      await this._httpClient.get<ProcessModelExecution.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<ProcessModelExecution.ProcessModel> =
      await this._httpClient.get<ProcessModelExecution.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    const url: string = this._buildStartProcessInstanceUrl(processModelId, startEventId, startCallbackType, endEventId);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const httpResponse: IResponse<ProcessModelExecution.ProcessStartResponsePayload> =
      await this._httpClient.post<ProcessModelExecution.ProcessStartRequestPayload,
        ProcessModelExecution.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelStartEvents.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<EventList> = await this._httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                     ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<ProcessModelExecution.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.deleteProcessDefinitionsByProcessModelId.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.get(url, requestAuthHeaders);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingProcessModelEvents.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<EventList> = await this._httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingCorrelationEvents.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<EventList> = await this._httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEventsForProcessModelInCorrelation(identity: IIdentity, processModelId: string, correlationId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.waitingProcessModelCorrelationEvents
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<EventList> = await this._httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: EventTriggerPayload): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.triggerMessageEvent
      .replace(restSettings.params.eventName, messageName);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<EventTriggerPayload, any>(url, payload, requestAuthHeaders);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: EventTriggerPayload): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.triggerSignalEvent
      .replace(restSettings.params.eventName, signalName);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<EventTriggerPayload, any>(url, payload, requestAuthHeaders);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(identity: IIdentity,
                              processInstanceId: string,
                              correlationId: string,
                              userTaskInstanceId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<UserTaskResult, any>(url, userTaskResult, requestAuthHeaders);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processModelManualTasks.replace(restSettings.params.processModelId, processModelId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<ManualTaskList> = await this._httpClient.get<ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.correlationManualTasks.replace(restSettings.params.correlationId, correlationId);
    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<ManualTaskList> = await this._httpClient.get<ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(identity: IIdentity,
                                                          processModelId: string,
                                                          correlationId: string): Promise<ManualTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const urlRestPart: string = restSettings.paths.processModelCorrelationManualTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    const url: string = this._applyBaseUrl(urlRestPart);

    const httpResponse: IResponse<ManualTaskList> = await this._httpClient.get<ManualTaskList>(url, requestAuthHeaders);

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
  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<FlowNodeRuntimeInformation>> =
      await this._httpClient.get<Array<FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<FlowNodeRuntimeInformation> =
      await this._httpClient.get<FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<ActiveToken>> = await this._httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<ActiveToken>> = await this._httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<LogEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let restPath: string = restSettings.paths.getProcessModelLog
      .replace(restSettings.params.processModelId, processModelId);

    if (correlationId) {
      restPath = `${restPath}?${restSettings.queryParams.correlationId}=${correlationId}`;
    }

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<LogEntry>> = await this._httpClient.get<Array<LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            correlationId: string,
                                            processModelId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<TokenHistoryEntry>> = await this._httpClient.get<Array<TokenHistoryEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _buildStartProcessInstanceUrl(processModelId: string,
                                        startEventId: string,
                                        startCallbackType: ProcessModelExecution.StartCallbackType,
                                        endEventId: string): string {

    let restPath: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.startEventId, startEventId);

    restPath = `${restPath}?start_callback_type=${startCallbackType}`;

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached) {
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
