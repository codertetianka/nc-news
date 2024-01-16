const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const expectedEndpoints = require('../endpoints.json')

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("receives status 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
  });

  test("responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
      
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


describe("GET /api", (done) => {

  test("responds with endpoints documentation in endpoints.json", async() => {
    try {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedEndpoints);
     
    } catch (err) {
      throw err;
    }
    });
  
   
  });
