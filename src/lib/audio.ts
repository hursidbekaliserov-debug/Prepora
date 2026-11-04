'use client';

export class AudioSynthesizer {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static utterance: SpeechSynthesisUtterance | null = null;
  private static isPlaying = false;
  private static onEndCallback: (() => void) | null = null;
  private static onProgressCallback: ((progress: number) => void) | null = null;

  static playScript(
    text: string, 
    options?: {
      voicePreference?: 'british' | 'australian' | 'american';
      rate?: number;
      onEnd?: () => void;
      onProgress?: (progress: number) => void;
    }
  ) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.95;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const pref = options?.voicePreference || 'british';
      const targetLang = pref === 'british' ? 'en-GB' : pref === 'australian' ? 'en-AU' : 'en-US';
      const matched = voices.find((v) => v.lang.includes(targetLang)) || voices.find((v) => v.lang.startsWith('en'));
      if (matched) utterance.voice = matched;
    }

    utterance.onend = () => {
      this.isPlaying = false;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis event:', e);
      this.isPlaying = false;
      if (options?.onEnd) options.onEnd();
    };

    this.utterance = utterance;
    this.isPlaying = true;
    this.synth.speak(utterance);
  }

  static pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPlaying = false;
    }
  }

  static resume() {
    if (this.synth) {
      this.synth.resume();
      this.isPlaying = true;
    }
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
    }
  }

  static getIsPlaying() {
    return this.isPlaying;
  }
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Audio recording is not supported in this browser environment.');
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250);
      return true;
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      throw err;
    }
  }

  stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop audio tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }
        resolve({ blob: audioBlob, url: audioUrl });
      };

      this.mediaRecorder.stop();
    });
  }
}

export class SpeechTranscriber {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((err: any) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }

            if (this.onResultCallback) {
              this.onResultCallback(finalTranscript || interimTranscript, !!finalTranscript);
            }
          };

          this.recognition.onerror = (event: any) => {
            console.warn('Speech recognition event:', event.error);
            if (this.onErrorCallback) this.onErrorCallback(event.error);
          };
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      }
    }
  }

  start(onResult: (text: string, isFinal: boolean) => void, onError?: (err: any) => void): boolean {
    if (!this.recognition) return false;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }

  getIsListening() {
    return this.isListening;
  }

  isSupported(): boolean {
    return !!this.recognition;
  }
}
