export interface AlphabetStory {
  /** YouTube video ID  */
  videoId: string
  /** Display title */
  title: string
  /** Urdu letter(s) covered */
  letters: string
  /** Duration string */
  duration: string
  /** Order in the Urdu alphabet sequence */
  order: number
}

const alphabetStories: AlphabetStory[] = [
  {
    videoId: "pYX6GiCFrfs",
    title: "Urdu Alphabet - Alif ki Kahani",
    letters: "ا",
    duration: "3:15",
    order: 1,
  },
  {
    videoId: "N0oI5g3AvwE",
    title: "Urdu Alphabet Story -- Bay(ب) ki Kahani, Bay(ب) ki Zubaani",
    letters: "ب",
    duration: "4:11",
    order: 2,
  },
  {
    videoId: "e_4VnIWLj5E",
    title: "Urdu Alphabet Story -- Jeem (ج) Kay Khandan ki Kahani",
    letters: "ج",
    duration: "3:47",
    order: 3,
  },
  {
    videoId: "y8GLgK81jBY",
    title: "Urdu Alphabet Story — Daal kay Dost / د کے دوست",
    letters: "د",
    duration: "4:12",
    order: 4,
  },
  {
    videoId: "HJjr8UxecZQ",
    title: "Urdu Alphabet Story — Ray ka Khandaan / ر کا خاندان",
    letters: "ر",
    duration: "5:15",
    order: 5,
  },
  {
    videoId: "XUqn2HVCO38",
    title: "Urdu Alphabet Story — Seen (س) Sheen (ش)",
    letters: "س ش",
    duration: "5:36",
    order: 6,
  },
  {
    videoId: "nOZRuIBoRJg",
    title: "Urdu Alphabet Story — Suaad (ص) Zuaad (ض)",
    letters: "ص ض",
    duration: "4:51",
    order: 7,
  },
  {
    videoId: "a1HYLL0rVp4",
    title: "Tuay Zuay ki Kahani / ط اور ظ کی کہانی",
    letters: "ط ظ",
    duration: "4:43",
    order: 8,
  },
  {
    videoId: "-3WxQehx4cw",
    title: "Aaen aur Ghaen ki Kahani / ع اور غ کی کہانی",
    letters: "ع غ",
    duration: "6:37",
    order: 9,
  },
  {
    videoId: "ctb6GX70CGc",
    title: "Urdu Alphabet Story / ف اور ق کی کہانی",
    letters: "ف ق",
    duration: "5:50",
    order: 10,
  },
  {
    videoId: "UZtUxYl3lms",
    title: "Urdu Alphabet Story / ک اور گ کی کہانی",
    letters: "ک گ",
    duration: "6:54",
    order: 11,
  },
  {
    videoId: "XPJlq2Xl7bU",
    title: "Urdu Alphabet Story / ل، م اور ن کی کہانی",
    letters: "ل م ن",
    duration: "9:14",
    order: 12,
  },
  {
    videoId: "zQjo1_P3TfU",
    title: "Urdu Alphabet Story / و، ہ اور ء کی کہانی",
    letters: "و ہ ء",
    duration: "7:10",
    order: 13,
  },
  {
    videoId: "qKHQfy3D3FY",
    title: "Urdu Alphabet Story / ی اور ے کی کہانی",
    letters: "ی ے",
    duration: "4:58",
    order: 14,
  },
]

export default alphabetStories
