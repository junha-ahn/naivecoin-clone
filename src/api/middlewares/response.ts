import {Result} from '../../types' 

export default res => (result:Result = {
  httpCode: 500,
  message: '메세지가 존재하지 않습니다'
}) => (
  res.status(result.httpCode).send({
    message: result.message,
    data: result.data,
  }))
