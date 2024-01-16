const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const expectedEndpoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("receives status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api", () => {
  test("responds with endpoints documentation in endpoints.json", async () => {
    try {
      const response = await request(app).get("/api");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedEndpoints);
    } catch (err) {
      throw err;
    }
  });

  describe("GET /api/articles/:article_id", () => {
    test("responds with an article object", async () => {
      try {
        const response = await request(app).get("/api/articles/1");

        const articleObj = {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(response.status).toBe(200);
        expect(response.body.article).toMatchObject(articleObj);
      } catch (err) {
        throw err;
      }
    });

    test("responds with 500 message when article id doesn't exist", async () => {
      try {
        const response = await request(app).get(`/api/articles/asfghfh`);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ msg: 'Something went wrong!' });
      } catch (err) {
        throw err;
      }
    });
  });

  test("responds with 404 and 'Not found' message when article isnt found", async () => {
    try {
      const response = await request(app).get("/api/articles/1898929");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ msg: 'Not found' });
    } catch (err) {
      throw err;
    }
  });
});
