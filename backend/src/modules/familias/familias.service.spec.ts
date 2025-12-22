import { Test, TestingModule } from '@nestjs/testing';
import { FamiliasService } from './familias.service';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';

describe('FamiliasService', () => {
  let service: FamiliasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamiliasService],
    }).compile();

    service = module.get<FamiliasService>(FamiliasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new familia', () => {
      const createFamiliaDto: CreateFamiliaDto = {
        name: 'Bebidas',
      };

      const result = service.create(createFamiliaDto);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Bebidas');
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it('should add familia to the list', () => {
      const createFamiliaDto: CreateFamiliaDto = {
        name: 'Comida',
      };

      service.create(createFamiliaDto);

      const familias = service.findAll();
      expect(familias).toHaveLength(1);
      expect(familias[0].name).toBe('Comida');
    });
  });

  describe('findOne', () => {
    it('should return null for non-existent id', () => {
      expect(service.findOne(999)).toBeNull();
    });

    it('should return familia for existing id', () => {
      const createFamiliaDto: CreateFamiliaDto = {
        name: 'Postres',
      };
      const created = service.create(createFamiliaDto);

      const result = service.findOne(created.id);

      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should return null for non-existent id', () => {
      const updateFamiliaDto: UpdateFamiliaDto = {
        name: 'Updated',
      };
      expect(service.update(999, updateFamiliaDto)).toBeNull();
    });

    it('should update existing familia', () => {
      const createFamiliaDto: CreateFamiliaDto = {
        name: 'Original',
      };
      const created = service.create(createFamiliaDto);

      const updateFamiliaDto: UpdateFamiliaDto = {
        name: 'Updated',
      };
      const result = service.update(created.id, updateFamiliaDto);

      expect(result?.name).toBe('Updated');
      expect(result?.id).toBe(created.id);
      expect(result?.updated_at).not.toBe(created.updated_at);
    });
  });

  describe('remove', () => {
    it('should return false for non-existent id', () => {
      expect(service.remove(999)).toBe(false);
    });

    it('should remove existing familia', () => {
      const createFamiliaDto: CreateFamiliaDto = {
        name: 'To Delete',
      };
      const created = service.create(createFamiliaDto);

      const result = service.remove(created.id);

      expect(result).toBe(true);
      expect(service.findOne(created.id)).toBeNull();
    });
  });
});
