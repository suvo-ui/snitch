import app from "./src/app.js";
import config from "./src/config/config.js";
import connectToDB from "./src/config/db.js";
import dns from 'dns'


dns.setServers(['8.8.8.8', '1.1.1.1'])

const PORT = config.PORT;

// connect to database and start server
connectToDB()
  .then(() => {

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to database: ", error);
    process.exit(1);
  });