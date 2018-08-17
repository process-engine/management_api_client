import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';

import {ActiveToken, FlowNodeRuntimeInformation} from '@process-engine/kpi_api_contracts';
import {LogEntry} from '@process-engine/logging_api_contracts';
import {
  Correlation,
  EventList,
  IManagementApiAccessor,
  ManagementContext,
  ProcessModelExecution,
  restSettings,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';
import {TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

export class ExternalAccessor implements IManagementApiAccessor {

  private baseUrl: string = 'api/management/v1';

  private _httpClient: IHttpClient = undefined;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  public get httpClient(): IHttpClient {
    return this._httpClient;
  }

  public async getAllActiveCorrelations(context: ManagementContext): Promise<Array<Correlation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    const url: string = this._applyBaseUrl(restSettings.paths.activeCorrelations);

    const httpResponse: IResponse<Array<Correlation>> = await this.httpClient.get<Array<Correlation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModels(context: ManagementContext): Promise<ProcessModelExecution.ProcessModelList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    const url: string = this._applyBaseUrl(restSettings.paths.processModels);

    const httpResponse: IResponse<ProcessModelExecution.ProcessModelList> =
      await this.httpClient.get<ProcessModelExecution.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(context: ManagementContext, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<ProcessModelExecution.ProcessModel> =
      await this.httpClient.get<ProcessModelExecution.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(context: ManagementContext,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    const url: string = this._buildStartProcessInstanceUrl(processModelId, startEventId, startCallbackType, endEventId);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    const httpResponse: IResponse<ProcessModelExecution.ProcessStartResponsePayload> =
      await this.httpClient.post<ProcessModelExecution.ProcessStartRequestPayload,
        ProcessModelExecution.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEventsForProcessModel(context: ManagementContext, processModelId: string): Promise<EventList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.processModelEvents.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<EventList> = await this.httpClient.get<EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async updateProcessDefinitionsByName(context: ManagementContext,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                     ): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.updateProcessDefinitionsByName.replace(restSettings.params.processDefinitionsName, name);
    url = this._applyBaseUrl(url);

    await this.httpClient.post<ProcessModelExecution.UpdateProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
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

  // UserTasks
  public async getUserTasksForProcessModel(context: ManagementContext, processModelId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.processModelUserTasks.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this.httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(context: ManagementContext, correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this.httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(context: ManagementContext,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.processModelCorrelationUserTasks
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<UserTaskList> = await this.httpClient.get<UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(context: ManagementContext,
                              processModelId: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskId, userTaskId);

    url = this._applyBaseUrl(url);

    await this.httpClient.post<UserTaskResult, any>(url, userTaskResult, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<FlowNodeRuntimeInformation>> =
      await this.httpClient.get<Array<FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(context: ManagementContext,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<FlowNodeRuntimeInformation> =
      await this.httpClient.get<FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<ActiveToken>> = await this.httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(context: ManagementContext, flowNodeId: string): Promise<Array<ActiveToken>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<ActiveToken>> = await this.httpClient.get<Array<ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getLogsForProcessModel(context: ManagementContext, correlationId: string, processModelId: string): Promise<Array<LogEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getLogsForProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<LogEntry>> = await this.httpClient.get<Array<LogEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getTokensForFlowNodeInstance(context: ManagementContext,
                                            processModelId: string,
                                            correlationId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    let url: string = restSettings.paths.getTokensForFlowNode
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<Array<TokenHistoryEntry>> = await this.httpClient.get<Array<TokenHistoryEntry>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _createRequestAuthHeaders(context: ManagementContext): IRequestOptions {
    if (context.identity === undefined || context.identity === null) {
      return {};
    }

    const requestAuthHeaders: IRequestOptions = {
      headers: {
        Authorization: `Bearer ${context.identity}`,
      },
    };

    return requestAuthHeaders;
  }

  private _applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }
}
