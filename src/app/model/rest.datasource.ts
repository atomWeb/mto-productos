import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, delay, Observable } from 'rxjs';
import { Product } from './product.model';

export const REST_URL = new InjectionToken('rest_url');

@Injectable()
export class RestDataSource {
  constructor(
    private http: HttpClient,
    @Inject(REST_URL) private url: string
  ) {}

  getData(): Observable<Product[]> {
    return this.sendRequest<Product[]>("GET", this.url);//.pipe(delay(5000));
    // return this.http.jsonp<Product[]>(this.url, "callback");
  }

  saveProduct(product: Product): Observable<Product> {
    return this.sendRequest<Product>('POST', this.url, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.sendRequest<Product>(
      'PUT',
      `${this.url}/${product.id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<Product> {
    return this.sendRequest<Product>('DELETE', `${this.url}/${id}`);
  }

  private sendRequest<T>(
    verb: string,
    url: string,
    body?: Product
  ): Observable<T> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set('Access-Key', '<secret>');
    myHeaders = myHeaders.set('Application-Names', [
      'exampleApp',
      'proAngular',
    ]);

    return this.http
      .request<T>(verb, url, {
        body: body,
        headers: myHeaders,
        // headers: new HttpHeaders({
        //   'Access-Key': '<secret>',
        //   'Application-Name': 'exampleApp',
        // }),
      })
      .pipe(
        catchError((error: Response) => {
          throw `Network Error: ${error.statusText} (${error.status})`;
        })
      );
  }
  // // getData(): Observable<Product[]> {
  // //   return this.http.get<Product[]>(this.url);
  // // }
  // // saveProduct(product: Product): Observable<Product> {
  // //   return this.http.post<Product>(this.url, product);
  // // }
  // updateProduct(product: Product): Observable<Product> {
  //   return this.http.put<Product>(`${this.url}/${product.id}`, product);
  // }
  // deleteProduct(id: number): Observable<Product> {
  //   return this.http.delete<Product>(`${this.url}/${id}`);
  // }
}
