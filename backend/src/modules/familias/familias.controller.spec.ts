import { Test, TestingModule } from '@nestjs/testing';
import { forwardRef } from '@nestjs/common';
import { FamiliasController } from './familias.controller';
import { FamiliasService } from './familias.service';
import { ArticulosModule } from '../articulos/articulos.module';

describe('FamiliasController', () => {
  let controller: FamiliasController;
  let service: FamiliasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamiliasController],
      providers: [FamiliasService],
      imports: [forwardRef(() => ArticulosModule)],
    }).compile();

    controller = module.get<FamiliasController>(FamiliasController);
    service = module.get<FamiliasService>(FamiliasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of familias', () => {
      const result = controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a familia when found', () => {
      service['familias'] = [
        {
          id: 1,
          name: 'Test Familia',
          created_at: new Date(),
          updated_at: new Date(),
          articulos: [],
        },
      ];

      const result = controller.findOne('1');
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Familia');
    });

    it('should throw error when not found', () => {
      service['familias'] = [];

      expect(() => controller.findOne('1')).toThrow('Familia no encontrada');
    });

    it('should throw error for invalid ID', () => {
      expect(() => controller.findOne('invalid')).toThrow('ID inválido');
    });
  });
});