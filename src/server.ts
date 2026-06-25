import app from "./app";
import env from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  const port = env.PORT;
  try {
    await prisma.$connect();
    console.log("Postgres database connected successfully");

    app.listen(port, () => {
      console.log(`Blog Master server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
