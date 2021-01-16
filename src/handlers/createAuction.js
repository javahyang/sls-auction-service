import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'
import validator from '@middy/validator'
import createAuctionSchema from '../lib/schemas/createAuctionSchema'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {
  const { title } = event.body
  const { email } = event.requestContext.authorizer // authorizer 통과 후 들어온 이벤트에는 JWT 의 사용자정보 있음
  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1)

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0
    },
    seller: email
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction
      })
      .promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error) //api-gateway 통해 실행되기에 에러던짐
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  }
}

export const handler = commonMiddleware(createAuction).use(validator({ inputSchema: createAuctionSchema }))
