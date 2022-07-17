import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Product } from '../model/product.model';
import { Model } from '../model/repository.model';
import { Message } from '../messages/message.model';
import { MessageService } from '../messages/message.service';
import { MODES, SharedState, StateUpdate } from './sharedState.service';
import { FilteredFormArray } from './filteredFormArray';
import { LimitValidator } from '../validation/limit';
import { UniqueValidator } from '../validation/unique';
import { ProhibitedValidator } from '../validation/prohibited';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'paForm',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css'],
})
export class FormComponent {
  product: Product = new Product();
  editing: boolean = false;
  // nameField: FormControl = new FormControl('Initial Value', {
  //   updateOn: 'change',
  // });
  // nameField: FormControl = new FormControl('', {
  //   validators: [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.pattern('^[A-Za-z ]+$'),
  //   ],
  //   updateOn: 'change',
  // });
  // categoryField: FormControl = new FormControl();

  // productForm: FormGroup = new FormGroup({
  //   name: this.nameField,
  //   category: this.categoryField,
  // });
  keywordGroup = new FilteredFormArray([this.createKeywordFormControl()], {
    validators: UniqueValidator.unique(),
  });

  productForm: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z ]+$'),
      ],
      updateOn: 'change',
    }),
    category: new FormControl('', {
      validators: Validators.required,
      asyncValidators: ProhibitedValidator.prohibited(),
    }),
    price: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('^[0-9.]+$'),
        LimitValidator.Limit(300),
      ],
    }),
    details: new FormGroup({
      supplier: new FormControl('', { validators: Validators.required }),
      keywords: this.keywordGroup,
      // keywords: new FormControl('', { validators: Validators.required }),
    }),
  });

  constructor(
    public model: Model,
    activeRoute: ActivatedRoute,
    private router: Router
  ) {
    activeRoute.params.subscribe((params) => {
      this.editing = params['mode'] == 'edit';
      let id = params['id'];
      if (id != null) {
        model.getProductObservable(id).subscribe((p) => {
          Object.assign(this.product, p || new Product());
          this.productForm.patchValue(this.product);
        });
      }
    });
    // // this.editing = activeRoute.snapshot.url[1].path == 'edit';
    // this.editing = activeRoute.snapshot.params['mode'] == 'edit';
    // let id = activeRoute.snapshot.params['id'];
    // if (id != null) {
    //   // Object.assign(this.product, model.getProduct(id) || new Product());
    //   // this.productForm.patchValue(this.product);
    //   model.getProductObservable(id).subscribe((p) => {
    //     Object.assign(this.product, p || new Product());
    //     // this.productForm.patchValue(this.product);
    //     this.productForm.patchValue(this.product);
    //   });
    // }
  }
  // constructor(
  //   private model: Model,
  //   private state: SharedState,
  //   private messageService: MessageService
  // ) {
  //   this.state.changes.subscribe((upd) => this.handleStateChange(upd));
  //   this.messageService.reportMessage(new Message('Creating New Product'));
  // }
  // ngOnInit() {
  //   this.productForm.get('details')?.statusChanges.subscribe((newStatus) => {
  //     this.messageService.reportMessage(new Message(`Details ${newStatus}`));
  //   });
  // }
  // ngOnInit() {
  //   this.productForm.statusChanges.subscribe((newStatus) => {
  //     if (newStatus == 'INVALID') {
  //       let invalidControls: string[] = [];
  //       for (let controlName in this.productForm.controls) {
  //         if (this.productForm.controls[controlName].invalid) {
  //           invalidControls.push(controlName);
  //         }
  //       }
  //       this.messageService.reportMessage(
  //         new Message(`INVALID: ${invalidControls.join(', ')}`)
  //       );
  //     } else {
  //       this.messageService.reportMessage(new Message(newStatus));
  //     }
  //   });
  //   // this.nameField.statusChanges.subscribe((newStatus) => {
  //   //   if (newStatus == 'INVALID') {
  //   //     this.categoryField.disable();
  //   //   } else {
  //   //     this.categoryField.enable();
  //   //   }
  //   // });
  //   // this.nameField.statusChanges.subscribe((newStatus) => {
  //   //   if (newStatus == 'INVALID' && this.nameField.errors != null) {
  //   //     let errs = Object.keys(this.nameField.errors).join(', ');
  //   //     this.messageService.reportMessage(new Message(`INVALID: ${errs}`));
  //   //   } else {
  //   //     this.messageService.reportMessage(new Message(newStatus));
  //   //   }
  //   // });
  //   // this.nameField.valueChanges.subscribe((newValue) => {
  //   //   this.messageService.reportMessage(new Message(newValue || '(Empty)'));
  //   //   if (typeof newValue == 'string' && newValue.length % 2 == 0) {
  //   //     this.nameField.markAsPristine();
  //   //   }
  //   // });
  // }

  // handleStateChange(newState: StateUpdate) {
  //   this.editing = newState.mode == MODES.EDIT;
  //   this.keywordGroup.clear();
  //   if (this.editing && newState.id) {
  //     Object.assign(
  //       this.product,
  //       this.model.getProduct(newState.id) ?? new Product()
  //     );
  //     this.messageService.reportMessage(
  //       new Message(`Editing ${this.product.name}`)
  //     );
  //     this.product.details?.keywords?.forEach((val) => {
  //       this.keywordGroup.push(this.createKeywordFormControl());
  //     });
  //     // this.nameField.setValue(this.product.name);
  //     // this.categoryField.setValue(this.product.category);
  //   } else {
  //     this.product = new Product();
  //     this.messageService.reportMessage(new Message('Creating New Product'));
  //     // this.nameField.setValue('');
  //     // this.categoryField.setValue('');
  //   }
  //   if (this.keywordGroup.length == 0) {
  //     this.keywordGroup.push(this.createKeywordFormControl());
  //   }
  //   this.productForm.reset(this.product);
  // }

  createKeywordFormControl(): FormControl {
    return new FormControl('', {
      validators: Validators.pattern('^[A-Za-z ]+$'),
    });
  }
  addKeywordControl() {
    this.keywordGroup.push(this.createKeywordFormControl());
  }
  removeKeywordControl(index: number) {
    this.keywordGroup.removeAt(index);
  }

  resetForm() {
    this.keywordGroup.clear();
    this.keywordGroup.push(this.createKeywordFormControl());
    this.editing = true;
    this.product = new Product();
    this.productForm.reset();
  }

  submitForm() {
    if (this.productForm.valid) {
      Object.assign(this.product, this.productForm.value);
      this.model.saveProduct(this.product);
      // this.product = new Product();
      // this.keywordGroup.clear();
      // this.keywordGroup.push(this.createKeywordFormControl());
      // this.productForm.reset();
      this.router.navigateByUrl('/');
    }
  }
  // submitForm(form: NgForm) {
  //   if (form.valid) {
  //     this.model.saveProduct(this.product);
  //     this.product = new Product();
  //     form.resetForm();
  //   }
  // }
}
