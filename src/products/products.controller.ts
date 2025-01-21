import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CategoryPipes } from './Pipes/Category.pipes';
import { Permission } from './permissions.guard';
import { HasUser } from 'src/guards/hasUser.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProduct } from './DTOs/create-product.dto';
import { UpdateProduct } from './DTOs/update-product.dto';

@ApiTags('Products')
@UseGuards(Permission)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOkResponse({
    example: [
      {
        id: 1,
        name: 'cup',
        price: '100',
        category: 'kitchen',
        createdAt: '2024-01-22T10:00:00Z',
      },
    ],
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'price', required: false })
  @ApiQuery({ name: 'lang', enum: ['en', 'ka'], default: 'en' })
  @Get()
  @UseGuards(HasUser)
  getProducts(
    @Req() request,
    @Query('id', new ParseIntPipe({ optional: true })) id,
    @Query(new CategoryPipes()) productFilters,
    @Query('lang', new DefaultValuePipe('en')) lang,
  ) {
    if (id) {
      return this.productsService.getProductById(id, lang);
    }
    const userId = request.userId;
    return this.productsService.getAllProducts(productFilters, lang, userId);
  }

  @ApiOkResponse({
    example: {
      id: 1,
      name: 'cup',
      price: '100',
      category: 'kitchen',
      createdAt: '2024-01-22T10:00:00Z',
    },
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiQuery({ name: 'lang', enum: ['en', 'ka'], default: 'en' })
  @ApiBadRequestResponse({
    example: {
      message: 'Product not found',
      error: 'Not Found',
      status: 404,
    },
  })
  @Get(':id')
  getProductById(
    @Param('id', ParseIntPipe) id,
    @Query('lang', new DefaultValuePipe('en')) lang,
  ) {
    return this.productsService.getProductById(id, lang);
  }

  @ApiOkResponse({
    example: {
      id: 3,
      name: 'New Cup',
      price: '120',
      category: 'kitchen',
      createdAt: '2024-01-22T10:00:00Z',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Fields are required',
      error: 'Bad Request',
      status: 400,
    },
  })
  @ApiQuery({ name: 'lang', enum: ['en', 'ka'], default: 'en' })
  @Post()
  createProduct(
    @Body() body: CreateProduct,
    @Headers() header,
    @Query('lang', new DefaultValuePipe('en')) lang,
  ) {
    return this.productsService.createProduct(body, lang);
  }

  @ApiOkResponse({
    example: {
      ka: [
        {
          id: 1,
          name: 'ჭიქა',
          price: '100',
          category: 'სამზარეულო',
          createdAt: '2024-01-22T10:00:00Z',
        },
      ],
      en: [
        {
          id: 1,
          name: 'cup',
          price: '100',
          category: 'kitchen',
          createdAt: '2024-01-22T10:00:00Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Product ID is invalid',
      error: 'Bad Request',
      status: 400,
    },
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiQuery({ name: 'lang', enum: ['en', 'ka'], default: 'en' })
  @Delete(':id')
  deleteProduct(
    @Param() params,
    @Query('lang', new DefaultValuePipe('en')) lang,
  ) {
    return this.productsService.deleteProduct(Number(params.id), lang);
  }

  @ApiOkResponse({
    example: {
      id: 1,
      name: 'Updated Cup',
      price: '150',
      category: 'kitchen',
      createdAt: '2024-01-22T10:00:00Z',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Product ID is invalid',
      error: 'Bad Request',
      status: 400,
    },
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiQuery({ name: 'lang', enum: ['en', 'ka'], default: 'en' })
  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id,
    @Body() body: UpdateProduct,
    @Query('lang', new DefaultValuePipe('en')) lang,
  ) {
    return this.productsService.updateProduct(id, body, lang);
  }
}
