import { Component } from '@angular/core';
import { Product } from '../model/product.model';
import { Model } from '../model/repository.model';
import { ActivatedRoute } from '@angular/router';
import { HighlightTrigger } from './table.animations';
import { setPropertiesFromClasses, stateClassMap } from './animationUtils';
// import { MODES, SharedState } from './sharedState.service';

@Component({
  selector: 'paTable',
  templateUrl: 'table.component.html',
  animations: [HighlightTrigger],
})
export class TableComponent {
  category: string | null = null;

  // constructor(private model: Model, /*private state: SharedState*/) {}
  constructor(public model: Model, activeRoute: ActivatedRoute) {
    activeRoute.params.subscribe((params) => {
      this.category = params['category'] || null;
    });
  }

  getProduct(key: number): Product | undefined {
    return this.model.getProduct(key);
  }
  // getProducts(): Product[] {
  //   return this.model.getProducts();
  // }

  getProducts(): Product[] {
    return this.model
      .getProducts()
      .filter((p) => this.category == null || p.category == this.category);
  }
  get categories(): string[] {
    return this.model
      .getProducts()
      .map((p) => p.category)
      .filter(
        (c, index, array) => c != undefined && array.indexOf(c) == index
      ) as string[];
  }

  deleteProduct(key?: number) {
    if (key != undefined) {
      this.model.deleteProduct(key);
    }
  }

  highlightCategory: string = '';
  getRowState(category: string | undefined, elem: HTMLTableRowElement): string {
    let state =
      this.highlightCategory == ''
        ? ''
        : this.highlightCategory == category
        ? 'selected'
        : 'notselected';
    if (state != '') {
      setPropertiesFromClasses(state, elem);
    }
    return state;
  }
  // getRowState(category: string | undefined): string {
  //   return this.highlightCategory == ''
  //     ? ''
  //     : this.highlightCategory == category
  //     ? 'selected'
  //     : 'notselected';
  // }
  // editProduct(key?: number) {
  //   this.state.update(MODES.EDIT, key);
  // }
  // createProduct() {
  //   this.state.update(MODES.CREATE);
  // }
}
