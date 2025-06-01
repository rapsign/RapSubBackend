require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");
const createTranscriber = require("./azureSpeechClient");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket + HTTP server running on port ${PORT}`);
});

async function translateToIndonesia(text) {
  try {
    const response = await axios.post(
      `${process.env.AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=en&to=id`,
      [{ Text: text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_SERVICE_REGION,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data[0].translations[0].text;
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return text;
  }
}

wss.on("connection", (ws) => {
  let lastTimestamp = null;

  const { recognizer, pushStream } = createTranscriber(async (data) => {
    try {
      if (data.text) {
        const translatedText = await translateToIndonesia(data.text);
        ws.send(
          JSON.stringify({
            text: translatedText,
            timestamp: lastTimestamp,
            final: data.final || false,
          })
        );
      }
    } catch (e) {
      console.error("❌ Failed to send data to client:", e.message);
    }
  });

  ws.on("message", (message) => {
    if (Buffer.isBuffer(message)) {
      if (message.length > 8) {
        lastTimestamp = message.readDoubleLE(0);
        const audioBuffer = message.slice(8);
        pushStream.write(audioBuffer);
      } else {
        console.warn("Message received too short, ignoring.");
      }
    }
  });

  ws.on("close", () => {
    if (recognizer.close) recognizer.close();
    if (pushStream.close) pushStream.close();
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket error:", err.message);
  });
});
