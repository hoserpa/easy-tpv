import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Articulos API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const articuloDto = {
    family_id: 1,
    name: 'Coca Cola',
    price: 1.5,
  };

  describe('/articulos (POST)', () => {
    it('should create a new articulo', () => {
      return request(app.getHttpServer())
        .post('/articulos')
        .send(articuloDto)
        .expect(201)
        .then((response) => {
          expect(response.body.name).toBe(articuloDto.name);
          expect(response.body.family_id).toBe(articuloDto.family_id);
          expect(response.body.price).toBe(articuloDto.price);
          expect(response.body.id).toBeDefined();
          expect(response.body.created_at).toBeDefined();
        });
    });

    it('should return 400 for missing name', () => {
      return request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, price: 10 })
        .expect(400);
    });

    it('should return 400 for invalid family_id', () => {
      return request(app.getHttpServer())
        .post('/articulos')
        .send({ name: 'Test', family_id: -1, price: 10 })
        .expect(400);
    });

    it('should return 400 for negative price', () => {
      return request(app.getHttpServer())
        .post('/articulos')
        .send({ name: 'Test', family_id: 1, price: -10 })
        .expect(400);
    });
  });

  describe('/articulos (GET)', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/articulos')
        .expect(200)
        .expect([]);
    });

    it('should return all articulos', async () => {
      await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, name: 'Artículo 1', price: 10 });

      await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 2, name: 'Artículo 2', price: 20 });

      return request(app.getHttpServer())
        .get('/articulos')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          expect(response.body[0].name).toBe('Artículo 1');
          expect(response.body[1].name).toBe('Artículo 2');
        });
    });
  });

  describe('/articulos/family/:familyId (GET)', () => {
    it('should return 400 for invalid family ID', () => {
      return request(app.getHttpServer())
        .get('/articulos/family/invalid')
        .expect(400);
    });

    it('should return empty array for non-existent family', () => {
      return request(app.getHttpServer())
        .get('/articulos/family/999')
        .expect(200)
        .expect([]);
    });

    it('should return articulos for specific family', async () => {
      await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 5, name: 'Artículo Fam 1', price: 10 });

      await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 5, name: 'Artículo Fam 2', price: 15 });

      await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 10, name: 'Artículo Otro', price: 20 });

      return request(app.getHttpServer())
        .get('/articulos/family/5')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          response.body.forEach((articulo: any) => {
            expect(articulo.family_id).toBe(5);
          });
        });
    });
  });

  describe('/articulos/:id (GET)', () => {
    it('should return 404 for non-existent articulo', () => {
      return request(app.getHttpServer()).get('/articulos/999').expect(404);
    });

    it('should return specific articulo', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, name: 'Bebida', price: 5 })
        .expect(201);

      return request(app.getHttpServer())
        .get(`/articulos/${createResponse.body.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Bebida');
          expect(response.body.id).toBe(createResponse.body.id);
        });
    });
  });

  describe('/articulos/:id (PATCH)', () => {
    it('should return 404 for non-existent articulo', () => {
      return request(app.getHttpServer())
        .patch('/articulos/999')
        .send({ name: 'Updated' })
        .expect(404);
    });

    it('should update existing articulo', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, name: 'Original', price: 10 })
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/articulos/${createResponse.body.id}`)
        .send({ name: 'Updated', price: 15 })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated');
          expect(response.body.price).toBe(15);
          expect(response.body.id).toBe(createResponse.body.id);
        });
    });

    it('should partially update articulo', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, name: 'Original', price: 10 })
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/articulos/${createResponse.body.id}`)
        .send({ price: 20 })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Original');
          expect(response.body.price).toBe(20);
        });
    });
  });

  describe('/articulos/:id (DELETE)', () => {
    it('should return 404 for non-existent articulo', () => {
      return request(app.getHttpServer()).delete('/articulos/999').expect(404);
    });

    it('should delete existing articulo', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/articulos')
        .send({ family_id: 1, name: 'To Delete', price: 5 })
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/articulos/${createResponse.body.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe(
            'Artículo eliminado correctamente',
          );
        });
    });
  });
});
