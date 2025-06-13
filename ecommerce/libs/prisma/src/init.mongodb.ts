import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseProvider = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('PRODUCT_DATABASE_URL'),
    maxIdleTimeMS: 30000, // Thời gian tối đa mà kết nối có thể nằm im mà không có yêu cầu
    minPoolSize: 5, // Số lượng kết nối tối thiểu trong pool
  }),
});
