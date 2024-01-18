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
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      expect(response.body.article).toMatchObject(articleObj);
    });

    test("responds with 404 message when article id doesn't exist", async () => {
      const response = await request(app)
        .get(`/api/articles/asfghfh`)
        .expect(404);
      expect(response.body).toEqual({ msg: "Not Found" });
    });
  });

  test("responds with 404 and 'Not Found' message when article isn't found", async () => {
    const response = await request(app)
      .get("/api/articles/1898929")
      .expect(404);
    expect(response.body).toEqual({ msg: "Not Found" });
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
    const response = await request(app)
      .get("/api/articles/1000/comments")
      .expect(404);

    expect(response.body.msg).toBe("Not Found");
  });

  test("Must respond with an array of objects which includes body, votes, author, article_id, created_at", async () => {
    const response = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
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

  describe("PATCH /api/articles/:article_id", () => {
    test("updates an article by article_id with number of votes", async () => {
      const response = await request(app)
        .patch("/api/articles/1")
        .send({ newVote: 5 });
      expect(response.status).toBe(200);
      expect(response.body.article).toHaveProperty("article_id", 1);
      expect(response.body.article).toHaveProperty("votes", 105);
    });
  });
  test("responds with a 400 when given an incorrect data type to patch", async () => {
    const patch = { newVote: "abc" };
    await request(app).patch("/api/articles/1").send(patch).expect(400);
  });

  test("responds with a 404 when given a correct value to patch but wrong path", async () => {
    const patch = { newVote: 1 };
    const response = await request(app)
      .patch("/api/articles/96787687")
      .send(patch)
      .expect(404);

    expect(response.body.err).toBe("Article Not Found");
  });
});
describe("Post /api/articles/:article_id/comments", () => {
  test("posts a comment to an article", async () => {
    const response = await request(app).post("/api/articles/1/comments").send({
      username: "butter_bridge",
      body: "This is a test comment",
    });
    expect(response.status).toBe(201);
    const { comment } = response.body;
    expect(comment).toHaveProperty("comment_id");
    expect(comment).toHaveProperty("author", "butter_bridge");
    expect(comment).toHaveProperty("body", "This is a test comment");
    expect(comment).toHaveProperty("article_id", 1);
    expect(typeof comment.comment_id).toBe("number");
  });
  test("responds with a 400 error if no article details are provided", async () => {
    const commentData = {};

    const response = await request(app)
      .post(`/api/articles/1000/comments`)
      .send(commentData);
    expect(response.status).toBe(400);
  });
  test("responds with a 404 error if the username does not exist", async () => {
    const response = await request(app)
      .post("/api/articles/123/comments")
      .send({
        username: "nonexistent_user",
        body: "This is a great article!",
      });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Not Found");
  });
  test("responds with a 404 error if the article_id does not exist", async () => {
    const response = await request(app)
      .post("/api/articles/1000/comments")
      .send({
        username: "butter_bridge",
        body: "This is a great article!",
      });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Not Found");
  });
});
