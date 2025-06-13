import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from 'y/utils';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Skip wrapping for the /metrics endpoint
    if (request.url === '/metrics') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data?.success === false) return data; // Nếu là lỗi, giữ nguyên
        return SuccessResponse(
          data?.message || 'Request processed successfully',
          data?.data || data,
        );
      }),
    );
  }
}
