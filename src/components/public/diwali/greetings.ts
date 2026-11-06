// ─── Diwali wishes, in the languages it is celebrated in ──────────────────
// `font` picks a stack in diwali.css (dw-f-<font>), so each script gets a
// face that actually has its letters. All of them fall back to the system's
// own fonts if Google Fonts is blocked.

export interface Greeting {
  text: string;
  lang: string;
  /** How to say it, in Latin letters. */
  say: string;
  /** What it means. */
  means: string;
  font: 'deva' | 'arima' | 'sinhala' | 'telugu' | 'kannada' | 'bengali' | 'gujarati' | 'gurmukhi' | 'oriya' | 'urdu' | 'latin';
  rtl?: boolean;
  /** BCP 47 code, so screen readers switch voice. */
  code: string;
}

export const GREETINGS: Greeting[] = [
  { text: 'शुभ दीपावली', lang: 'Hindi', say: 'Shubh Deepavali', means: 'Happy Deepavali', font: 'deva', code: 'hi' },
  { text: 'தீபாவளி நல்வாழ்த்துக்கள்', lang: 'Tamil', say: 'Deepavali Nalvazhthukkal', means: 'Good wishes for Deepavali', font: 'arima', code: 'ta' },
  { text: 'සුබ දීපවාලියක් වේවා', lang: 'Sinhala', say: 'Suba Deepavaliyak Wewa', means: 'May you have a happy Deepavali', font: 'sinhala', code: 'si' },
  { text: 'దీపావళి శుభాకాంక్షలు', lang: 'Telugu', say: 'Deepavali Shubhakankshalu', means: 'Deepavali greetings', font: 'telugu', code: 'te' },
  { text: 'ദീപാവലി ആശംസകൾ', lang: 'Malayalam', say: 'Deepavali Aashamsakal', means: 'Deepavali wishes', font: 'arima', code: 'ml' },
  { text: 'ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು', lang: 'Kannada', say: 'Deepavali Habbada Shubhashayagalu', means: 'Greetings for the festival of Deepavali', font: 'kannada', code: 'kn' },
  { text: 'শুভ দীপাবলি', lang: 'Bengali', say: 'Shubho Dipaboli', means: 'Happy Dipaboli', font: 'bengali', code: 'bn' },
  { text: 'શુભ દિવાળી', lang: 'Gujarati', say: 'Shubh Diwali', means: 'Happy Diwali', font: 'gujarati', code: 'gu' },
  { text: 'दिवाळीच्या हार्दिक शुभेच्छा', lang: 'Marathi', say: 'Diwalichya Hardik Shubhechha', means: 'Heartfelt Diwali wishes', font: 'deva', code: 'mr' },
  { text: 'ਦੀਵਾਲੀ ਦੀਆਂ ਵਧਾਈਆਂ', lang: 'Punjabi', say: 'Diwali Diyan Vadhaiyan', means: 'Diwali congratulations', font: 'gurmukhi', code: 'pa' },
  { text: 'ଶୁଭ ଦୀପାବଳି', lang: 'Odia', say: 'Shubha Dipabali', means: 'Happy Dipabali', font: 'oriya', code: 'or' },
  { text: 'शुभ तिहार', lang: 'Nepali', say: 'Shubha Tihar', means: 'Happy Tihar, as Diwali is called in Nepal', font: 'deva', code: 'ne' },
  { text: 'دیوالی مبارک', lang: 'Urdu', say: 'Diwali Mubarak', means: 'Blessed Diwali', font: 'urdu', rtl: true, code: 'ur' },
  { text: 'Happy Diwali', lang: 'English', say: 'Happy Diwali', means: 'The festival of lights', font: 'latin', code: 'en' },
];

/** The line from the Upanishads that Diwali is so often summed up with. */
export const TAMASO = {
  text: 'तमसो मा ज्योतिर्गमय',
  say: 'Tamaso mā jyotir gamaya',
  means: 'Lead me from darkness to light',
};
