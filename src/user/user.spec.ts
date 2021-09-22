import * as request from 'supertest';

const app = 'http://localhost:3000';

describe('User Controller Test', () => {
  beforeEach(async () => {
    // await request(app).delete('/users').send({ email: 'test1@example.com' });
  });

  it('User Create Test', async () => {
    await request(app)
      .post('/users')
      .send({
        email: 'test1@example.com',
        password: '123123123',
      })
      .expect(201);
  });
});
