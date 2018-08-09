import {
  Correlation,
  EventList,
  IManagementApiAccessor,
  IManagementApiService,
  ManagementContext,
  ProcessModelExecution,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';

export class InternalAccessor implements IManagementApiAccessor {

  private _managementApiService: IManagementApiService = undefined;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  public get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getAllActiveCorrelations(context: ManagementContext): Promise<Array<Correlation>> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getAllActiveCorrelations(context);
  }

  public async getProcessModels(context: ManagementContext): Promise<ProcessModelExecution.ProcessModelList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getProcessModels(context);
  }

  public async getProcessModelById(context: ManagementContext, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getProcessModelById(context, processModelId);
  }

  public async startProcessInstance(context: ManagementContext,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.startProcessInstance(context, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getEventsForProcessModel(context: ManagementContext, processModelId: string): Promise<EventList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getEventsForProcessModel(context, processModelId);
  }

  public async updateProcessDefinitionsByName(context: ManagementContext,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                          ): Promise<void> {

    return this.managementApiService.updateProcessDefinitionsByName(context, name, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(context: ManagementContext, processModelId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForProcessModel(context, processModelId);
  }

  public async getUserTasksForCorrelation(context: ManagementContext, correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForCorrelation(context, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(context: ManagementContext,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForProcessModelInCorrelation(context, processModelId, correlationId);
  }

  public async finishUserTask(context: ManagementContext,
                              processModelId: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.finishUserTask(context, processModelId, correlationId, userTaskId, userTaskResult);
  }

  private _ensureIsAuthorized(context: ManagementContext): void {

    // Note: When using an external accessor, this check is performed by the ConsumerApiHttp module.
    // Since that component is bypassed by the internal accessor, we need to perform this check here.
    if (!context || !context.identity) {
      throw new UnauthorizedError('No auth token provided!');
    }
  }
}
