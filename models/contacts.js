const fs = require("fs/promises");
const Joi = require("joi");

const listContacts = async () => {
  try {
    const content = await fs.readFile("./models/contacts.json", "utf-8");

    const data = JSON.parse(content);

    return data;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
};

const getContactById = async (contactId) => {
  const receivedID = contactId.slice(1);
  console.log("el ID recivido es: " + receivedID);

  try {
    const content = await fs.readFile("./models/contacts.json", "utf-8");

    const data = JSON.parse(content);
    let contactFound = {};
    let cFound = false;

    data.forEach((element) => {
      if (element.id === receivedID) {
        contactFound = element;
        console.log("si entro al if");
        cFound = true;
      }
    });

    console.log(contactFound);

    if (cFound === true) {
      return contactFound;
    } else {
      contactFound.id = -1;
      return contactFound;
    }
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
};

const validateContact  = async (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^(\+1|1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
      .required(),
  });

  const { error, value } = schema.validate(body);

  if (error) {
    console.error("Validation Error:", error.details[0]);
  } else {
    console.log("Valid User:", value);
  }

  return {
    error: error,
    value: value,
  };
};
const addContact = async (contactId) => {};

const removeContact = async (contactId) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  validateContact,
  addContact,
  updateContact,
};
