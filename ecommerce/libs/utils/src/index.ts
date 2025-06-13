import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export const generateToken = async (data: any, key: string, expire: string) => {
  return await new JwtService({ secret: key }).signAsync(data, {
    expiresIn: expire,
  });
};

export const verifyToken = async (token: string, key: string) => {
  return await new JwtService({ secret: key }).verifyAsync(token);
};

export const replacePlaceHolder = (template: string, params: object) => {
  let result = template;

  Object.keys(params).forEach((key) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), params[key]);
  });

  return result;
};

export const SuccessResponse = (
  message: string,
  data: any = {},
  statusCode: number = 200,
) => ({
  success: true,
  message,
  statusCode,
  data,
});

export const updateNestedArrayParser = (data: Array<object>) => {
  // Kiểm tra xem dữ liệu có hợp lệ không
  if (!Array.isArray(data)) {
    console.error('Dữ liệu không hợp lệ!');
    return [];
  }

  // Kết quả chứa dữ liệu sau khi unwind
  const result = [];

  // Duyệt qua mỗi phần tử trong mảng user_roles
  data.forEach((userRole: any) => {
    // Duyệt qua mỗi phần tử trong mảng role_permissions
    userRole.role.role_permissions.forEach((permission) => {
      // Thêm permission_name vào mảng kết quả
      result.push(permission.permission.permission_name);
    });
  });

  return result;
};

export const encrypt = (text: string, secretKey: string) => {
  const hashedKey = createHash('sha256').update(secretKey).digest();

  const cipher = createCipheriv('aes-256-cbc', hashedKey, Buffer.alloc(16, 0)); // Sử dụng thuật toán AES
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Hàm giải mã
export const decrypt = (encryptedText: string, secretKey: string) => {
  const hashedKey = createHash('sha256').update(secretKey).digest();

  const decipher = createDecipheriv('aes-256-cbc', hashedKey, Buffer.alloc(16, 0)); // Sử dụng thuật toán AES
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const unGetSelectDataFromObject = (select: object, params: Array<string>) => {
  const newObject = { ...select };
  
  params.forEach(field => {
      delete newObject[field];
  });
  
  return newObject;
}