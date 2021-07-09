import fs from 'fs';
import logger from '../log';
import inventoryService from './inventory.service';

export interface Payment_Info {
  price: number,
  downpayment: number;
  loan: number;
  monthly_payment: number;
  payment_made: number;
  mon_financing: number;
  car_id: number;
}
export interface Inventory {

  owner: string;
  car_id: number;
  make: string;
  model: string;
  price: number;
  stock?: number;
  payment_info?: Payment_Info;
}

export function itemString(item: Inventory){
  return item.car_id +'. ' + item.make + ' ' + item.model + '-$' + item.price;
}

export function displayContents(owner:string, callback: Function){
  logger.trace('displayContents called!');
  inventoryService.getItemsForDisplay().then(items => {
    items.forEach(item => {
      if(item.owner === owner){
        console.log(itemString(item));
      }
    });
    callback();
  });

}

export function createItem(item: Inventory){
  inventoryService.addItem(item).then(res => {
    logger.trace(res);

  }).catch(err => {
    
    logger.error(err);

  })
}

export function updateItem(item: Inventory, callback: Function) {
  logger.trace(`update called with parameter ${JSON.stringify(item)}`);
  inventoryService.updateItem(item).then((bool)=>{
      callback();
  });
}

export function getByKeys(owner: string, car_id: number, success: Function, cont: Function, operation?:Function) {
  inventoryService.getItemByKeys(owner, car_id).then((selection) => {
      if (selection) {
          if(operation) {
              operation(selection);
          }
          success(selection as Inventory, cont);
      } else {
          console.log('Incorrect, try again.');
          cont();
      }
  })
}
