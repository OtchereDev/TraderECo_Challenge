import * as moduleAlias from "module-alias";
import { createServer } from "./config/express";
import { AddressInfo } from "net";
import http from "http";
import mongoose from "mongoose";

const sourcePath = "src";

moduleAlias.addAliases({
  "@config": `${sourcePath}/config`,
  "@router": `${sourcePath}/routes`,
  "@controller": `${sourcePath}/controllers`,
});

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3003;

const startServer = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB}`);

  const app = createServer();

  const server = http.createServer(app).listen({ port, host }, () => {
    const addressInfo = server.address() as AddressInfo;
    console.log(
      `Server ready at http:${addressInfo.address}:${addressInfo.port}`
    );
  });

  const signalTraps: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGUSR2"];

  signalTraps.forEach((type) => {
    process.once(type, async () => {
      console.log(`signal end on ${type}`);

      server.close(() => {
        console.log("Server was gracefully shut down");
      });
    });
  });
};

startServer();
