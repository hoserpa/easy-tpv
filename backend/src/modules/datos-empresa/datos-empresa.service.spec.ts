import { Test, TestingModule } from '@nestjs/testing';
import { DatosEmpresaController } from './datos-empresa.controller';
import { DatosEmpresaService } from './datos-empresa.service';
import { DatosEmpresa } from '../common/entities/datos-empresa.entity';

describe('DatosEmpresaController', () => {
  let controller: DatosEmpresaController;
  let service: DatosEmpresaService;

  const mockDatosEmpresa: Partial<DatosEmpresa> = {
    id: 1,
    name: 'Test Empresa',
    nif: 'B12345678',
    address: 'Calle Test 123',
    phone: '600123456',
    email: 'test@empresa.com',
  };

  const mockDatosEmpresaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findFirst: jest.fn(),
    updateOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosEmpresaController],
      providers: [
        {
          provide: DatosEmpresaService,
          useValue: mockDatosEmpresaService,
        },
      ],
    }).compile();

    controller = module.get<DatosEmpresaController>(DatosEmpresaController);
    service = module.get<DatosEmpresaService>(DatosEmpresaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new datos empresa', async () => {
      mockDatosEmpresaService.create.mockResolvedValue(mockDatosEmpresa);

      const result = await controller.create(mockDatosEmpresa as any);

      expect(result).toEqual(mockDatosEmpresa);
      expect(service.create).toHaveBeenCalledWith(mockDatosEmpresa);
    });
  });

  describe('findAll', () => {
    it('should return an array of datos empresa', async () => {
      const expectedResult = [mockDatosEmpresa];
      mockDatosEmpresaService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single datos empresa', async () => {
      mockDatosEmpresaService.findOne.mockResolvedValue(mockDatosEmpresa);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockDatosEmpresa);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a datos empresa', async () => {
      const updateData = { name: 'Updated Empresa' };
      const updatedDatosEmpresa = { ...mockDatosEmpresa, ...updateData };
      mockDatosEmpresaService.findOne.mockResolvedValue(mockDatosEmpresa);
      mockDatosEmpresaService.update.mockResolvedValue(updatedDatosEmpresa);

      const result = await controller.update('1', updateData);

      expect(result).toEqual(updatedDatosEmpresa);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('remove', () => {
    it('should remove a datos empresa', async () => {
      mockDatosEmpresaService.findOne.mockResolvedValue(mockDatosEmpresa);
      mockDatosEmpresaService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
