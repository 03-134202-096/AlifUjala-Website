/**
 * Reference data for the Urdu alphabet guide (/urdu-alphabet).
 *
 * Order follows the alphabet taught in Pakistani primers (قاعدہ).
 * - sound: a simple, parent-friendly description of how the letter sounds.
 * - marks: the dots (نقطے) or small signs that tell the letter apart from its family.
 * - joinsNext: false for the "non-joining" letters that never connect to the letter after them.
 * - example: a common word that starts with the letter (or contains it, where Urdu words never start with it).
 */

export type UrduLetter = {
  char: string
  name: string
  urduName: string
  sound: string
  marks: string
  family: string
  joinsNext: boolean
  example: { ur: string; roman: string; en: string }
  note?: string
}

export const URDU_LETTERS: UrduLetter[] = [
  { char: 'ا', name: 'Alif', urduName: 'الف', sound: 'Carries the long "aa" vowel, as in "father"', marks: 'No dots', family: 'Alif', joinsNext: false, example: { ur: 'انار', roman: 'anaar', en: 'pomegranate' }, note: 'With a madd sign it becomes آ (alif madd), the long "aa" at the start of words like آم (aam, mango).' },
  { char: 'ب', name: 'Bay', urduName: 'بے', sound: '"b" as in "ball"', marks: 'One dot below', family: 'Bay', joinsNext: true, example: { ur: 'بلی', roman: 'billi', en: 'cat' } },
  { char: 'پ', name: 'Pay', urduName: 'پے', sound: '"p" as in "pen"', marks: 'Three dots below', family: 'Bay', joinsNext: true, example: { ur: 'پتنگ', roman: 'patang', en: 'kite' } },
  { char: 'ت', name: 'Tay', urduName: 'تے', sound: 'Soft "t", with the tongue touching the back of the teeth', marks: 'Two dots above', family: 'Bay', joinsNext: true, example: { ur: 'تتلی', roman: 'titli', en: 'butterfly' } },
  { char: 'ٹ', name: 'Ttay', urduName: 'ٹے', sound: 'Hard "t" as in English "top", tongue curled back', marks: 'Small ط sign above', family: 'Bay', joinsNext: true, example: { ur: 'ٹماٹر', roman: 'tamaatar', en: 'tomato' } },
  { char: 'ث', name: 'Say', urduName: 'ثے', sound: '"s" as in "sun" (used mostly in Arabic loanwords)', marks: 'Three dots above', family: 'Bay', joinsNext: true, example: { ur: 'ثمر', roman: 'samar', en: 'fruit' } },
  { char: 'ج', name: 'Jeem', urduName: 'جیم', sound: '"j" as in "jam"', marks: 'One dot below', family: 'Jeem', joinsNext: true, example: { ur: 'جہاز', roman: 'jahaaz', en: 'ship / aeroplane' } },
  { char: 'چ', name: 'Chay', urduName: 'چے', sound: '"ch" as in "chair"', marks: 'Three dots below', family: 'Jeem', joinsNext: true, example: { ur: 'چاند', roman: 'chaand', en: 'moon' } },
  { char: 'ح', name: 'Bari Hay', urduName: 'بڑی حے', sound: '"h" as in "hat" (in Urdu it sounds the same as ہ)', marks: 'No dots', family: 'Jeem', joinsNext: true, example: { ur: 'حلوہ', roman: 'halwa', en: 'halwa (a sweet dish)' } },
  { char: 'خ', name: 'Khay', urduName: 'خے', sound: 'Throaty "kh", like the "ch" in Scottish "loch"', marks: 'One dot above', family: 'Jeem', joinsNext: true, example: { ur: 'خرگوش', roman: 'khargosh', en: 'rabbit' } },
  { char: 'د', name: 'Daal', urduName: 'دال', sound: 'Soft "d", tongue touching the teeth', marks: 'No dots', family: 'Daal', joinsNext: false, example: { ur: 'دل', roman: 'dil', en: 'heart' } },
  { char: 'ڈ', name: 'Ddaal', urduName: 'ڈال', sound: 'Hard "d" as in English "door", tongue curled back', marks: 'Small ط sign above', family: 'Daal', joinsNext: false, example: { ur: 'ڈھول', roman: 'dhol', en: 'drum' } },
  { char: 'ذ', name: 'Zaal', urduName: 'ذال', sound: '"z" as in "zoo"', marks: 'One dot above', family: 'Daal', joinsNext: false, example: { ur: 'ذائقہ', roman: 'zaa’iqa', en: 'taste' } },
  { char: 'ر', name: 'Ray', urduName: 'رے', sound: 'A light, tapped "r"', marks: 'No dots', family: 'Ray', joinsNext: false, example: { ur: 'ریل', roman: 'rail', en: 'train' } },
  { char: 'ڑ', name: 'Rray', urduName: 'ڑے', sound: 'A flapped "r" made with the tongue curled back', marks: 'Small ط sign above', family: 'Ray', joinsNext: false, example: { ur: 'پہاڑ', roman: 'pahaar', en: 'mountain' }, note: 'No Urdu word begins with ڑ, so children meet it in the middle or at the end of words.' },
  { char: 'ز', name: 'Zay', urduName: 'زے', sound: '"z" as in "zebra"', marks: 'One dot above', family: 'Ray', joinsNext: false, example: { ur: 'زرافہ', roman: 'zaraafa', en: 'giraffe' } },
  { char: 'ژ', name: 'Zhay', urduName: 'ژے', sound: '"zh", like the "s" in "measure" (rare)', marks: 'Three dots above', family: 'Ray', joinsNext: false, example: { ur: 'ژالہ', roman: 'zhaala', en: 'hail' } },
  { char: 'س', name: 'Seen', urduName: 'سین', sound: '"s" as in "sun"', marks: 'No dots', family: 'Seen', joinsNext: true, example: { ur: 'سورج', roman: 'sooraj', en: 'sun' } },
  { char: 'ش', name: 'Sheen', urduName: 'شین', sound: '"sh" as in "ship"', marks: 'Three dots above', family: 'Seen', joinsNext: true, example: { ur: 'شیر', roman: 'sher', en: 'lion' } },
  { char: 'ص', name: 'Suaad', urduName: 'صاد', sound: '"s" as in "sun" (Arabic loanwords)', marks: 'No dots', family: 'Suaad', joinsNext: true, example: { ur: 'صابن', roman: 'saabun', en: 'soap' } },
  { char: 'ض', name: 'Zuaad', urduName: 'ضاد', sound: '"z" as in "zoo" (Arabic loanwords)', marks: 'One dot above', family: 'Suaad', joinsNext: true, example: { ur: 'ضد', roman: 'zid', en: 'stubbornness' } },
  { char: 'ط', name: 'Toay', urduName: 'طوئے', sound: 'Soft "t", the same sound as ت', marks: 'No dots', family: 'Toay', joinsNext: true, example: { ur: 'طوطا', roman: 'tota', en: 'parrot' } },
  { char: 'ظ', name: 'Zoay', urduName: 'ظوئے', sound: '"z" as in "zoo"', marks: 'One dot above', family: 'Toay', joinsNext: true, example: { ur: 'ظہر', roman: 'zuhr', en: 'midday (the time of the noon prayer)' } },
  { char: 'ع', name: 'Ain', urduName: 'عین', sound: 'Usually a vowel sound in Urdu; it often lengthens the vowel next to it', marks: 'No dots', family: 'Ain', joinsNext: true, example: { ur: 'عینک', roman: 'ainak', en: 'glasses' } },
  { char: 'غ', name: 'Ghain', urduName: 'غین', sound: 'Soft gargled "gh", like a French "r"', marks: 'One dot above', family: 'Ain', joinsNext: true, example: { ur: 'غبارہ', roman: 'ghubaara', en: 'balloon' } },
  { char: 'ف', name: 'Fay', urduName: 'فے', sound: '"f" as in "fish"', marks: 'One dot above', family: 'Fay', joinsNext: true, example: { ur: 'فوارہ', roman: 'fawwaara', en: 'fountain' } },
  { char: 'ق', name: 'Qaaf', urduName: 'قاف', sound: 'A "k" made far back in the throat', marks: 'Two dots above', family: 'Fay', joinsNext: true, example: { ur: 'قلم', roman: 'qalam', en: 'pen' } },
  { char: 'ک', name: 'Kaaf', urduName: 'کاف', sound: '"k" as in "kite"', marks: 'No dots', family: 'Kaaf', joinsNext: true, example: { ur: 'کتاب', roman: 'kitaab', en: 'book' } },
  { char: 'گ', name: 'Gaaf', urduName: 'گاف', sound: '"g" as in "goat"', marks: 'No dots — an extra line on top', family: 'Kaaf', joinsNext: true, example: { ur: 'گاجر', roman: 'gaajar', en: 'carrot' } },
  { char: 'ل', name: 'Laam', urduName: 'لام', sound: '"l" as in "lamp"', marks: 'No dots', family: 'Laam', joinsNext: true, example: { ur: 'لٹو', roman: 'lattoo', en: 'spinning top' } },
  { char: 'م', name: 'Meem', urduName: 'میم', sound: '"m" as in "moon"', marks: 'No dots', family: 'Meem', joinsNext: true, example: { ur: 'مچھلی', roman: 'machhli', en: 'fish' } },
  { char: 'ن', name: 'Noon', urduName: 'نون', sound: '"n" as in "nose"', marks: 'One dot above', family: 'Noon', joinsNext: true, example: { ur: 'ناریل', roman: 'naariyal', en: 'coconut' }, note: 'Without its dot at the end of a word it becomes ں (noon ghunna), which only makes the vowel nasal, as in ماں (maan, mother).' },
  { char: 'و', name: 'Wao', urduName: 'واؤ', sound: '"v/w", or the vowels "oo" and "o"', marks: 'No dots', family: 'Wao', joinsNext: false, example: { ur: 'وردی', roman: 'wardi', en: 'uniform' } },
  { char: 'ہ', name: 'Choti Hay', urduName: 'چھوٹی ہے', sound: '"h" as in "hat"', marks: 'No dots', family: 'Hay', joinsNext: true, example: { ur: 'ہاتھی', roman: 'haathi', en: 'elephant' }, note: 'Its "two-eyed" form ھ (do-chashmi hay) is added after a letter to make breathy sounds such as بھ (bh) in بھالو (bhaaloo, bear).' },
  { char: 'ء', name: 'Hamza', urduName: 'ہمزہ', sound: 'A small break between two vowels', marks: 'No dots', family: 'Hamza', joinsNext: false, example: { ur: 'گائے', roman: 'gaa’e', en: 'cow' }, note: 'Hamza does not start words; it sits between vowels, often on top of ی.' },
  { char: 'ی', name: 'Choti Yay', urduName: 'چھوٹی یے', sound: '"y" as in "yes", or the vowel "ee"', marks: 'No dots on its own; two dots below when joined at the start or middle of a word', family: 'Yay', joinsNext: true, example: { ur: 'یاد', roman: 'yaad', en: 'memory' } },
  { char: 'ے', name: 'Bari Yay', urduName: 'بڑی یے', sound: 'The vowels "e" (as in "cafe") or "ai" at the end of a word', marks: 'No dots', family: 'Yay', joinsNext: false, example: { ur: 'کیلے', roman: 'kele', en: 'bananas' }, note: 'Bari yay only appears at the end of words.' },
]

/** Letter families: letters that share one basic shape and differ only by dots or small marks. */
export const LETTER_FAMILIES: { name: string; letters: string; tip: string }[] = [
  { name: 'The Bay family', letters: 'ب پ ت ٹ ث', tip: 'One boat-shaped body. Count the dots and check whether they sit above or below.' },
  { name: 'The Jeem family', letters: 'ج چ ح خ', tip: 'Same hook shape. ح has no dot, ج one below, چ three below, خ one above.' },
  { name: 'The Daal family', letters: 'د ڈ ذ', tip: 'Small open corner. ڈ carries a little ط sign and ذ carries one dot.' },
  { name: 'The Ray family', letters: 'ر ڑ ز ژ', tip: 'A short curved tail that dips below the line.' },
  { name: 'The Seen family', letters: 'س ش', tip: 'Three little teeth. Add three dots on top and س becomes ش.' },
  { name: 'The Suaad family', letters: 'ص ض', tip: 'A loop followed by a bowl; ض adds one dot.' },
  { name: 'The Toay family', letters: 'ط ظ', tip: 'A loop with a tall standing line; ظ adds one dot.' },
  { name: 'The Ain family', letters: 'ع غ', tip: 'An open "c"-like head; غ adds one dot.' },
  { name: 'Fay & Qaaf', letters: 'ف ق', tip: 'Both have a small round head. ف has one dot and a flat tail, ق has two dots and a deep round tail.' },
  { name: 'Kaaf & Gaaf', letters: 'ک گ', tip: 'Gaaf is kaaf with one extra slanted line on top.' },
]

/** Letters that never connect to the letter that follows them. */
export const NON_JOINING = URDU_LETTERS.filter((l) => !l.joinsNext && l.char !== 'ء').map((l) => l.char)
