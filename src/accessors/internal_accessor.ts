import {UnauthorizedError} from '@essential-projects/errors_ts';
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
  Messages,
  ProcessModelExecution,
  TokenHistoryEntry,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

export class InternalAccessor implements IManagementApiAccessor {

  private _managementApiService: IManagementApi = undefined;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  // Notifications
  public onUserTaskWaiting(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskWaitingCallback): void {
    this._ensureIsAuthorized(identity);

    this._managementApiService.onUserTaskWaiting(identity, callback);
  }

  public onUserTaskFinished(identity: IIdentity, callback: Messages.CallbackTypes.OnUserTaskFinishedCallback): void {
    this._ensureIsAuthorized(identity);

    this._managementApiService.onUserTaskFinished(identity, callback);
  }

  public onProcessTerminated(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessTerminatedCallback): void {
    this._ensureIsAuthorized(identity);

    this._managementApiService.onProcessTerminated(identity, callback);
  }

  public onProcessEnded(identity: IIdentity, callback: Messages.CallbackTypes.OnProcessEndedCallback): void {
    this._ensureIsAuthorized(identity);

    this._managementApiService.onProcessEnded(identity, callback);
  }

  // Correlations
  public async getAllCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getAllCorrelations(identity);
  }

  public async getActiveCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveCorrelations(identity);
  }

  public async getCorrelationById(identity: IIdentity, correlationId: string): Promise<Correlation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationById(identity, correlationId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationByProcessInstanceId(identity, processInstanceId);
  }

  public async getCorrelationsByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<Correlation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getCorrelationsByProcessModelId(identity, processModelId);
  }

  // ProcessModels
  public async getProcessModels(identity: IIdentity): Promise<ProcessModelExecution.ProcessModelList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(identity: IIdentity,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getStartEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getStartEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                          ): Promise<void> {

    return this._managementApiService.updateProcessDefinitionsByName(identity, name, payload);
  }

  public async deleteProcessDefinitionsByProcessModelId(identity: IIdentity, processModelId: string): Promise<void> {
    this._ensureIsAuthorized(identity);

    return this._managementApiService.deleteProcessDefinitionsByProcessModelId(identity, processModelId);
  }

  // Events
  public async getWaitingEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    return this._managementApiService.getWaitingEventsForProcessModel(identity, processModelId);
  }

  public async getWaitingEventsForCorrelation(identity: IIdentity, correlationId: string): Promise<EventList> {

    return this._managementApiService.getWaitingEventsForCorrelation(identity, correlationId);
  }

  public async getWaitingEventsForProcessModelInCorrelation(identity: IIdentity, processModelId: string, correlationId: string): Promise<EventList> {

    return this._managementApiService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(identity: IIdentity, messageName: string, payload?: EventTriggerPayload): Promise<void> {

    return this._managementApiService.triggerMessageEvent(identity, messageName, payload);
  }

  public async triggerSignalEvent(identity: IIdentity, signalName: string, payload?: EventTriggerPayload): Promise<void> {

    return this._managementApiService.triggerSignalEvent(identity, signalName, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(identity: IIdentity,
                              processInstanceId: string,
                              correlationId: string,
                              userTaskInstanceId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForProcessModel(identity, processModelId);

  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getProcessModelLog(identity: IIdentity, processModelId: string, correlationId?: string): Promise<Array<LogEntry>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getProcessModelLog(identity, processModelId, correlationId);
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            correlationId: string,
                                            processModelId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    this._ensureIsAuthorized(identity);

    return this._managementApiService.getTokensForFlowNodeInstance(identity, correlationId, processModelId, flowNodeId);
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
