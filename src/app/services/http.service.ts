import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  post<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams): Observable<T> {
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
    );
  }

  get<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams): Observable<T> {
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
    );
  }

  getImage(requestParams: RequestParams): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(
      requestParams.url,
      {
        observe: 'response',
        responseType: 'blob',
        params: requestParams.params,
        headers: requestParams.headers,
      },
    ).pipe(
      map(response => response),
      catchError(response => {
        response.body = { error: response.error?.error };
        return of(response);
      }),
    );
  }

  put<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams): Observable<T> {
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
    );
  }

  delete<T = HttpResponse<SimpleResponse>>(requestParams: RequestParams): Observable<T> {
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
    );
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
