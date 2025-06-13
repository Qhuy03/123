// send-mail.dto.ts
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SendMailDto {
  @IsEmail({}, { message: 'Địa chỉ email người nhận không hợp lệ.' })
  readonly toEmail: string;

  @IsString({ message: 'Chủ đề email phải là chuỗi văn bản.' })
  @Length(1, 255, {
    message:
      'Chủ đề email không được để trống và không được dài quá 255 ký tự.',
  })
  readonly subject: string;

  @IsString({ message: 'Nội dung email phải là chuỗi văn bản.' })
  readonly text: string;

  @IsEmail({}, { message: 'Địa chỉ email người gửi không hợp lệ.' })
  @IsOptional()
  readonly from?: string;

  @IsOptional()
  readonly attachments?: Array<{
    filename: string;
    path: string;
    cid?: string;
  }>;

  @IsOptional()
  @IsString({ message: 'Tên người gửi phải là chuỗi văn bản.' })
  readonly fromName?: string;

  @IsOptional()
  @IsString()
  readonly template?: string;
}
