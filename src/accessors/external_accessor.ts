import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ActiveToken,
  Correlation,
  EventList,
  FlowNodeRuntimeInformation,
  IManagementApiAccessor,
  LogEntry,
  ProcessModelExecution,
  restSettings,
  socketSettings,
  TokenHistoryEntry,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';
import {
  ProcessEndedMessage,
  ProcessEndType,
  UserTaskFinishedMessage,
  UserTaskWaitingMessage,
} from '@process-engine/process_engine_contracts';

import * as io from 'socket.io-client';

export class ExternalAccessor implements IManagementApiAccessor {

  private baseUrl: string = 'api/management/v1';

  private _socket: SocketIOClient.Socket = undefined;
  private _httpClient: IHttpClient = undefined;
  private _context: ManagementContext = undefined;

  public config: any;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getAllCorrelations);

    const httpResponse: IResponse<Array<Correlation>> = await this._httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public initializeSocket(context: ManagementContext): void {
    const socketUrl: string = `${this.config.socketUrl}/${socketSettings.namespace}`;
    const socketIoOptions: SocketIOClient.ConnectOpts = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: context.identity,
          },
        },
      },
    };
    this._socket = io(socketUrl, socketIoOptions);
  }

  public onUserTaskWaiting(callback: (userTaskWaiting: UserTaskWaitingMessage) => void|Promise<void>): void {
    this._socket.on(socketSettings.paths.userTaskWaiting, (userTaskWaiting: UserTaskWaitingMessage) => {
      callback(userTaskWaiting);
    });
  }

  public onUserTaskFinished(callback: (userTaskFinished: UserTaskFinishedMessage) => void|Promise<void>): void {
    this._socket.on(socketSettings.paths.userTaskFinished, (userTaskFinished: UserTaskFinishedMessage) => {
      callback(userTaskFinished);
    });
  }

  public onProcessTerminated(callback: (processEnded: ProcessEndedMessage) => void|Promise<void>): void {
    this._socket.on(socketSettings.paths.processEnded, (processEnded: ProcessEndedMessage) => {
      const isProcessTerminated: boolean = processEnded.endType === ProcessEndType.Terminated;
      if (isProcessTerminated) {
        callback(processEnded);
      }
    });
  }

  public onProcessEnded(callback: (processEnded: ProcessEndedMessage) => void|Promise<void>): void {
    this._socket.on(socketSettings.paths.processEnded, (processEnded: ProcessEndedMessage) => {
      const isProcessEnded: boolean = processEnded.endType === ProcessEndType.Ended;
      if (isProcessEnded) {
        callback(processEnded);
      }
    });
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.getActiveCorrelations);

    const httpResponse: IResponse<Array<Correlation>> = await this._httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths
      .getCorrelationById
      .replace(restSettings.params.correlationId, correlationId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Correlation> =
      await this._httpClient.get<Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getCorrelationByProcessInstanceId
      .replace(restSettings.params.processInstanceId, processInstanceId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Correlation> = await this._httpClient.get<Correlation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getCorrelationsByProcessModelId
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

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

    let url: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

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

  public async getEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.processModelEvents.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<EventList> = await this._httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                     ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    url = this._applyBaseUrl(url);

    await this._httpClient.post<ProcessModelExecution.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this._httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(identity: IIdentity,
                              processModelId: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskId, userTaskId);

    url = this._applyBaseUrl(url);

    await this._httpClient.post<UserTaskResult, any>(url, userTaskResult, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<FlowNodeRuntimeInformation>> =
      await this._httpClient.get<Array<FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<FlowNodeRuntimeInformation> =
      await this._httpClient.get<FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<ActiveToken>> = await this._httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<ActiveToken>> = await this._httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string): Promise<Array<LogEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getProcessModelLog
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<LogEntry>> = await this._httpClient.get<Array<LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            processModelId: string,
                                            correlationId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<TokenHistoryEntry>> = await this._httpClient.get<Array<TokenHistoryEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _buildStartProcessInstanceUrl(processModelId: string,
                                        startEventId: string,
                                        startCallbackType: ProcessModelExecution.StartCallbackType,
                                        endEventId: string): string {

    let url: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.startEventId, startEventId);

    url = `${url}?start_callback_type=${startCallbackType}`;

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached) {
      url = `${url}&${restSettings.queryParams.endEventId}=${endEventId}`;
    }

    url = this._applyBaseUrl(url);

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
}
