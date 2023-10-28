const express = require("express");
const router = express.Router();

const contac = require("../../models/contacts.js");
const contactModel = require("../../models/mongo.js");
const { model } = require("mongoose");


router.get('/', async (req, res, next) => {

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

// /////////////////

router.get("/:id", async (req, res, next) => {

  let contactId = req.params.id;

  console.log("El parámetro id del contacto es",contactId);

  contactId = contactId.slice(4);

  contac
    .getContactById(contactId, contactModel)
    .then((data) => {
      console.log(data);

      if (data === null ) {
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
      console.log("Validation Failed...")
      res.status(400).json({ message: error.details });
    } else {
      console.log("Successful validation:");

      const newContact = await contac.addContact(value, contactModel);

      res.status(201).json({ message: newContact });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.details });
  }
});

// /////////////////

router.delete("/:id", async (req, res, next) => {

  let contactId = req.params.id;
  
  contactId = contactId.slice(4);

  console.log("El id a borrar es " + contactId);

  const response = await contac.removeContact(contactId, contactModel);

  if (response !== null) {
    console.log("contact deleted " + response);
    res
      .status(200)
      .json({ message: `contact DELETED!`, id : `${contactId}` });
  } else {
    console.log("no se encontró el contacto con el id " + contactId);
    res.status(404).json({ message: "CONTACT NOT FOUND", id: `${contactId}` });
  }
});

// /////////////////

router.put("/:id", async (req, res, next) => {

  let contactId = req.params.id;
  contactId = contactId.slice(4);
  
  const dataFromBody = req.body;

  const result = await contac.updateContact(contactId, dataFromBody, contactModel);


  if (result.id !== undefined) {
    res.status(200).json({ message: "UPDATED Contact", id: result.id});
  } else {
    res.status(400).json({ message: "Contact NOT Updated", error: result.answer });
  }
});

// /////////////////

router.patch("/:id/favorite", async (req, res, next) => {



  const updateC = async (contactId, data) => {
    try {
      const result = await contac.updateContact2(contactId, data, contactModel);

      if (result.id !== undefined) {
        res.status(200).json({ message: "UPDATED Contact", id: result.id });
      } else {
        res
          .status(400)
          .json({ message: "Contact NOT Updated", error: result.answer });
      }
    } catch (error) {
      console.error(error);
    }
  };



  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  let contactId = req.params.id;
  contactId = contactId.slice(4);

  const dataFromBody = req.body;

  
  if (isEmpty(dataFromBody)) {
  
    res.status(400).json({ message: "missing field favorite" });

  } else {

    console.log(contactId);

    contac
      .getContactById(contactId, contactModel)
      .then((data) => {
        console.log(data);

        if (data === null) {
          res
            .status(404)
            .json({ message: `There is no Contact with the ID: ${contactId}` });
        } else {

          const updatedContact = {};
          
          updatedContact.name = data.name;
          updatedContact.email = data.email;
          updatedContact.phone = data.phone;
          updatedContact.favorite = dataFromBody.favorite;

          updateC(contactId, updatedContact);
          
        }
      })
      .catch((error) => {
        console.error("Error: Contact list NOT FOUND", error);
        res.status(404).json({ message: "Error: Contact list NOT FOUND" });
      });

  }

  


});

// /////////////////


module.exports = router;