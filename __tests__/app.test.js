const db = require('../db/connection');
const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require('supertest');
const app = require('../app');
const toBeSortedBy = require('jest-sorted');
expect.extend(toBeSortedBy);




beforeEach( () => {
  return seed(testData);
});

afterAll( () => {
  return db.end();
});

describe("GET - Endpoints", () => {
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

  describe('GET /api/articles', () => {
    test('200: Responds with an array of article objects, each with the following properties', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
  //       expect(articles).toBeInstanceOf(Array);
          expect(articles).not.toHaveLength(0);
      
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        });
    });

    test('200: Responds with an array of article objects without a BODY property', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).not.toHaveProperty('body');
          });
        });
    });
    
    test('200: Responds with articles are sorted in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
  });

  describe('GET /api/articles (sorting queries)', () => {
    test('200: Responds with articles sorted by default column (created_at) in des-order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    test('200: Responds with articles sorted by any valid column in asc-order', () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('title', { ascending: true });
        });
    });
    test('200: Defaults to des-order if order is not declared', () => {
      return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('votes', { descending: true });
        });
    });
    describe('GET /api/articles (sorting queries) - Errors', () => {
      test('400: Responds with an err if sort_by column is invalid', () => {
        return request(app)
          .get('/api/articles?sort_by=invalid_column')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid sort_by column');
          });
      });
    
      test('400: Responds with an err if order query is invalid', () => {
        return request(app)
          .get('/api/articles?order=invalid_order')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid order query');
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
    test('404: Responds with "Article not found" for a non-existent article_id', () => {
      return request(app)
        .get('/api/articles/9999') 
        .expect(404) 
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
    
  });

  describe('GET /api/articles/:article_id/comments', () => {
    test('200: Responds - each comment should have the correct structure', () => {
      const article_id = 1; 
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBeGreaterThan(0);  // if NOT empty
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: article_id, 
              })
            );
          });
        });
    });
    test('200: Responds with an array of comments for article_id without comments (empty Arr)', () => {
      const article_id = 37;  // this article_id has no comments
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test('200: Responds with the comments in the correct order (last is first)', () => {
      const article_id = 1; 
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => { // sorted by 'jest-sorted'
          expect(comments).toBeSortedBy('created_at', { descending: true });
        });
    });
  });
  describe('GET /api/users', () => {
    test('200: Responds with an array of user objects, each having username, name, and avatar_url', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe('POST - Endpoints', () => {
  describe('POST /api/articles/:article_id/comments', () => {
    test('201: Responds with the posted comment', () => {
      const newComment = { username: 'butter_bridge', body: 'Great article!' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            body: 'Great article!',
            article_id: 1,
            author: 'butter_bridge',
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test('400: Responds with an error if username/body is missing', () => {
      const newComment = { body: 'Great article!' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request: missing username or body');
        });
    });
    test('400: Responds with an error if article_id is not a number', () => {
      const newComment = { username: 'butter_bridge', body: 'Great article!' };
      return request(app)
        .post('/api/articles/not-a-number/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid article_id');
        });
    });

    test('404: Responds with an error if article_id does not exist', () => {
      const newComment = { username: 'butter_bridge', body: 'Great article!' };
      return request(app)
        .post('/api/articles/9999/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article not found');
        });
    });

    test('404: Responds with an error if username does not exist', () => {
      const newComment = { username: 'nonexistUser', body: 'Great article!' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('User not found');
        });
    });


  });
});

describe('PATCH - Endpoints', () => {
  describe('PATCH /api/articles/:article_id', () => {
    test('200: The votes was successfully updated for an article', () => {
      const updatedVotes = { inc_votes: 5 };
      return request(app)
        .patch('/api/articles/1')
        .send(updatedVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBeGreaterThanOrEqual(0);
          expect(body.article.article_id).toBe(1);
        });
    });
    test('200: The votes was incremented for an article', () => {
      const updatedVotes = { inc_votes: 5 };
      return request(app)
        .patch('/api/articles/1')
        .send(updatedVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBeGreaterThanOrEqual(105);
          expect(body.article.article_id).toBe(1);
        });
    });
    test('200: The votes was decreased for an article', () => {
      const updatedVotes = { inc_votes: -10 };
      return request(app)
        .patch('/api/articles/1')
        .send(updatedVotes)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.votes).toBe(90);
          expect(article.article_id).toBe(1);
        });
    });
    test('400: Responds with an error if article_id is invalid (not a number)', () => {
      const updatedVotes = { inc_votes: 1 };
      return request(app)
        .patch('/api/articles/not-a-number')
        .send(updatedVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request: Invalid input data type');
        });
    });
    test('400: Responds with error for invalid inc_votes value (not a number)', () => {
      const updatedVotes = { inc_votes: 'not-a-number' };
      return request(app)
        .patch('/api/articles/1')
        .send(updatedVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request: Invalid input data type');
        });
    });
    test('404: Responds with an error if article_id does not exist', () => {
      const updatedVotes = { inc_votes: 1 };
      return request(app)
        .patch('/api/articles/9999')
        .send(updatedVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article not found');
        });
    });
    test('400: Responds with an error if inc_votes is not provided', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({}) 
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request: Invalid input');
        });
    });
  });
});

describe('DELETE - Endpoints', () => {
  describe('DELETE /api/comments/:comment_id', () => {
    test('204: Comment deleted', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
  
    test('404: Responds with an error if comment_id does not exist', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Comment not found');
        });
    });
  
    test('400: Responds with an error if comment_id is not a number', () => {
      return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid comment_id');
        });
    });
  });
});

