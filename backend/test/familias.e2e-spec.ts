import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Familias API (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  const familiaDto = {
    name: 'Bebidas',
  }

  describe('/familias (POST)', () => {
    it('should create a new familia', () => {
      return request(app.getHttpServer())
        .post('/familias')
        .send(familiaDto)
        .expect(201)
        .then((response) => {
          expect(response.body.name).toBe(familiaDto.name)
          expect(response.body.id).toBeDefined()
          expect(response.body.created_at).toBeDefined()
        })
    })

    it('should return 400 for missing name', () => {
      return request(app.getHttpServer())
        .post('/familias')
        .send({})
        .expect(400)
    })

    it('should return 400 for empty name', () => {
      return request(app.getHttpServer())
        .post('/familias')
        .send({ name: '' })
        .expect(400)
    })
  })

  describe('/familias (GET)', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/familias')
        .expect(200)
        .expect([])
    })

    it('should return all familias', async () => {
      await request(app.getHttpServer())
        .post('/familias')
        .send({ name: 'Comida' })

      await request(app.getHttpServer())
        .post('/familias')
        .send({ name: 'Postres' })

      return request(app.getHttpServer())
        .get('/familias')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2)
          expect(response.body[0].name).toBe('Comida')
          expect(response.body[1].name).toBe('Postres')
        })
    })
  })

  describe('/familias/:id (GET)', () => {
    it('should return 404 for non-existent familia', () => {
      return request(app.getHttpServer())
        .get('/familias/999')
        .expect(404)
    })

    it('should return 400 for invalid ID', () => {
      return request(app.getHttpServer())
        .get('/familias/invalid')
        .expect(400)
    })

    it('should return specific familia', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/familias')
        .send({ name: 'Bebidas' })
        .expect(201)

      return request(app.getHttpServer())
        .get(`/familias/${createResponse.body.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Bebidas')
          expect(response.body.id).toBe(createResponse.body.id)
        })
    })
  })

  describe('/familias/:id (PATCH)', () => {
    it('should return 404 for non-existent familia', () => {
      return request(app.getHttpServer())
        .patch('/familias/999')
        .send({ name: 'Updated' })
        .expect(404)
    })

    it('should update existing familia', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/familias')
        .send({ name: 'Original' })
        .expect(201)

      return request(app.getHttpServer())
        .patch(`/familias/${createResponse.body.id}`)
        .send({ name: 'Updated' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated')
          expect(response.body.id).toBe(createResponse.body.id)
        })
    })
  })

  describe('/familias/:id (DELETE)', () => {
    it('should return 404 for non-existent familia', () => {
      return request(app.getHttpServer())
        .delete('/familias/999')
        .expect(404)
    })

    it('should delete existing familia', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/familias')
        .send({ name: 'To Delete' })
        .expect(201)

      return request(app.getHttpServer())
        .delete(`/familias/${createResponse.body.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe('Familia eliminada correctamente')
        })
    })
  })
})