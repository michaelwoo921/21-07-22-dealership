import dynamo from '../dynamo/dynamo';
import logger from '../log';
import {User} from './user';

class UserService {
  private doc;
  constructor(){
    this.doc = dynamo;
  }

  async getUserByName(name: string): Promise<User| null>{
    const params ={
      TableName: "users",
      Key: {
        "name": name
      }
    }
  
    return await this.doc.get(params).promise().then(data => {
      if(data && data.Item){
        logger.debug(`data.Item: ${JSON.stringify(data.Item)}`);
        return data.Item as User;
      }
      else {
        return null;
      }
    }).catch(err => null)
  }

async addUser(user: User): Promise<boolean> {
  const params = {
    TableName: 'users',
    Item: user,
    ConditionExpression: "#name <> :name",
    ExpressionAttributeNames:{
      "#name": 'name'
  },
    ExpressionAttributeValues:{
        ":name": user.name
    }

};
return await this.doc.put(params).promise().then(result => {
  logger.info(result);
  return true
}).catch(err => {
  logger.error(err);
  return false;
})
}
async updateUser(user: User): Promise<boolean>{
  const params = {
    TableName: 'users',
    Key:{
        'name': user.name
    },
    UpdateExpression: "set password = :p, money = :m",
    ExpressionAttributeValues:{
        ":m": user.money ,
        ":p" : user.password
    },
    ReturnValues:"UPDATED_NEW"
};
return this.doc.update(params).promise().then(data => {
  logger.debug(data);
  return true;
}).catch(err => {
  logger.error(err);
  return false;
})

}




}

const userService = new UserService();
export default userService;






