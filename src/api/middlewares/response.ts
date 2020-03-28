interface Result {
  httpCode?: number,
  message?: String,
  data?: any, 
}

export default res => (result:Result = {}) => (
  res.status(result.httpCode || 500).send({
    message: result.message || '서버 내부에 장애가 발생했습니다.',
    data: result.data,
  }))
