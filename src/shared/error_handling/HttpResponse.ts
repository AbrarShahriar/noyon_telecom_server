export interface HttpResponse {
  message: string;
  payload: any | null;
  error: string | null;
}

export const createResponse = (res: HttpResponse): HttpResponse => res;
