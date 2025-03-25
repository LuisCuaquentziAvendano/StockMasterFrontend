import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  post<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams) {
    return this.httpClient.post(
      requestParams.url,
      requestParams.body,
      {
        observe: 'response',
        params: requestParams.params,
        headers: requestParams.headers,
      },
    ).pipe(
      map(response => response),
      catchError(response => {
        response.body = { error: response.error?.error };
        return of(response);
      }),
    ) as Observable<T>;
  }

  get<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams) {
    return this.httpClient.get(
      requestParams.url,
      {
        observe: 'response',
        params: requestParams.params,
        headers: requestParams.headers,
      },
    ).pipe(
      map(response => response),
      catchError(response => {
        response.body = { error: response.error?.error };
        return of(response);
      }),
    ) as Observable<T>;
  }

  put<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams) {
    return this.httpClient.put(
      requestParams.url,
      requestParams.body,
      {
        observe: 'response',
        params: requestParams.params,
        headers: requestParams.headers,
      },
    ).pipe(
      map(response => response),
      catchError(response => {
        response.body = { error: response.error?.error };
        return of(response);
      }),
    ) as Observable<T>;
  }

  delete<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams) {
    return this.httpClient.delete(
      requestParams.url,
      {
        observe: 'response',
        params: requestParams.params,
        headers: requestParams.headers,
        body: requestParams.body,
      },
    ).pipe(
      map(response => response),
      catchError(response => {
        response.body = { error: response.error?.error };
        return of(response);
      }),
    ) as Observable<T>;
  }
}

interface RequestParams {
  url: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  body?: Object;
}

interface SimpleResponse {
  error: string;
}
