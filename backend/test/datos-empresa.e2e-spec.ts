import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DatosEmpresa (e2e)', () => {
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

  const datosEmpresaData = {
    name: 'Empresa Test SL',
    nif: 'B12345678',
    address: 'Calle Test 123, Madrid',
    phone: '600123456',
    email: 'test@empresa.com',
  };

  describe('/datos-empresa (POST)', () => {
    it('should create a new datos empresa', () => {
      return request(app.getHttpServer())
        .post('/datos-empresa')
        .send(datosEmpresaData)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(datosEmpresaData.name);
          expect(res.body.nif).toBe(datosEmpresaData.nif);
          expect(res.body.address).toBe(datosEmpresaData.address);
          expect(res.body.phone).toBe(datosEmpresaData.phone);
          expect(res.body.email).toBe(datosEmpresaData.email);
        });
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/datos-empresa')
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('/datos-empresa (GET)', () => {
    it('should return an array of datos empresa', () => {
      return request(app.getHttpServer())
        .get('/datos-empresa')
        .expect(200)
        .expect(Array.isArray);
    });
  });

  describe('/datos-empresa/first (GET)', () => {
    it('should return the first datos empresa', () => {
      return request(app.getHttpServer())
        .get('/datos-empresa/first')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBeDefined();
          expect(res.body.nif).toBeDefined();
        });
    });
  });

  describe('/datos-empresa/:id (GET)', () => {
    it('should return a datos empresa by id', async () => {
      // First create one
      const createResponse = await request(app.getHttpServer())
        .post('/datos-empresa')
        .send({
          ...datosEmpresaData,
          nif: 'B87654321', // Different NIF to avoid conflicts
        });

      const id = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/datos-empresa/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(id);
          expect(res.body.name).toBe(datosEmpresaData.name);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/datos-empresa/99999')
        .expect(404);
    });
  });

  describe('/datos-empresa/:id (PATCH)', () => {
    it('should update a datos empresa', async () => {
      // First create one
      const createResponse = await request(app.getHttpServer())
        .post('/datos-empresa')
        .send({
          ...datosEmpresaData,
          nif: 'B11111111', // Different NIF to avoid conflicts
        });

      const id = createResponse.body.id;
      const updateData = { name: 'Updated Empresa' };

      return request(app.getHttpServer())
        .patch(`/datos-empresa/${id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('/datos-empresa/99999')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('/datos-empresa/update-or-create (POST)', () => {
    it('should create if none exists', async () => {
      const updateData = {
        name: 'New Company',
        nif: 'B22222222',
        address: 'Address 123',
      };

      return request(app.getHttpServer())
        .post('/datos-empresa/update-or-create')
        .send(updateData)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
        });
    });

    it('should update if one exists', async () => {
      // First create one
      await request(app.getHttpServer())
        .post('/datos-empresa')
        .send({
          ...datosEmpresaData,
          nif: 'B33333333', // Different NIF to avoid conflicts
        });

      const updateData = { name: 'Updated Company' };

      return request(app.getHttpServer())
        .post('/datos-empresa/update-or-create')
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
        });
    });
  });

  describe('/datos-empresa/:id (DELETE)', () => {
    it('should delete a datos empresa', async () => {
      // First create one
      const createResponse = await request(app.getHttpServer())
        .post('/datos-empresa')
        .send({
          ...datosEmpresaData,
          nif: 'B44444444', // Different NIF to avoid conflicts
        });

      const id = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/datos-empresa/${id}`)
        .expect(200);
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .delete('/datos-empresa/99999')
        .expect(404);
    });
  });
});
