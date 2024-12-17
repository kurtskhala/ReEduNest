import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
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

@UseGuards(Permission)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
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

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id, @Query('lang', new DefaultValuePipe('en')) lang,) {
    return this.productsService.getProductById(id, lang);
  }

  @Post()
  createProduct(@Body() body, @Headers() header, @Query('lang', new DefaultValuePipe('en')) lang,) {
    // if (header.password !== '12345')
    //   throw new HttpException('Permision not granted', HttpStatus.UNAUTHORIZED);
    return this.productsService.createProduct(body, lang);
  }

  @Delete(':id')
  deleteProduct(@Param() params, @Query('lang', new DefaultValuePipe('en')) lang,) {
    return this.productsService.deleteProduct(Number(params.id), lang);
  }

  @Put(':id')
  updateProduct(@Param('id', ParseIntPipe) id, @Body() body, @Query('lang', new DefaultValuePipe('en')) lang,) {
    return this.productsService.updateProduct(id, body, lang);
  }
}


