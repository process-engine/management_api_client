import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {
  IManagementApiAccessor,
  ManagementContext,
  ProcessModelExecution,
  restSettings,
} from '@process-engine/management_api_contracts';

export class ExternalAccessor implements IManagementApiAccessor {

  private baseUrl: string = 'api/management/v1';

  private _httpClient: IHttpClient = undefined;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  public get httpClient(): IHttpClient {
    return this._httpClient;
  }

  public async startProcessInstance(context: ManagementContext,
                                    processModelKey: string,
                                    startEventKey: string,
                                    payload: ProcessModelExecution.ProcessStartRequestPayload,
                                    startCallbackType: ProcessModelExecution.StartCallbackType =
                                      ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated,
                                    endEventKey?: string,
                                  ): Promise<ProcessModelExecution.ProcessStartResponsePayload> {

    const url: string = this._buildStartProcessInstanceUrl(processModelKey, startEventKey, startCallbackType, endEventKey);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(context);

    const httpResponse: IResponse<ProcessModelExecution.ProcessStartResponsePayload> =
      await this.httpClient.post<ProcessModelExecution.ProcessStartRequestPayload,
        ProcessModelExecution.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  private _buildStartProcessInstanceUrl(processModelKey: string,
                                        startEventKey: string,
                                        startCallbackType: ProcessModelExecution.StartCallbackType,
                                        endEventKey: string): string {

    let url: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelKey, processModelKey)
      .replace(restSettings.params.startEventKey, startEventKey);

    url = `${url}?start_callback_type=${startCallbackType}`;

    if (startCallbackType === ProcessModelExecution.StartCallbackType.CallbackOnEndEventReached) {
      url = `${url}&end_event_key=${endEventKey}`;
    }

    url = this._applyBaseUrl(url);

    return url;
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
