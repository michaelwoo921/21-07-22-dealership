import * as AWS from 'aws-sdk';
import docClient from '../dynamo/dynamo';
import { Inventory } from '../inventory/inventory';
import { User } from '../user/user';
import logger from '../log';

AWS.config.update({ region: 'us-west-2' });

const dynamodb = new AWS.DynamoDB();

function deleteDealershipTable(callback: Function) {
  const removeDealershipSchema = {
    TableName: 'dealership',
  };
  dynamodb.deleteTable(removeDealershipSchema, function (err, data) {
    if (err) {
      logger.error('Unable to delete dealership table.');
    } else {
      logger.info('Deleted dealership table.');
    }

    setTimeout(() => {
      callback();
    }, 5000);
  });
}

function deleteUserTable(callback: Function) {
  const removeUserSchema = {
    TableName: 'users',
  };
  dynamodb.deleteTable(removeUserSchema, function (err, data) {
    if (err) {
      logger.error('Unable to delete user table.');
    } else {
      logger.info('Deleted user table.');
    }

    setTimeout(() => {
      callback();
    }, 5000);
  });
}

function createDealershipTable() {
  const dealershipSchema = {
    TableName: 'dealership',
    KeySchema: [
      { AttributeName: 'owner', KeyType: 'HASH' }, //Partition key
      { AttributeName: 'car_id', KeyType: 'RANGE' }, //Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'owner', AttributeType: 'S' },
      { AttributeName: 'car_id', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: 3,
    },
  };

  dynamodb.createTable(dealershipSchema, function (err, data) {
    if (err) {
      logger.error('Unable to create dealership table.');
    } else {
      logger.info('Created dealership table.');
    }
  });
}

function createUserTable() {
  const userSchema = {
    TableName: 'users',
    KeySchema: [
      { AttributeName: 'name', KeyType: 'HASH' }, //Partition key
    ],
    AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: 3,
    },
  };

  dynamodb.createTable(userSchema, function (err, data) {
    if (err) {
      logger.error('Unable to create users table.');
    } else {
      logger.info('Created users table.');
    }
  });
}

function addUser(user: User) {
  const params = { TableName: 'users', Item: user };
  docClient.put(params, function (err, data) {
    if (err) {
      logger.error('unable to add user: ' + JSON.stringify(err, null, 2));
    } else {
      logger.info('added user: ', data);
    }
  });
}

function addItem(item: Inventory) {
  const params = { TableName: 'dealership', Item: item };
  docClient.put(params, function (err, data) {
    if (err) {
      logger.error(
        'unable to add dealership item: ' + JSON.stringify(err, null, 2)
      );
    } else {
      logger.info('add dealership item: ', data);
    }
  });
}

function populateUserTable() {
  addUser({ name: 'Cindy', password: 'pass', role: 'Customer', money: 8000 });
  addUser({ name: 'David', password: 'pass', role: 'Customer', money: 8000 });
  addUser({ name: 'Jung', password: 'pass', role: 'Employee' });
  addUser({ name: 'Michael', password: 'pass', role: 'Employee' });
  addUser({ name: 'Abigail', password: 'pass', role: 'Customer', money: 8000 });
}

function populateDealershipTable() {
  addItem({
    owner: 'Cindy',
    car_id: 3,
    make: 'Kia',
    model: 'Forte',
    price: 12000,
  });
  addItem({
    owner: 'David',
    car_id: 2,
    make: 'Kia',
    model: 'Soul',
    price: 16000,
  });
  addItem({
    owner: 'dealer',
    car_id: 1,
    make: 'Kia',
    model: 'Rio',
    price: 25000,
    stock: 5,
  });
  addItem({
    owner: 'dealer',
    car_id: 2,
    make: 'Kia',
    model: 'Soul',
    price: 16000,
    stock: 10,
  });
}

deleteDealershipTable(createDealershipTable);
deleteUserTable(createUserTable);

setTimeout(() => {
  populateUserTable();
  populateDealershipTable();
}, 15000);
