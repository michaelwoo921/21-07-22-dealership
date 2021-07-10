import fs from 'fs';
import logger from '../log';
import inventoryService from './inventory.service';

export interface Payment_Info {
  price: number,
  downpayment: number;
  loan: number;
  monthly_payment: number;
  payments_made: number;
  mon_financing: number;
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

export function createItem(item: Inventory, callback?:Function){
  inventoryService.addItem(item).then(res => {
    logger.trace(res);
    if(callback){
      callback();
    }
  }).catch(err => {
    
    logger.error(err);
    if(callback){
      callback();
    }
  })
}

export function updateItem(item: Inventory, success: Function) {
  logger.trace(`update called with parameter ${JSON.stringify(item)}`);
  inventoryService.updateItem(item).then((bool)=>{
      success();
  });
}

export function getByKeys(owner: string, car_id: number, callback: Function) {
  inventoryService.getItemByKeys(owner, car_id).then((selection) => {
    callback(selection);
  })
}

export function displayPayments(owner: string, callback: Function) {
  logger.trace('displayPayments called!');
  inventoryService.getItemsForDisplay().then((items)=>{
      items.forEach((item: any) => {
          if(item.owner === owner){
              let {payments_made, monthly_payment, mon_financing} = item.payment_info;
              console.log(`${item.make}- ${item.model} : made  ${payments_made} payments 
  of the amount of $${monthly_payment} for ${mon_financing} months
              `);
          }

          });
          
          callback();
  }).catch(()=>{console.log('error'); callback()});

}