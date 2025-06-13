import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message'] || exception.message
        : exception.message || 'Internal server error';
    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      error: exception?.response || exception?.message || 'Unknown error',
    };

    // Log lỗi
    this.logger.error(
      `Status: ${status}, Error: ${JSON.stringify(errorResponse)}`,
    );

    response.status(status).json(errorResponse);
  }
}
