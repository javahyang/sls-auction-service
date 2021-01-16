import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function uploadPictureToDynamoDB(auction, picture) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'set picture = :picture',
    ExpressionAttributeValues: {
      ':picture': picture
    },
    ReturnValues: 'ALL_NEW' // 저장하고 새로운 데이터를 받고싶은 경우
  }

  const result = await dynamodb.update(params).promise()
  return result
}
