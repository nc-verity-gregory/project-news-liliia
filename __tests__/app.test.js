const db = require('../db/connection');
const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require('supertest');
const app = require('../app');



beforeEach( () => {
  return seed(testData);
});

afterAll( () => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("404: Responds with a 404 error for a non-existent endpoint", () => {
    return request(app)
      .get("/api/non-existent-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics).not.toHaveLength(0);
        
        topics.forEach(topic => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200: Responds with the article object, which should have the following properties', () => {
      return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
              expect(article).toEqual(
                  expect.objectContaining({
                      author: expect.any(String),
                      title: expect.any(String),
                      article_id: 1,
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      article_img_url: expect.any(String),
                  })
              );
          });
  });
  test('400: Responds with "Invalid article_id" for NaN', () => {
    return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Invalid article_id');
        });
});
});