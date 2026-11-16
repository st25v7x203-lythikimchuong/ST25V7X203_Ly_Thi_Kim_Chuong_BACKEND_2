
require("dotenv").config();

const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const ContactService = require("./app/services/contact.service");

const PORT = config.app.port;

async function startServer() {
  try {
    const client = await MongoDB.connect(config.db.uri);

    const contactService = new ContactService(client);

    const app = require("./app");

    app.locals.contactService = contactService;

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT + ".");
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
}

startServer();
