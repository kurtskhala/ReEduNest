import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';

class Query {
  name: string;
  price: string;
  category: string;
  cteatedAt: string;
}

export class CategoryPipes implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.category) {
      const categories = [
        'shopping',
        'food',
        'fitness',
        'transportation',
        'kitchen',
      ];
      if (!categories.includes(value.category)) {
        throw new HttpException('category not found', HttpStatus.NOT_FOUND);
      }
      if (value.price) {
        if (isNaN(value.price)) {
          throw new HttpException(
            'Price must be a valid number',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return value;
  }
}
