const fs = require("fs/promises");
const Joi = require("joi");
const { join } = require("path");

const listContacts = async (model) => {
  try {
    const TotalQty = await model.countDocuments({});

    const data = await model.find({}).limit(10);

    console.log("Total Quantiyt : " + TotalQty);

    return { TotalQty, data };
  } catch (error) {
    console.error("Error reading database:", error);
  }
};

// ////////////////////////////////////////////////////////////

const getContactById = async (contactId, model) => {
  console.log("el ID recivido es: " + contactId);

  try {
    const result = await model.findById(contactId);

    if (result) {
      return result;
    } else {
      console.log(
        `No se encontró ningún contacto con "id" igual a: ${contactId}.`
      );
      return result;
    }
  } catch (error) {
    console.error("Error al buscar el documento:", error);
  }
};

// ///////////////////////////////////////////////////////////////////////////

const addContact = async (newContact, model) => {
  console.log("el nuevo contacto es:");
  console.log(newContact);

  try {
    await model.create(newContact);

    return newContact;
  } catch (error) {
    console.error("Error creating contact:", error);
  }
};

// ///////////////////////////////////////////////////////////////////////////

const removeContact = async (contactId, model) => {
  console.log("Received item to be deleted: " + contactId);

  try {
    const result = await model.findByIdAndRemove(contactId);

    console.log("El resultado es:" + result);

    if (result) {
      return result;
    } else {
      console.log(
        `No se encontró ningún contacto con "id" igual a: ${contactId}.`
      );
      return result;
    }
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
};

// ///////////////////////////////////////////////////////////////////////////

const updateContact = async (contactId, body, model) => {

  const result = validateContact(body);

  const error = (await result).error;
  const value = (await result).value;

  if (error) {
    console.log("error al validación de datos..");
    console.log(error.details);
    const answer = error.details;    
    return {answer};
  } else {

    const name = value.name;
    const email = value.email;
    const phone = value.phone;
    const favorite = value.favorite;

    try {

      const updatedContact = await model.findByIdAndUpdate(
        contactId,
        { name, email, phone, favorite },
        { new: true }
      );


      if (updatedContact) {
        return updatedContact;
      } else {
        console.log(
          `No se encontró ningún contacto con "id" igual a: ${contactId}.`
        );
        return result;
      }
    } catch (error) {
      console.error("Error al leer la base de datos:", error);
    }


  }
};

// ///////////////////////////////////////////////////////////////////////////

const updateContact2 = async (contactId, body, model) => {

  const result = validateContact2(body);

  const error = (await result).error;
  const value = (await result).value;

  if (error) {
    console.log("error al validación de datos..");
    console.log(error.details);
    const answer = error.details;    
    return {answer};
  } else {

    const name = value.name;
    const email = value.email;
    const phone = value.phone;
    const favorite = value.favorite;

    try {

      const updatedContact = await model.findByIdAndUpdate(
        contactId,
        { name, email, phone, favorite },
        { new: true }
      );


      if (updatedContact) {
        return updatedContact;
      } else {
        console.log(
          `No se encontró ningún contacto con "id" igual a: ${contactId}.`
        );
        return result;
      }
    } catch (error) {
      console.error("Error al leer la base de datos:", error);
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
      .required()
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

const validateContact2 = async (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^(\+1|1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
      .required(),
    favorite: Joi.boolean().required(),
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
  updateContact2,
};

// ///////////////////////////////////////////////////////////////////////////
