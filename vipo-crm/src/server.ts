import http from "http";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const HOST = "0.0.0.0";

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`🚀 VIPO CRM API running at http://${HOST}:${PORT}`);
});
