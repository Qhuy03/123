export interface IBaseRepository<T, FindUniqueArgs, FindManyArgs> {
  findAll(args?: FindManyArgs): Promise<T[]>; // Truy vấn nhiều kết quả với điều kiện tùy chọn
  findOne(args: FindUniqueArgs): Promise<T | null>; // Truy vấn một kết quả duy nhất với điều kiện tùy chọn
  create(data: Partial<T>): Promise<T>; // Tạo mới một bản ghi
  update(id: string | number, data: Partial<T>): Promise<T>; // Cập nhật bản ghi dựa trên id
  delete(id: string | number): Promise<T>; // Xóa bản ghi dựa trên id
}
