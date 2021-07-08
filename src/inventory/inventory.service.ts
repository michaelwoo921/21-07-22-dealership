import docClient from '../dynamo/dynamo';
import logger from '../log';
import {Inventory} from './inventory';

function addItem(item: Inventory){
  const params ={
    TableName: 'dealership',
    Item: item
  }
  docClient.put(params, function(err, data){
    if(err){
      logger.error('unable to add dealership item: ' + JSON.stringify(err, null,2));
    } else {
      logger.info('add dealership item: ' + JSON.stringify(data, null,2) );
    }
  });
}

