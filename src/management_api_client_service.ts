import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {
  EventList,
  IManagementApiAccessor,
  IManagementApiService,
  ManagementContext,
  ProcessModelExecution,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

export class ManagementApiClientService implements IManagementApiService {

  private _managementApiAccessor: IManagementApiAccessor = undefined;

  constructor(managementApiAccessor: IManagementApiAccessor) {
    this._managementApiAccessor = managementApiAccessor;
  }

  public get managementApiAccessor(): IManagementApiAccessor {
    return this._managementApiAccessor;
  }

  public async startProcessInstance(context: ManagementContext,
                                    processModelKey: string,
                                    startEventKey: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventKey?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    if (!Object.values(ProcessModelExecution.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached && !endEventKey) {
      throw new EssentialProjectErrors.BadRequestError(`Must provide an EndEventKey, when using callback type 'CallbackOnEndEventReached'!`);
    }

    return this.managementApiAccessor.startProcessInstance(context, processModelKey, startEventKey, payload, startCallbackType, endEventKey);
  }

  public async getEventsForProcessModel(context: ManagementContext, processModelKey: string): Promise<EventList> {
    return this.managementApiAccessor.getEventsForProcessModel(context, processModelKey);
  }

  // UserTasks
  public async getUserTasksForProcessModel(context: ManagementContext, processModelKey: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModel(context, processModelKey);
  }

  public async getUserTasksForCorrelation(context: ManagementContext, correlationId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForCorrelation(context, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(context: ManagementContext,
                                                        processModelKey: string,
                                                        correlationId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(context, processModelKey, correlationId);
  }

  public async finishUserTask(context: ManagementContext,
                              processModelKey: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    return this.managementApiAccessor.finishUserTask(context, processModelKey, correlationId, userTaskId, userTaskResult);
  }

}
