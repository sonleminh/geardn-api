import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ObjectIdParamDto {
  /*
    Xử lý 2 trường hợp
    TH1: slug id cho phía client
    - tách object id từ slug id
    TH2: chỉ mỗi id cho phía admin
    - lấy thẳng id
    */
  @Transform(({ value }) => {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    const arr = String(value).split('-');
    return arr[arr.length - 1];
  })
  @IsMongoId({ message: 'Id sai kiểu dữ liệu!' })
  id: string;
}
