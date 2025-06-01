const sdk = require("microsoft-cognitiveservices-speech-sdk");

function createTranscriber(callback) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY,
    process.env.AZURE_SERVICE_REGION
  );

  const autoDetectSourceLanguageConfig =
    sdk.AutoDetectSourceLanguageConfig.fromLanguages([
      "en-AU",
      "en-CA",
      "en-GB",
      "en-IE",
      "en-IN",
      "en-NZ",
      "en-US",
      "en-ZA",
    ]);

  const pushStream = sdk.AudioInputStream.createPushStream(
    sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
  );

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

  const recognizer = new sdk.SpeechRecognizer(
    speechConfig,
    audioConfig,
    autoDetectSourceLanguageConfig
  );

  recognizer.recognizing = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
      const detectedLang = e.result.properties.getProperty(
        sdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult
      );

      callback({
        text: e.result.text,
        final: false,
        language: detectedLang || "unknown",
      });
    }
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      const detectedLang = e.result.properties.getProperty(
        sdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult
      );

      callback({
        text: e.result.text,
        final: true,
        language: detectedLang || "unknown",
      });
    }
  };

  recognizer.startContinuousRecognitionAsync();

  return {
    recognizer,
    pushStream,
  };
}

module.exports = createTranscriber;
