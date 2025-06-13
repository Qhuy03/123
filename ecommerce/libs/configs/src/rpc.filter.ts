import { Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionsCustom extends BaseRpcExceptionFilter {
  catch(exception, host) {
    console.log("RPC EXCEPTION FILTER");
    // Nếu exception là một instance của RpcException, giữ nguyên nó
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    // Nếu exception không phải là RpcException, chuyển nó thành RpcException
    const rpcException = new RpcException({
      ...exception
    });


    console.log("RETURN RPC Exception: " + rpcException);

    // Gọi super để tiếp tục xử lý và trả về RpcException
    return super.catch(rpcException, host);
  }
}
