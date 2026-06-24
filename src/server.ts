import app from "./app";

async function main() {
  const port = 5000;
  try {
    app.listen(port, () => {
      console.log(`Blog Master server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1);
  }
}

main();
