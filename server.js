const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Guarda as bombas ativas.
// Cada viewer pode ter sua própria bomba.
const bombas = new Map();

const cores = ["vermelho", "azul", "amarelo", "verde"];

app.get("/", (req, res) => {
  res.send("💣 Bomba da Falyka está online!");
});

// !bomba
app.get("/bomba", (req, res) => {
  const user = String(req.query.user || "").toLowerCase().trim();

  if (!user) {
    return res.send("⚠️ Não consegui identificar quem armou a bomba.");
  }

  if (bombas.has(user)) {
    return res.send(`💣 @${user} já tem uma bomba armada! Escolha um fio com !fio vermelho, azul, amarelo ou verde.`);
  }

  const cor = cores[Math.floor(Math.random() * cores.length)];

  bombas.set(user, cor);

  return res.send(
    `💣 @${user} armou uma bomba! 🚨 🔴 🔵 🟡 🟢 Escolha um fio com !fio <cor> para tentar desarmar!`
  );
});

// !fio vermelho/azul/amarelo/verde
app.get("/fio", (req, res) => {
  const user = String(req.query.user || "").toLowerCase().trim();
  const cor = String(req.query.cor || "").toLowerCase().trim();

  if (!user) {
    return res.send("⚠️ Não consegui identificar você.");
  }

  if (!cores.includes(cor)) {
    return res.send(
      `🎨 @${user}, escolha um fio válido: vermelho, azul, amarelo ou verde.`
    );
  }

  if (!bombas.has(user)) {
    return res.send(
      `🚨 @${user}, você não tem nenhuma bomba ativa! Use !bomba primeiro.`
    );
  }

  const fioCorreto = bombas.get(user);

  // A bomba termina depois da tentativa.
  bombas.delete(user);

  if (cor === fioCorreto) {
    return res.send(
      `✂️ @${user} cortou o fio ${cor}... 🎉 CLAC! BOMBA DESARMADA! Você sobreviveu! 💙`
    );
  }

  return res.send(
    `✂️ @${user} cortou o fio ${cor}... 💥 BOOOOOOM! Era o fio ${fioCorreto}! 😭`
  );
});

app.listen(PORT, () => {
  console.log(`Bomba da Falyka rodando na porta ${PORT}`);
});
