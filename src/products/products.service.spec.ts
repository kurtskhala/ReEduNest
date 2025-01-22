import { UsersService } from 'src/users/users.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let usersService: UsersService;

  beforeEach(async () => {
    usersService = {
      getUserById: jest.fn(),
    } as any;

    service = new ProductsService(usersService);
  });

  describe('getAllProducts', () => {
    it('should return all products for language', () => {
      const result = service.getAllProducts({}, 'en', 1);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('cup');
    });

    it('should filter by category', () => {
      const result = service.getAllProducts({ category: 'food' }, 'en', 1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('bread');
    });

    it('should filter by price', () => {
      const result = service.getAllProducts({ price: '50' }, 'en', 1);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe('70'); // 100 * 0.7 for new user
    });

    it('should apply discount for new users', () => {
      jest.spyOn(usersService, 'getUserById').mockReturnValue({} as any);
      const result = service.getAllProducts({}, 'en', 1);
      expect(result[0].price).toBe('70'); // 100 * 0.7
      expect(result[1].price).toBe('0.7'); // 1 * 0.7
    });
  });

  describe('getProductById', () => {
    it('should return product by id', () => {
      const result = service.getProductById(1, 'en');
      expect(result.name).toBe('cup');
    });

    it('should throw error if product not found', () => {
      expect(() => service.getProductById(999, 'en')).toThrow(
        'Product not found',
      );
    });
  });

  describe('createProduct', () => {
    it('should create new product', () => {
      const newProduct = {
        name: 'test',
        price: '10',
        category: 'test',
        createdAt: 'today',
      };

      const result = service.createProduct(newProduct, 'en');

      // Verify new product was created correctly
      expect(result.name).toBe('test');

      // Verify we can retrieve the new product
      const savedProduct = service.getProductById(result.id, 'en');
      expect(savedProduct.name).toBe('test');
      expect(savedProduct.price).toBe('10');

      // Verify product exists in both languages
      const kaProduct = service.getProductById(result.id, 'ka');
      expect(kaProduct).toBeDefined();
    });

    it('should throw error if required fields missing', () => {
      expect(() =>
        service.createProduct(
          {
            name: '',
            price: '',
            category: '',
            createdAt: '',
          },
          'en',
        ),
      ).toThrow('Fields are required');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product from both languages', () => {
      // First create a product to delete
      const newProduct = service.createProduct(
        {
          name: 'to delete',
          price: '10',
          category: 'test',
          createdAt: '',
        },
        'en',
      );

      const result = service.deleteProduct(newProduct.id, 'en');

      // Verify deletion response
      expect(result.en[0].name).toBe('to delete');
      expect(result.ka[0].name).toBe('to delete');

      // Verify product was actually deleted
      expect(() => service.getProductById(newProduct.id, 'en')).toThrow(
        'Product not found',
      );
    });

    it('should throw error if product not found', () => {
      expect(() => service.deleteProduct(999, 'en')).toThrow(
        'Product ID is invalid',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update product in both languages', () => {
      const result = service.updateProduct(1, { name: 'updated' }, 'en');
      expect(result.name).toBe('updated');

      // Verify product was updated in both languages
      const enProduct = service.getProductById(1, 'en');
      const kaProduct = service.getProductById(1, 'ka');
      expect(enProduct.name).toBe('updated');
      expect(kaProduct.name).toBe('updated');
    });

    it('should throw error if product not found', () => {
      expect(() => service.updateProduct(999, { name: 'test' }, 'en')).toThrow(
        'Product ID is invalid',
      );
    });
  });
});
