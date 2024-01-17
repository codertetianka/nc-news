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

  test("responds with an array of topics objects", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { body } = response;

    expect(body.topics).toBeInstanceOf(Array);
    expect(body.topics.length).toBe(3);

    body.topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(topic).toHaveProperty("description");
    });
  });
});

describe("GET /api", () => {
  test("responds with endpoints documentation in endpoints.json", async () => {
    const response = await request(app).get("/api").expect(200);
    expect(response.body).toEqual(expectedEndpoints);
  });

  describe("GET /api/articles/:article_id", () => {
    test("responds with an article object", async () => {
      const response = await request(app).get("/api/articles/1").expect(200);

      const articleObj = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      expect(response.body.article).toMatchObject(articleObj);
    });

    test("responds with 500 message when article id doesn't exist", async () => {
      const response = await request(app).get(`/api/articles/asfghfh`).expect(500);
      expect(response.body).toEqual({ msg: 'Something went wrong!' });
    });
  });

  test("responds with 404 and 'Not found' message when article isn't found", async () => {
    const response = await request(app).get("/api/articles/1898929").expect(404);
    expect(response.body).toEqual({ msg: 'Not found' });
  });
});

describe("GET /api/articles", () => {
  test("receives status 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("200: responds with array of article objects sorted by created_at date property", async () => {
    const response = await request(app).get("/api/articles").expect(200);
    const { body } = response;

    expect(body.article).toBeSortedBy("created_at", { descending: true });
  });

  test("Each reply must respond with an object which includes author, title, article_id, topic, created_at, votes, article_img_url, and comment count", async () => {
    const response = await request(app).get("/api/articles").expect(200);
    const { body } = response;

    expect(body.article.length).toBe(13);

    for (const article of body.article) {
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
      expect(typeof article.comment_count).toBe("number");
    }
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("receives status 200", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });

  test("responds with 404 message when passed a bad path", async () => {

    const response = await request(app).get("/api/articles/1000/comments").expect(404);
  
    expect(response.body.msg).toBe("Not found");
  });
  
  test("Must respond with an array of objects which includes body, votes, author, article_id, created_at", async () => {
    const response = await request(app).get("/api/articles/1/comments").expect(200);
    const { body } = response;

    expect(body.comments.length).toBe(11);

    for (const comment of body.comments) {
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.article_id).toBe("number");
      expect(typeof comment.created_at).toBe("string");
      expect(comment.article_id).toBe(1);
    }
  });
});
