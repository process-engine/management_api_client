import {
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

  public async startProcessInstance(context: ManagementContext,
                                    processModelKey: string,
                                    startEventKey: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventKey?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.startProcessInstance(context, processModelKey, startEventKey, payload, startCallbackType, endEventKey);
  }

  public async getEventsForProcessModel(context: ManagementContext, processModelKey: string): Promise<EventList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getEventsForProcessModel(context, processModelKey);
  }

  // UserTasks
  public async getUserTasksForProcessModel(context: ManagementContext, processModelKey: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForProcessModel(context, processModelKey);
  }

  public async getUserTasksForCorrelation(context: ManagementContext, correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForCorrelation(context, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(context: ManagementContext,
                                                        processModelKey: string,
                                                        correlationId: string): Promise<UserTaskList> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.getUserTasksForProcessModelInCorrelation(context, processModelKey, correlationId);
  }

  public async finishUserTask(context: ManagementContext,
                              processModelKey: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    this._ensureIsAuthorized(context);

    return this.managementApiService.finishUserTask(context, processModelKey, correlationId, userTaskId, userTaskResult);
  }

  private _ensureIsAuthorized(context: ManagementContext): void {

    // Note: When using an external accessor, this check is performed by the ConsumerApiHttp module.
    // Since that component is bypassed by the internal accessor, we need to perform this check here.
    if (!context || !context.identity) {
      throw new UnauthorizedError('No auth token provided!');
    }
  }
}
