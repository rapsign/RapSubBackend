
# 🎧 Subtitle Translator Backend (WebSocket + Azure)

Proyek ini adalah backend real-time untuk mentranskripsi audio dari video dan menerjemahkannya ke Bahasa Indonesia menggunakan **Azure Cognitive Services Speech to Text** dan **Azure Translator API**. Komunikasi antara frontend dan backend dilakukan melalui WebSocket, memungkinkan pembuatan subtitle langsung saat video diputar di browser.

## 🚀 Fitur

- 🎙️ Real-time speech-to-text menggunakan Azure Speech SDK
- 🌐 Terjemahan otomatis dari Bahasa Inggris ke Bahasa Indonesia
- 🔁 Komunikasi dua arah menggunakan WebSocket
- 📦 Siap untuk integrasi dengan Chrome Extension atau frontend lainnya

## 📂 Struktur Direktori

```
.
├── server.js                # WebSocket server utama
├── azureSpeechClient.js     # Konfigurasi Azure Speech
├── audioProcessor.js        # WebAssembly AudioWorklet untuk ekstensi (di sisi frontend)
├── .env                    # File konfigurasi environment (tidak disertakan)
├── package.json            # Dependensi dan metadata proyek
└── README.md
```

## ⚙️ Konfigurasi

Buat file `.env` di root direktori dengan isi seperti berikut:

```
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SERVICE_REGION=your_region
AZURE_TRANSLATOR_KEY=your_translator_key
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
PORT=3000
```

> ⚠️ **Jangan pernah commit file `.env` ke repository publik.**

## 🛠️ Instalasi

```bash
git clone https://github.com/your-username/subtitle-translator-backend.git
cd subtitle-translator-backend
npm install
```

## ▶️ Menjalankan Server

```bash
npm start
```

Server akan berjalan di: `ws://localhost:3000`

## 📦 Dependensi Utama

- [ws](https://www.npmjs.com/package/ws) — WebSocket server
- [axios](https://www.npmjs.com/package/axios) — HTTP client untuk terjemahan
- [dotenv](https://www.npmjs.com/package/dotenv) — Environment variable loader
- [@azure/cognitiveservices-speech-sdk](https://www.npmjs.com/package/@azure/cognitiveservices-speech-sdk)

## 🧪 Testing

Untuk mengetes backend, kamu bisa:
- Menggunakan Chrome Extension dengan `audioProcessor.js`
- Atau kirim audio PCM 16-bit dari client melalui WebSocket

## 📝 Lisensi

MIT License. Silakan digunakan dan dimodifikasi sesuai kebutuhan.

---

Made with ❤️ by [Your Name or Organization]
