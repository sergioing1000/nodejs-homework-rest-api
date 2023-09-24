const express = require("express");

const contac = require("../../models/contacts.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  contac
    .listContacts()
    .then((contacts) => {
      res.status(202).json({ contacts });
    })
    .catch((error) => {
      console.error("Error al listar contactos:", error);
      res.status(404).json({ message: "Error al listar contactos:" });
    });
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;

  contac
    .getContactById(contactId)
    .then((data) => {
      console.log(data);

      if (data.id === -1) {
        res
          .status(404)
          .json({ message: `No hay contactos con el ID: ${contactId}` });
      } else {
        res.status(200).json({ message: "Contacto encontrado", data });
      }
    })
    .catch((error) => {
      console.error("Error al listar contactos:", error);
      res.status(404).json({ message: "Error al listar contactos:" });
    });
});

router.post("/", async (req, res, next) => {
  const dataFromBody = req.body;

  try {
    const result = contac.validateContact(dataFromBody);

    const error = (await result).error;
    const value = (await result).value;

    if (error) {
      console.log("Operación exitosa:", error);
      res.status(404).json({ message: error.details });
    } else {
      console.log("Valid User:", value);
      res.status(200).json({ message: value });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.details });
  }

});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
