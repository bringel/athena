import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PromiseHttpService {

  constructor(private http: Http) { }

  public get(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Get, ''), options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Post, body), options);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Put, body), options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Delete, ''), options);
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Patch, body), options);
  }

  public head(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Head, ''), options);
  }

  public options(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.request(this.createRequest(url, RequestMethod.Options, ''), options);
  }

  private createRequest(url: string, method: RequestMethod, body: any) {
    return new Request({
      'url': url,
      'method': method,
      'body': body
    });
  }

  private request(req: Request, options?: RequestOptionsArgs): Promise<Response> {
    let obs = this.http.request(req, options);
    return obs.toPromise();
  }
}
