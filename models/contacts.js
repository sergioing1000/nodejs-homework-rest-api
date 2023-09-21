const fs = require('fs/promises')

const listContacts = async () => {
  try {
    const content = await fs.readFile("./contacts.json", "utf-8");
    console.log("Contenido del archivo:", content);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
  }
}

const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
