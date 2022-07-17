import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { StaticDataSource } from './static.datasource';
import { Observable, ReplaySubject } from 'rxjs';
import { RestDataSource } from './rest.datasource';

@Injectable()
export class Model {
  private products: Product[];
  private locator = (p: Product, id?: number) => p.id == id;
  private replaySubject: ReplaySubject<Product[]>;

  // constructor(private dataSource: StaticDataSource) {
  //   this.products = new Array<Product>();
  //   this.dataSource.getData().forEach((p) => this.products.push(p));
  // }

  constructor(private dataSource: RestDataSource) {
    this.products = new Array<Product>();
    // this.dataSource.getData().subscribe((data) => (this.products = data));
    this.replaySubject = new ReplaySubject<Product[]>(1);
    this.dataSource.getData().subscribe((data) => {
      this.products = data;
      this.replaySubject.next(data);
      this.replaySubject.complete();
    });
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Product | undefined {
    return this.products.find((p) => this.locator(p, id));
  }

  getProductObservable(id: number): Observable<Product | undefined> {
    let subject = new ReplaySubject<Product | undefined>(1);
    this.replaySubject.subscribe((products) => {
      subject.next(products.find((p) => this.locator(p, id)));
      subject.complete();
    });
    return subject;
  }

  // saveProduct(product: Product) {
  //   if (product.id == 0 || product.id == null) {
  //     product.id = this.generateID();
  //     this.products.push(product);
  //   } else {
  //     let index = this.products.findIndex((p) => this.locator(p, product.id));
  //     this.products.splice(index, 1, product);
  //   }
  // }
  saveProduct(product: Product) {
    if (product.id == 0 || product.id == null) {
      this.dataSource
        .saveProduct(product)
        .subscribe((p) => this.products.push(p));
    } else {
      this.dataSource.updateProduct(product).subscribe((p) => {
        let index = this.products.findIndex((item) => this.locator(item, p.id));
        this.products.splice(index, 1, p);
      });
    }
  }
  // deleteProduct(id: number) {
  //   let index = this.products.findIndex((p) => this.locator(p, id));
  //   if (index > -1) {
  //     this.products.splice(index, 1);
  //   }
  // }

  deleteProduct(id: number) {
    this.dataSource.deleteProduct(id).subscribe(() => {
      let index = this.products.findIndex((p) => this.locator(p, id));
      if (index > -1) {
        this.products.splice(index, 1);
      }
    });
  }

  // private generateID(): number {
  //   let candidate = 100;
  //   while (this.getProduct(candidate) != null) {
  //     candidate++;
  //   }
  //   return candidate;
  // }
}
