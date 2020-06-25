'use strict';
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  const username = body.username;
  const password = body.password;
  const newUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      pk: username,
      password: bcrypt.hashSync(password, 10)
    }
  }
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const putResult = await dynamodb.put(newUserParams).promise();
    return {
      statusCode: 200,
      headers: {
        "Allow-Contol-Allow-Origin": "*",
        "Allow-Contol-Allow-Credentials": true,
        "Allow-Contol-Allow-Headers": "Authorization"
      },
      body: JSON.stringify("User creation successfull")
    }
  } catch (putError) {
    console.log("User creation error");
    console.log("put error", putError);
    return new Error("User creation error");
  }

};
