// src/routes/mobileRouter.js
const express = require("express");
const router = express.Router();

const mobileAuthController = require("../controllers/mobileAuthController");
const mobileRegistroController = require("../controllers/mobileRegistroController");
const resumoController = require("../controllers/resumoController");
const mobileChatController = require("../controllers/mobileChatController");
const authMobile = require("../middlewares/authMobileMiddleware");

// LOGIN (sem auth)
router.post("/api/login", mobileAuthController.login);

// REGISTRO DIÁRIO (com auth)
router.post("/api/registro_diario",authMobile,mobileRegistroController.registrarDiario
);

// RESUMO (com auth)
router.get("/api/resumo/:id_usuario",authMobile,resumoController.obterResumo
);

// CHAT (com auth)
router.post("/api/chat",authMobile,mobileChatController.chat);

module.exports = router;
