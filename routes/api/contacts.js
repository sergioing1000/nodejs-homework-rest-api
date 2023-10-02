const express = require("express");

const contac = require("../../models/contacts.js");
const contactModel = require("../../models/mongo.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  contac
    .listContacts(contactModel)
    .then((info) => {
      res.status(202).json(info);
    })
    .catch((error) => {
      console.error("Error: Contact list NOT FOUND:", error);
      res.status(404).json({ message: "Error: Contact list NOT FOUND" });
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
          .json({ message: `There is no Contact with the ID: ${contactId}` });
      } else {
        res.status(200).json({ message: "Contact FOUND: OK", data });
      }
    })
    .catch((error) => {
      console.error("Error: Contact list NOT FOUND", error);
      res.status(404).json({ message: "Error: Contact list NOT FOUND" });
    });
});

// /////////////////

router.post("/", async (req, res, next) => {
  const dataFromBody = req.body;

  try {
    const result = contac.validateContact(dataFromBody);

    const error = (await result).error;
    const value = (await result).value;

    if (error) {
      res.status(400).json({ message: error.details });
    } else {
      console.log("Successful validation:");

      const newContact = await contac.addContact(value);

      res.status(201).json({ message: newContact });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.details });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;

  const response = await contac.removeContact(id);

  if (response !== -1) {
    console.log("se borro el contacto " + response);
    res.status(200).json({ message: "contact deleted" });
  } else {
    console.log("no se encontró el contacto con el id " + id);
    res.status(404).json({ message: "CONTACT NOT FOUND" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const dataFromBody = req.body;

  const result = await contac.updateContact(contactId, dataFromBody);

  if (result !== -1) {
    res.status(200).json({ message: "UPDATED Contact" });
  } else {
    res.status(400).json({ message: "Contact NOT FOUND" });
  }
});

module.exports = router;
