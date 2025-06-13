import { IsString, IsBoolean, IsOptional, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class RolesDTO {
  @IsUUID()
  @IsOptional() // ID có thể tùy chọn nếu không được truyền khi tạo mới
  id?: string;

  @IsString()
  role_name: string; // Tên vai trò

  @IsOptional()
  @IsString()
  role_description?: string | null; // Mô tả vai trò (tùy chọn hoặc null)

  @IsBoolean()
  @IsOptional() // Trường này có thể tùy chọn
  is_deleted?: boolean;

  @IsDate()
  @Type(() => Date) // Chuyển đổi thành kiểu Date
  @IsOptional()
  created_at?: Date; // Ngày tạo (tùy chọn)

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updated_at?: Date; // Ngày cập nhật (tùy chọn)

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deleted_at?: Date | null; // Ngày xóa (có thể null hoặc tùy chọn)
}
