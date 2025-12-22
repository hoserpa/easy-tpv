import { Test, TestingModule } from '@nestjs/testing';
import { forwardRef } from '@nestjs/common';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { FamiliasModule } from '../familias/familias.module';

describe('ArticulosController', () => {
  let controller: ArticulosController;
  let service: ArticulosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticulosController],
      providers: [ArticulosService],
      imports: [forwardRef(() => FamiliasModule)],
    }).compile();

    controller = module.get<ArticulosController>(ArticulosController);
    service = module.get<ArticulosService>(ArticulosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of articulos', () => {
      const result = controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return an articulo when found', () => {
      service['articulos'] = [
        {
          id: 1,
          name: 'Test Artículo',
          price: 10.0,
          family_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          familia: {} as any,
          ticketLines: [],
        },
      ];

      const result = controller.findOne('1');
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Artículo');
    });

    it('should throw error when not found', () => {
      service['articulos'] = [];

      expect(() => controller.findOne('1')).toThrow('Artículo no encontrado');
    });

    it('should throw error for invalid ID', () => {
      expect(() => controller.findOne('invalid')).toThrow('ID inválido');
    });
  });
});
