// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  console.info('received:', event);
 
  const id = event.pathParameters.id;
 
  var params = {
    TableName : tableName,
    ExpressionAttributeValues: {
      ":id": id,
    },
    FilterExpression: "id = :id"
  };
  const data = await docClient.scan(params).promise();
  const user = data.Items[0];

  console.info(user);

  let response;
  if(user) {
    response = {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error: User not existe"
      })
    };
  }
 
  return response;
}
