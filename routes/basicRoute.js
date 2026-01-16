const express = require("express");
const { sendContactForm } = require("../Controllers/contactController");
const getPage = require("../Controllers/pagesController");


const basicRouter = express.Router()

basicRouter.post("/send-mail",  sendContactForm)
basicRouter.get("/:key", getPage)

module.exports = basicRouter