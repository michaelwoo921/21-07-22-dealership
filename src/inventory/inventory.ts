import fs from 'fs';
import logger from '../log';
import inventoryService from './inventory.service';

export interface Inventory {

  owner: string;
  car_id: number;
  make: string;
  model: string;
  price: number;
  stock?: number;
}

export function itemString(item: Inventory){
  return item.car_id +'. ' + item.make + ' ' + item.model + '-$' + item.price;
}

export function displayContents(owner:string){
  logger.trace('displayContents called!');
  inventoryService.getItemsForDisplay().then(items => {
    items.forEach(item => {
      if(item.owner === owner){
        console.log(itemString(item));
      }
    });

  })
}

export function createItem(item: Inventory){
  inventoryService.addItem(item).then(res => {
    logger.trace(res);

  }).catch(err => {
    
    logger.error(err);

  })
}
