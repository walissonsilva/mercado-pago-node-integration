const express = require('express');
const MercadoPago = require('mercadopago');
const connection = require('./database/database');

require('dotenv').config();

const Payment = require('./models/Payment');

const PORT = 3333;

const app = express();

MercadoPago.configure({
  sandbox: true,
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

app.get('/buy', async (req, res) => {
  const id = String(Date.now());
  const email = 'fulano@gmail.com';

  const dados = {
    items: [
      curso = {
        id: id,
        title: "Data Science & Inteligência Artificial",
        quantity: 1,
        currency_id: 'BRL',
        unit_price: parseFloat(2500),
      }
    ],
    payer: { email: email },
    external_reference: id,
  }

  try {
    var pagamento = await MercadoPago.preferences.create(dados);

    const payment = await Payment.insertMany({
      code: String(id),
      payer: email,
      status: 'started'
    })

    res.redirect(pagamento.body.init_point)
  } catch (err) {
    res.status(500).json({error: err});
  }
})

app.post('/ipn', (req, res) => {
  const id = req.query.id;
  console.log(req.query);

  setTimeout(async () => {
    const filter = {
      'order.id': id
    }

    try {
      const data = await MercadoPago.payment.search({
        qs: filter
      })

      const info = data.body.results[0];

      console.log(info);

      const find_payment = await Payment.findOne({
        code: info.external_reference
      })

      if (find_payment) {
        await Payment.updateOne(
          { code: info.external_reference },
          { $set: { status: info.status } }
        )
      }

      res.status(200).send('ok');
    } catch (err) {
      res.status(500).send(err);
    }

  }, 20000);
})

app.listen(process.env.PORT || PORT, () => {
  console.log('Server is running in PORT ', PORT);
})