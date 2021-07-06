// Importações
const { json, urlencoded } = require("express")
const express = require("express")
const connection = require("./persistence/persistence")
const Pergunta = require("./persistence/Pergunta")
const Resposta = require("./persistence/Resposta")

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Autenticado no BD com sucesso!")
  })
  .catch((erro) => {
    console.log(erro)
  })

// Variáveis de Ambiente
const port = 3000
const app = express()

// Configurações
app.set("view engine", "ejs")
app.set("json spaces", 4)
app.use(express.static("assets"))
app.use(json())
app.use(urlencoded({ extended: false }))

// Rotas

// principal
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["createdAt", "DESC"]] }).then(
    (perguntas) => {
      res.render("index", { perguntas: perguntas })
    }
  )
})

// get por Id
app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id

  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
      }).then((respostas) => {
        res.render("pergunta", { pergunta: pergunta, respostas: respostas })
      })
    } else {
      res.redirect("/")
    }
  })
})

// testes
app.get("/json/perguntar", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["createdAt", "DESC"]] }).then(
    (perguntas) => {
      res.json(perguntas)
    }
  )
})

// inserir resposta
app.post("/salvarResposta", (req, res) => {
  let corpo = req.body.corpo
  let id = req.body.perguntaId

  Resposta.create({
    corpo: corpo,
    perguntaId: id,
  }).then(() => {
    res.redirect("/pergunta/" + id)
  })
})

// inserir pergunta
app.post("/salvarpergunta", (req, res) => {
  let titulo = req.body.titulo
  let descricao = req.body.descricao

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/")
  })
})

// Perguntar
app.get("/perguntar", (req, res) => {
  res.render("perguntar")
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})

// Outras Rotas
// app.get("/:nome?/:linguagem?", (req, res) => {
//   var nome = req.query.nome
//   var lang = req.query.linguagem
//   var exibir = true
//   var jogadores = [
//     { nome: "felipe alves", posicao: "goleiro" },
//     { nome: "Tinga", posicao: "lateral" },
//     { nome: "Marcelo Benevenutto", posicao: "zagueiro" },
//   ]

//   res.render("index", {
//     nome,
//     lang,
//     empresa: "CSI Locacoes",
//     msg: exibir,
//     jogadores,
//   })
// })
