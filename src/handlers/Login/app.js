const jwt = require("jsonwebtoken");

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `Erro: Essa lambda precisa ser um método HTTP POST - httpMethod: ${event.httpMethod}.`
    );
  }

  console.info("received:", event);

  const body = JSON.parse(event.body);
  const { email, password } = body;

  let response;

  if (email && password) {
    var params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":email": email,
      },
      ProjectionExpression: "email, password",
      FilterExpression: "email = :email",
    };

    const data = await docClient.scan(params).promise();

    const user = data.Items[0];

    if (user && user.password === password) {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          token: generateToken(email),
        }),
      };
    } else {
      response = {
        statusCode: 400,
        body: JSON.stringify({
          message: "Error: Email or Password Invalid",
        }),
      };
    }
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error: Email or Password Missing",
      }),
    };
  }

  return response;
};

const generateToken = (email) => {
  const session = {
    email,
  };

  const token = jwt.sign({ session }, process.env.SECRET, {
    expiresIn: process.env.DURATION,
  });
  console.info(`GENERATE TOKEN: ${token}`);
  return token;
};
