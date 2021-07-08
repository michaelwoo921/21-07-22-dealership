import fs from 'fs';
import logger from '../log';

interface Inventory {

  owner: string;
  car_id: number;
  make: string;
  model: string;
  price: number;
  stock: number;
}


export let inventory: Inventory;

export function loadInventory(){
  fs.readFile('inventory.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
   inventory = JSON.parse(data);
   logger.debug('inventory: ',inventory);
  })
}
