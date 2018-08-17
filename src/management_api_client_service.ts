import * as EssentialProjectErrors from '@essential-projects/errors_ts';

import {ActiveToken, FlowNodeRuntimeInformation} from '@process-engine/kpi_api_contracts';
import {LogEntry} from '@process-engine/logging_api_contracts';
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
import {TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

export class ManagementApiClientService implements IManagementApiService {

  private _managementApiAccessor: IManagementApiAccessor = undefined;

  constructor(managementApiAccessor: IManagementApiAccessor) {
    this._managementApiAccessor = managementApiAccessor;
  }

  public get managementApiAccessor(): IManagementApiAccessor {
    return this._managementApiAccessor;
  }

  public async getAllActiveCorrelations(context: ManagementContext): Promise<Array<Correlation>> {

    return this.managementApiAccessor.getAllActiveCorrelations(context);
  }

  public async getProcessModels(context: ManagementContext): Promise<ProcessModelExecution.ProcessModelList> {

    return this.managementApiAccessor.getProcessModels(context);
  }

  public async getProcessModelById(context: ManagementContext, processModelId: string): Promise<ProcessModelExecution.ProcessModel> {

    return this.managementApiAccessor.getProcessModelById(context, processModelId);
  }

  public async startProcessInstance(context: ManagementContext,
                                    processModelId: string,
                                    startEventId: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventId?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    if (!Object.values(ProcessModelExecution.StartCallbackType).includes(startCallbackType)) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackType} is not a valid return option!`);
    }

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached && !endEventId) {
      throw new EssentialProjectErrors.BadRequestError(`Must provide an EndEventId, when using callback type 'CallbackOnEndEventReached'!`);
    }

    return this.managementApiAccessor.startProcessInstance(context, processModelId, startEventId, payload, startCallbackType, endEventId);
  }

  public async getEventsForProcessModel(context: ManagementContext, processModelId: string): Promise<EventList> {
    return this.managementApiAccessor.getEventsForProcessModel(context, processModelId);
  }

  public async updateProcessDefinitionsByName(context: ManagementContext,
                                              name: string,
                                              payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload,
                                          ): Promise<void> {

    return this.managementApiAccessor.updateProcessDefinitionsByName(context, name, payload);
  }

  // UserTasks
  public async getUserTasksForProcessModel(context: ManagementContext, processModelId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModel(context, processModelId);
  }

  public async getUserTasksForCorrelation(context: ManagementContext, correlationId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForCorrelation(context, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(context: ManagementContext,
                                                        processModelId: string,
                                                        correlationId: string): Promise<UserTaskList> {

    return this.managementApiAccessor.getUserTasksForProcessModelInCorrelation(context, processModelId, correlationId);
  }

  public async finishUserTask(context: ManagementContext,
                              processModelId: string,
                              correlationId: string,
                              userTaskId: string,
                              userTaskResult: UserTaskResult): Promise<void> {

    return this.managementApiAccessor.finishUserTask(context, processModelId, correlationId, userTaskId, userTaskResult);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<FlowNodeRuntimeInformation>> {

    return this.managementApiAccessor.getRuntimeInformationForProcessModel(context, processModelId);
  }

  public async getRuntimeInformationForFlowNode(context: ManagementContext,
                                                processModelId: string,
                                                flowNodeId: string): Promise<FlowNodeRuntimeInformation> {

    return this.managementApiAccessor.getRuntimeInformationForFlowNode(context, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(context: ManagementContext, processModelId: string): Promise<Array<ActiveToken>> {

    return this.managementApiAccessor.getActiveTokensForProcessModel(context, processModelId);
  }

  public async getActiveTokensForFlowNode(context: ManagementContext, flowNodeId: string): Promise<Array<ActiveToken>> {

    return this.managementApiAccessor.getActiveTokensForFlowNode(context, flowNodeId);
  }

  public async getLogsForProcessModel(context: ManagementContext, correlationId: string, processModelId: string): Promise<Array<LogEntry>> {

    return this.managementApiAccessor.getLogsForProcessModel(context, correlationId, processModelId);
  }

  public async getTokensForFlowNodeInstance(context: ManagementContext,
                                            processModelId: string,
                                            correlationId: string,
                                            flowNodeId: string): Promise<Array<TokenHistoryEntry>> {

    return this.managementApiAccessor.getTokensForFlowNodeInstance(context, processModelId, correlationId, flowNodeId);
  }

}
