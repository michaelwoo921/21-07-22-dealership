import docClient from '../dynamo/dynamo';
import logger from '../log';
import {Inventory} from './inventory';


class InventoryService {
  private doc;
  constructor(){
    this.doc = docClient;
  }

  async getItems(): Promise<Inventory[]>{
    const params = {
      TableName: "dealership"
    };

    return await this.doc.scan(params).promise().then(data => {
        return data.Items as Inventory[];                                                                              

  })
}

async getItemsForDisplay(): Promise<Inventory[]>{
  const params = {
    TableName: "dealership",
    ProjectionExpression: '#owner, #car_id, #make, #model, #price, #payment_info',
    ExpressionAttributeNames: {
      '#owner': 'owner',
      '#car_id': 'car_id',
      '#make': 'make',
      '#model': 'model',
      '#price': 'price',
      '#payment_info': 'payment_info'
    }
  };

  return await this.doc.scan(params).promise().then(data => {
      return data.Items as Inventory[];                                                                              
})
}


async getItemByKeys(owner:string, car_id: number) : Promise<Inventory| null>{
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

async addItem(inventory: Inventory): Promise<boolean>{
  const params ={
    TableName: 'dealership',
    Item: inventory,
    ConditionExpression: '#c_id <> :car_id AND #o <> :owner',
    ExpressionAttributeNames: {
      '#c_id': 'car_id',
      '#o': 'owner'
    },
    ExpressionAttributeValues: {
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

async updateItem(inventory: Inventory): Promise<boolean>{
  const params ={
    TableName: 'dealership',
    Key: {
      'owner': inventory.owner,
      'car_id': inventory.car_id
    },
    UpdateExpression: 'set stock = :s, price = :p',
    ExpressionAttributeValues: {
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


