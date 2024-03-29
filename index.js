const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: true }));

const opcoes = [
    'pedra', 'papel', 'tesoura'
];

const perde = {
    'pedra': 'papel',
    'papel': 'tesoura',
    'tesoura': 'pedra'
}

const emojis = {
    'pedra': '✊',
    'papel': '✋',
    'tesoura': '🖖'
}

app.post('/message', (req, res) => {
    console.log('nova mensagem', req.body.Body);
    const usuario = req.body.Body.toLowerCase();
    switch (usuario) {
        case 'pedra':
        case 'papel':
        case 'tesoura':
            // fazer a escolha do computador e responder quem ganhou
            const computador = opcoes[Math.floor(Math.random() * opcoes.length)];

            if (computador === usuario) {
                res.send('<Response><Message>Ops, deu empate!</Message></Response>')
            } else {
                if (perde[computador] === usuario) {
                    // computador perdeu
                    res.send(`<Response><Message>Eu escolhi *${computador} ${emojis[computador]}*</Message><Message>Você ganhou, bora jogar de novo?</Message></Response>`);
                } else {
                    // computador ganhou
                    const twiml = new twilio.twiml.MessagingResponse();
                    twiml.message(`Eu escolhi *${computador} ${emojis[computador]}*`);
                    twiml.message('Ganhei! Ganhei!!!')
                        .media('https://source.unsplash.com/300x400/?robot');
                    res.send(twiml.toString());
                }
            }
            break;

        default:
            // tratar "fallback intent"
            res.send('<Response><Message>Escolha Pedra, Papel ou Tesoura!</Message></Response>')
            break;
    }

});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Servidor ativo na porta ${port}!`);
})