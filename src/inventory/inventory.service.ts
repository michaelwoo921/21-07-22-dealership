import docClient from '../dynamo/dynamo';
import logger from '../log';
import {Inventory} from './inventory';


class InventoryService {
  private doc;
  constructor(){
    this.doc = docClient;
  }

  async getItems(){
    const params = {
      TableName: "dealership"
    };

    return await this.doc.scan(params).promise().then(data => {
        return data.Items as Inventory[];                                                                              

  }).catch(error => {
    logger.error(error);
    return [];
  })
}

async getItemByKeys(owner:string, car_id: number){
  const params ={
    TableName: 'dealership',
    Key: {
      "owner": owner,
      "car_id": car_id
    }

  }
  return await this.doc.get(params).promise().then(data => {
    return data.Item as Inventory
  }).catch(err => null);
}

async addItem(inventory: Inventory){
  const params ={
    TableName: 'dealership',
    Item: inventory,
    ConditionExpression: '#c_id <> :car_id AND #o <> :owner',
    ExpressionAttributeNames: {
      '#c_id': 'car_id',
      '#o': 'owner'
    },
    ExpressAttributeNames: {
      ':car_id': inventory.car_id,
      ':owner': inventory.owner
    }

  };

  return await this.doc.put(params).promise().then(result => {
    logger.info('successfully updated item')
    return true;
  }).catch( error => {
    logger.error('error');
    return false;
  })
}

async updateItem(inventory: Inventory){
  const params ={
    TableName: 'dealership',
    Key: {
      'owner': inventory.owner,
      'car_id': inventory.car_id
    },
    UpdateExpression: 'set stock = :s, price = :p',
    ExpressAttributeValues: {
      ':p' : inventory.price,
      ':s': inventory.stock
    },
    ReturnValues: 'UPDATED_NEW'
  };
  return await this.doc.update(params).promise().then(data => {
    logger.debug(data);
    return true;
  }).catch(err => {
    logger.error(err);
    return false;
  })
}


}
const inventoryService = new InventoryService();
Object.freeze(inventoryService);
export default inventoryService;


