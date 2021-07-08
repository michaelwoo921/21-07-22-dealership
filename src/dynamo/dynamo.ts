import * as AWS from 'aws-sdk';

AWS.config.update({region: "us-west-2" });

const docClient = new AWS.DynamoDB.DocumentClient();
export default docClient;