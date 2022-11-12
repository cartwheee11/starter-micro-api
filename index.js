const pinger = require("mcpinger");
const fauna = require("faunadb");

const db = require("./getDb.js");

const q = fauna.query;

const http = require("http");
http
  .createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`);
    res.write("Yo!");
    res.end();
  })
  .listen(process.env.PORT || 3000);

// db.query(
//   q.Map(
//     q.Paginate(q.Documents(q.Collection("online")), { size: 9999 }),
//     q.Lambda(["ref"], q.Delete(q.Var("ref")))
//   )
// );

function ping() {
  pinger
    .java({
      host: "mc.restartcraft.ru",
      posrt: 25565,
    })
    .then((res) => {
      console.log(res);
      try {
        const { onlinePlayerCount, maxPlayerCount } = res;
        db.query(
          q.Create(q.Collection("online"), {
            data: {
              current: onlinePlayerCount,
              max: maxPlayerCount,
              date: Date.now(),
            },
          })
        );
      } catch (err) {
        console.log(err);
      }
    });
}

//цкил
ping();
// setInterval(ping, 600000);
