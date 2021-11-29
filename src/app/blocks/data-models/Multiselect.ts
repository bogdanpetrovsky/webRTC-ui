import * as _ from 'underscore';

export interface MultiSelectOptionsInterface {
  remoteRequest: any;
  model: any;
  placeholder: string;
  required: boolean;
  label: string;
  preloadOptions?: boolean;
  single?: boolean;
  notFoundText?: string;
  errorMessage?: string;
  addTag?: boolean | ((term: string) => any | Promise<any>);
  isLoading?: boolean;
}

export class MultiSelect {
  remoteRequest: any;
  model: any;
  placeholder: string;
  items: any = [];
  selectedItems: any = [];
  label: string;
  preloadOptions: boolean;
  single: boolean;
  notFoundText: string;
  query: string;
  isInvalid: boolean;
  errorMessage?: string;
  addTag: boolean | ((term: string) => any | Promise<any>);
  isLoading?: boolean;

  constructor(options: MultiSelectOptionsInterface) {
   this.remoteRequest = options.remoteRequest;
   this.model = options.model;
   this.placeholder = options.placeholder;
   this.label = options.label;

   if (options.preloadOptions) { this.preloadOptions = options.preloadOptions; }
   if (options.single) { this.single = options.single; }
   if (options.notFoundText) { this.notFoundText = options.notFoundText; }
   if (options.addTag) { this.addTag = options.addTag; }
  }

  add(itemData): void {
    const model = new this.model(itemData);
    const alreadySelected = _.find(this.selectedItems, (item: any) => itemData.name === item.name);
    if (alreadySelected) { model.disabled = true; }
    this.items.push(model);
  }

  remove(item): void  {
    const items = [];
    const selectedItems = [];

    _.each(this.selectedItems, (elem: any) => {
      items.push(elem);
      if (item.name !== elem.name) {
        selectedItems.push(elem);
      }
    });

    this.updateSelection(selectedItems);
  }

  updateSelection(selectedItems?): void  {
    if (!selectedItems) { selectedItems = _.clone(this.selectedItems); }
    if (!selectedItems) { return; }
    if (!this.single) {
      this.items = [];
      this.selectedItems = [];
      this.addPreselectedItemsList(selectedItems);
    } else {
      this.setSingleItem(selectedItems);
    }
  }

  addPreselectedItemsList(itemsList): void  {
    itemsList.forEach((elem) => {
      const itemModel = new this.model(elem);
      this.items.push(itemModel);
      this.selectedItems.push(itemModel);
    } );
  }

  setSingleItem(item): boolean  {
    if (!item) { return false; }
    this.selectedItems = this.items.find(x => x.name === item.name);

    if (!this.selectedItems) {
      const itemModel = new this.model(item);
      this.items.push(itemModel);
      this.selectedItems = itemModel;
    }
  }

  getList(): any  {
    return this.selectedItems;
  }

  isSingleSelect(): boolean {
    return !!this.single;
  }

  getNotFoundText(): string {
    if (this.query) {
      return 'No Items Found...';
    } else {
      return this.notFoundText;
    }
  }

  setInvalidState(message?: string): void  {
    this.isInvalid = true;
    this.errorMessage = message;
  }

  clearInvalidState(): void  {
    this.isInvalid = false;
    this.errorMessage = null;
  }

  isEmpty(): boolean  {
    return this.selectedItems.length === 0;
  }
}
