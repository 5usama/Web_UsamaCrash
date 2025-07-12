require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let rafatharcode;
let qrCode = null;
let pairingCode = null;

// WhatsApp Connection
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  
  rafatharcode = makeWASocket({
    logger: { level: 'silent' },
    printQRInTerminal: false,
    auth: state,
    browser: ["UsamaBot", "Chrome", "120.0.0.1"],
  });

  rafatharcode.ev.on('creds.update', saveCreds);
  
  // QR Code Generation
  rafatharcode.ev.on('connection.update', (update) => {
    if (update.qr) {
      qrCode = update.qr;
      io.emit('qr', qrCode); // Send QR to frontend
    }
    
    if (update.connection === "open") {
      io.emit('connected', true);
    }
  });

  // Pairing Code Logic
  if (!rafatharcode.authState.creds.registered) {
    pairingCode = await rafatharcode.requestPairingCode(process.env.PHONE_NUMBER);
    io.emit('pairingCode', pairingCode);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  connectToWhatsApp();
});
