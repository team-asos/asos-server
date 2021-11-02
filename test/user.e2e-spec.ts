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
        email: 'test@example.com',
        name: '홍길동',
        password: '123123123',
        tel: '010-0000-0000',
        dept: '개발 1팀',
        job: '인턴',
      })
      .expect(201);
  });
});
