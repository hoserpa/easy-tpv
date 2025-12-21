import { Test, TestingModule } from '@nestjs/testing'
import { ArticulosService } from './articulos.service'
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto'
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto'

describe('ArticulosService', () => {
  let service: ArticulosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticulosService],
    }).compile()

    service = module.get<ArticulosService>(ArticulosService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([])
    })
  })

  describe('create', () => {
    it('should create a new articulo', () => {
      const createArticuloDto: CreateArticuloDto = {
        family_id: 1,
        name: 'Coca Cola',
        price: 1.50,
      }

      const result = service.create(createArticuloDto)

      expect(result.id).toBe(1)
      expect(result.family_id).toBe(1)
      expect(result.name).toBe('Coca Cola')
      expect(result.price).toBe(1.50)
      expect(result.created_at).toBeInstanceOf(Date)
      expect(result.updated_at).toBeInstanceOf(Date)
    })
  })

  describe('findByFamily', () => {
    it('should return empty array for non-existent family', () => {
      expect(service.findByFamily(999)).toEqual([])
    })

    it('should return articulos for existing family', () => {
      const createArticuloDto1: CreateArticuloDto = {
        family_id: 5,
        name: 'Artículo 1',
        price: 10,
      }
      const createArticuloDto2: CreateArticuloDto = {
        family_id: 5,
        name: 'Artículo 2',
        price: 20,
      }
      const createArticuloDto3: CreateArticuloDto = {
        family_id: 10,
        name: 'Artículo 3',
        price: 30,
      }

      service.create(createArticuloDto1)
      service.create(createArticuloDto2)
      service.create(createArticuloDto3)

      const result = service.findByFamily(5)

      expect(result).toHaveLength(2)
      expect(result[0].family_id).toBe(5)
      expect(result[1].family_id).toBe(5)
    })
  })

  describe('update', () => {
    it('should return null for non-existent id', () => {
      const updateArticuloDto: UpdateArticuloDto = {
        name: 'Updated',
      }
      expect(service.update(999, updateArticuloDto)).toBeNull()
    })

    it('should update existing articulo', () => {
      const createArticuloDto: CreateArticuloDto = {
        family_id: 1,
        name: 'Original',
        price: 10,
      }
      const created = service.create(createArticuloDto)

      const updateArticuloDto: UpdateArticuloDto = {
        name: 'Updated',
        price: 15,
      }
      const result = service.update(created.id, updateArticuloDto)

      expect(result?.name).toBe('Updated')
      expect(result?.price).toBe(15)
      expect(result?.id).toBe(created.id)
      expect(result?.updated_at).not.toBe(created.updated_at)
    })

    it('should partially update articulo', () => {
      const createArticuloDto: CreateArticuloDto = {
        family_id: 1,
        name: 'Original',
        price: 10,
      }
      const created = service.create(createArticuloDto)

      const updateArticuloDto: UpdateArticuloDto = {
        price: 20,
      }
      const result = service.update(created.id, updateArticuloDto)

      expect(result?.name).toBe('Original')
      expect(result?.price).toBe(20)
    })
  })

  describe('remove', () => {
    it('should return false for non-existent id', () => {
      expect(service.remove(999)).toBe(false)
    })

    it('should remove existing articulo', () => {
      const createArticuloDto: CreateArticuloDto = {
        family_id: 1,
        name: 'To Delete',
        price: 5,
      }
      const created = service.create(createArticuloDto)

      const result = service.remove(created.id)

      expect(result).toBe(true)
      expect(service.findOne(created.id)).toBeNull()
    })
  })
})