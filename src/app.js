require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
/*app.use(
  cors({
    origin: "http://localhost:5173", // ou a porta do front
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // se precisar enviar cookies ou headers de autenticação
  })
);
*/
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const answerRoutes = require("./routes/answerRouter");
const dashboardRoutes = require("./routes/dashboardRouter");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error("Erro interno não tratado", err.stack);
  const errorMessage =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;
  res.stauts(500).json({
    message: "Ocorreu um erro interno inesperado no servidor.",
    error: errorMessage,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

//http://localhost:3000/api/e a rota quer acessar => (users / auth / answer / dashboard)
