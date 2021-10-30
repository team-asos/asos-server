import * as request from 'supertest';

const app = 'http://localhost:3000';

describe('Auth Controller Test', () => {
  it('Login Success Test', async () => {
    await request(app)
      .post('/auth')
      .send({
        email: 'test@example.com',
        password: '123123123',
      })
      .expect(200);
  });

  it('Wrong Email Login Test', async () => {
    const res = await request(app)
      .post('/auth')
      .send({
        email: 'wrong@example.com',
        password: '123123123',
      })
      .expect(404);

    expect(res.body).toEqual({
      status: 404,
      message: '존재하지 않는 사용자입니다.',
    });
  });

  it('Wrong Password Login Test', async () => {
    const res = await request(app)
      .post('/auth')
      .send({
        email: 'test@example.com',
        password: 'wrong',
      })
      .expect(401);

    expect(res.body).toEqual({
      status: 401,
      message: '비밀번호가 잘못되었습니다.',
    });
  });
});
