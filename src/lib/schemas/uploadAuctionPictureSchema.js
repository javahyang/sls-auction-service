const schema = {
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern: '=$' // base64 형식은 끝이 = 로 끝남
    }
  },
  required: ['body']
}

export default schema
