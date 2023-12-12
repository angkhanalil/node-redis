const express = require("express");
const { createClient } = require("redis");
const app = express();

const PORT = 3000;
const REDIS_PORT = 6379;

const client = createClient();

client.connect();
client.on("connect", () => console.log("connect"));
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const redisKey = `test:${userId}`;
  console.log("redisKey", redisKey);

  client
    .get(redisKey, async (err, cachedData) => {
      console.log("cachedData", cachedData);
      if (err) throw err;
      console.log("cachedData1", cachedData);
    })
    .then((result) => {
      console.log("res", result);
      if (result) {
        console.log("cachedData", result);
        res.send(JSON.parse(result));
      } else {
        const userData = {
          id: userId,
          name: `User ${userId}`,
          age: Math.floor(Math.random() * 100),
        };
        console.log(userData);

        client.set(redisKey, JSON.stringify(userData));
        res.send(userData);
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
