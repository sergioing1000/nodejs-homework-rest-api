const fs = require("fs/promises");
const Joi = require("joi");

const listContacts = async (model) => {

  try {
    
    const data = await model.find({});

    console.log("first");
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error reading database:", error);
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

// ///////////////////////////////////////////////////////////////////////////

const addContact = async (newContact) => {
  const newContactwID = {
    id: generateRandomID(21),
    ...newContact,
  };

  try {
    const content = await fs.readFile("./models/contacts.json", "utf-8");

    const contactos = JSON.parse(content);
    contactos.push(newContactwID);
    const newContent = JSON.stringify(contactos, null, 2);

    await fs.writeFile("./models/contacts.json", newContent);

    console.log("New contact succesfully added");
    console.log(newContact);

    return newContact;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
};

// ///////////////////////////////////////////////////////////////////////////

const removeContact = async (contactId) => {
  const receivedID = contactId.slice(1);
  console.log("Received item to be deleted: " + receivedID);

  try {
    const content = await fs.readFile("./models/contacts.json", "utf-8");

    let data = JSON.parse(content);
    let contactFound = {};
    let cFound = false;

    data.forEach((element) => {
      if (element.id === receivedID) {
        contactFound = element;
        cFound = true;
        console.log("si se encontró el elemento a eliminar");
        console.log(contactFound);
      }
    });

    if (cFound === true) {
      data = data.filter(function (item) {
        return item !== contactFound;
      });

      const newContent = JSON.stringify(data, null, 2);

      await fs.writeFile("./models/contacts.json", newContent);

      console.table(newContent);

      return contactFound;
    } else {
      console.log("***NO*** se encontró el elemento a eliminar.");

      return -1;
    }
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
};

// ///////////////////////////////////////////////////////////////////////////

const updateContact = async (contactId, body) => {
  contactId = contactId.slice(1);

  const result = validateContact(body);

  const error = (await result).error;
  const value = (await result).value;

  if (error) {
    console.log("error al validación de datos..");
    console.log(error.details);
    return -1;
  } else {
    console.log(contactId);

    const content = await fs.readFile("./models/contacts.json", "utf-8");

    const data = JSON.parse(content);
    let contactFound = {};
    let cFound = false;

    data.forEach((element) => {
      if (element.id === contactId) {
        cFound = true;
        console.log("si se encontró el elemento a modificar");
        element.name = body.name;
        element.email = body.email;
        element.phone = body.phone;
      }
    });

    if (cFound === true) {
      const newContent = JSON.stringify(data, null, 2);

      await fs.writeFile("./models/contacts.json", newContent);

      return 1;
    } else {
      console.log("***NO*** se encontró el elemento a modificar.");

      return -1;
    }
  }
};

// ///////////////////////////////////////////////////////////////////////////

function generateRandomID(length) {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";

  function getRandomCharacter() {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }

  let randomID = "";
  for (let i = 0; i < length; i++) {
    randomID += getRandomCharacter();
  }

  return randomID;
}

// ///////////////////////////////////////////////////////////////////////////

const validateContact = async (body) => {
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
    // console.log("Valid User:", value);
  }

  return {
    error: error,
    value: value,
  };
};

// ///////////////////////////////////////////////////////////////////////////

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  validateContact,
  addContact,
  updateContact,
};

// ///////////////////////////////////////////////////////////////////////////
