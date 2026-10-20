import alphabetsData from './alphabets.json'

export type PracticeLetter = { id: string; char: string; name: string; word?: string; src?: string }

const EXTRA_LETTERS: Record<string, PracticeLetter> = {
  dal: { id: 'ddal', char: 'ڈ', name: 'Ddal' },
  noon: { id: 'noon-ghunna', char: 'ں', name: 'Noon Ghunna' },
  he: { id: 'do-chashmi-he', char: 'ھ', name: 'Do Chashmi He' },
}

// Each picture was reviewed against its Urdu word. Letters that do not normally
// start a word (e.g. ڑ, ں, ے) remain available in the writing-only worksheets.
const PICTURES: Record<string, { word: string; file: string }> = {
  alif: { word: 'انار', file: 'alif/1.png' },
  bay: { word: 'بلی', file: 'bay/2.png' },
  pay: { word: 'پتنگ', file: 'pay/3.png' },
  tay: { word: 'تتلی', file: 'tay/4.png' },
  tte: { word: 'ٹماٹر', file: 'tte/5.png' },
  say: { word: 'ثمر', file: 'say/6.png' },
  jeem: { word: 'جہاز', file: 'jeem/7.png' },
  chay: { word: 'چاند', file: 'che/9.png' },
  hay: { word: 'حلیم', file: 'hha/8.png' },
  khay: { word: 'خرگوش', file: 'khaa/10.png' },
  dal: { word: 'دل', file: 'daal/11.png' },
  ddal: { word: 'ڈھول', file: 'ddaal/12.png' },
  dhal: { word: 'ذخیرہ', file: 'zaal/zahirah.png' },
  ray: { word: 'ریل', file: 'ray/14.png' },
  zay: { word: 'زنجیر', file: 'zaay/16.png' },
  zhay: { word: 'ژالہ باری', file: 'zhay/17.png' },
  seen: { word: 'سورج', file: 'seen/18.png' },
  sheen: { word: 'شیر', file: 'sheen/19.png' },
  swad: { word: 'صندوق', file: 'saad/20.png' },
  zwad: { word: 'ضعیف', file: 'daad/23.png' },
  toay: { word: 'طوطا', file: 'toein/22.png' },
  zoay: { word: 'ظروف', file: 'zoein/zoein.png' },
  ain: { word: 'عینک', file: 'ain/24.png' },
  ghain: { word: 'غبارہ', file: 'ghain/25.png' },
  fay: { word: 'فوارہ', file: 'fe/26.png' },
  qaf: { word: 'قلم', file: 'qaaf/27.png' },
  kaf: { word: 'کتاب', file: 'kaaf/28.png' },
  gaaf: { word: 'گھوڑا', file: 'gaaf/29.png' },
  laam: { word: 'لکڑی', file: 'laam/30.png' },
  meem: { word: 'مچھلی', file: 'meem/31.png' },
  noon: { word: 'ناریل', file: 'noon/32.png' },
  wao: { word: 'ورق', file: 'wao/33.png' },
  he: { word: 'ہاتھی', file: 'haa/34.png' },
  'choti-yaa': { word: 'یکہ', file: 'yay/36.png' },
}

export const PRACTICE_LETTERS: PracticeLetter[] = alphabetsData.letters
  .flatMap((letter) => EXTRA_LETTERS[letter.id] ? [letter, EXTRA_LETTERS[letter.id]] : [letter])
  .map((letter) => ({ ...letter, ...PICTURES[letter.id], src: PICTURES[letter.id] ? `/images/UrduLetterMatchingImages/${PICTURES[letter.id].file}` : undefined }))

export const PICTURE_PRACTICE_LETTERS = PRACTICE_LETTERS.filter((letter) => !!letter.src)
