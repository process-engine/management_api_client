import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {ActiveToken, FlowNodeRuntimeInformation} from '@process-engine/kpi_api_contracts';
import {LogEntry} from '@process-engine/logging_api_contracts';
import {
  Correlation,
  EventList,
  IManagementApiAccessor,
  IManagementApiService,
  ProcessModelExecution,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';
import {TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

export class InternalAccessor implements IManagementApiAccessor {

  private _managementApiService: IManagementApiService = undefined;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  public get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getAllActiveCorrelations(identity: IIdentity): Promise<Array<Correlation>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getAllActiveCorrelations(identity);
  }

  public async getProcessModelForCorrelation(identity: IIdentity, correlationId: string): Promise<ProcessModelExecution.ProcessModel> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getProcessModelForCorrelation(identity, correlationId);
  }

  public async getProcessModels(identity: IIdentity): Promise<ProcessModelExecution.ProcessModelList> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getProcessModelById(identity, processModelId);
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

    return this.managementApiService.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getEventsForProcessModel(identity: IIdentity, processModelId: string): Promise<EventList> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getEventsForProcessModel(identity, processModelId);
  }

  public async updateProcessDefinitionsByName(identity: IIdentity,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                          ): Promise<void> {

    return this.managementApiService.updateProcessDefinitionsByName(identity, name, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(identity: IIdentity, processModelId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getUserTasksForProcessModel(identity, processModelId);
  }

  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(identity: IIdentity,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId);
  }

  public async finishUserTask(identity: IIdentity,
                              processModelId: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.finishUserTask(identity, processModelId, correlationId, userTaskId, userTaskResult);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(identity: IIdentity,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getActiveTokensForProcessModel(identity, processModelId);

  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<ActiveToken>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

  public async getLogsForProcessModel(identity: IIdentity, correlationId: string, processModelId: string): Promise<Array<LogEntry>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getLogsForProcessModel(identity, correlationId, processModelId);
  }

  public async getTokensForFlowNodeInstance(identity: IIdentity,
                                            processModelId: string,
                                            correlationId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    this._ensureIsAuthorized(identity);

    return this.managementApiService.getTokensForFlowNodeInstance(identity, processModelId, correlationId, flowNodeId);
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
