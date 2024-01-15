exports.getApi = async (req, res, next) => {
  try {
    res.status(200).send({
        endpoints: {
            "GET /api": {
                description:
                  "serves up a json representation of all the available endpoints of the api",
              },
              "GET /api/topics": {
                description: "serves an array of all topics",
                queries: [],
                exampleResponse: {
                  topics: [{ slug: "football", description: "Footie!" }],
                },
              },
        }
     
    });
  } catch (err) {
    next(err);
  }
};
