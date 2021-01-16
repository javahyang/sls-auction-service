import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function setAuctionPictureUrl(id, pictureUrl) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set pictureUrl = :pictureUrl', // pictureUrl 필드가 없으면 자동 생성됨
    ExpressionAttributeValues: {
      ':pictureUrl': pictureUrl
    },
    ReturnValues: 'ALL_NEW' // 저장하고 새로운 데이터를 받고싶은 경우
  }

  const result = await dynamodb.update(params).promise()
  return result.Attributes // 업데이트된 항목들 가져오기
}
