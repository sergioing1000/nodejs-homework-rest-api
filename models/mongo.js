require("dotenv").config();
const mongoose = require("mongoose");

let contactModel = {};

(async () => {

  // mongoose.set("bufferTimeoutMS", 45000);

  const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  });

  contactModel = mongoose.model("Contact", contactSchema);

  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection successful");
    return contactModel;
  } catch (error) {
    console.error("Conenction error ", error);
    process.exit(1);
  }

})();

module.exports = contactModel;