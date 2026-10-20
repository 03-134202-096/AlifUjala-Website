import type { LearningIconName } from '@/components/ui/LearningIcon'
import type { WorksheetLayout } from '@/lib/worksheetRenderer'

type WorksheetTemplate = {
  label: string
  title: string
  filename: string
  helper: string
  layout: WorksheetLayout
  icon: LearningIconName
  thumbnail?: string
  caption?: string
}

export const WORKSHEET_TEMPLATES = {
  tracing: {
    label: 'Urdu Letter Tracing',
    title: 'Urdu Letter Tracing / اردو حروف کی مشق',
    filename: 'worksheet_urdu_letter_tracing.pdf',
    helper: 'Follow one dotted writing path for each Urdu letter. Practice the whole alphabet or a smaller range.',
    layout: 'tracing', icon: 'letters', caption: 'Discover every letter',
    thumbnail: '/images/worksheetsSample/practice/alphabet-tracing.webp',
  },
  'writing-rows': {
    label: 'Trace & Write',
    title: 'Trace & Write / حروف لکھنے کی مشق',
    filename: 'worksheet_urdu_trace_write.pdf',
    helper: 'Start with a clear model, follow the dotted letters, then use the empty spaces to write independently. Five letters per page.',
    layout: 'writing-rows', icon: 'pencil', caption: 'From tracing to writing',
    thumbnail: '/images/worksheetsSample/practice/trace-write.webp',
  },
  'picture-rows': {
    label: 'Picture, Trace & Write',
    title: 'Picture, Trace & Write / تصویر دیکھیں، حرف لکھیں',
    filename: 'worksheet_urdu_picture_practice.pdf',
    helper: 'Use a familiar picture and its Urdu word to practice the first letter. Five picture words per page.',
    layout: 'picture-rows', icon: 'palette', caption: 'Letters meet pictures',
    thumbnail: '/images/worksheetsSample/practice/picture-practice.webp',
  },
  'letter-focus': {
    label: 'Letter Spotlight',
    title: 'Letter Spotlight / حرف کی مشق',
    filename: 'worksheet_urdu_letter_spotlight.pdf',
    helper: 'One letter and picture per page, with guided rows that gradually leave more room for independent writing.',
    layout: 'letter-focus', icon: 'book', caption: 'One letter at a time',
    thumbnail: '/images/worksheetsSample/practice/letter-spotlight.webp',
  },
  'letter-find': {
    label: 'Find & Circle',
    title: 'Find & Circle / حرف تلاش کریں',
    filename: 'worksheet_urdu_find_circle.pdf',
    helper: 'Look at the model letter on the right, then circle every matching letter. Choose New Puzzle for a fresh set.',
    layout: 'letter-find', icon: 'search', caption: 'Build letter recognition',
    thumbnail: '/images/worksheetsSample/practice/find-circle.webp',
  },
  alphabet: {
    label: 'Letter to Letter', title: 'Alphabet Matching / حرف ملائیں', filename: 'worksheet_alphabet_match.pdf',
    helper: 'Match Urdu letters with their correct pair.', layout: 'matching', icon: 'letters',
  },
  image: {
    label: 'Letter to Image', title: 'Letter to Image Matching / حرف اور تصویر', filename: 'worksheet_letter_image_match.pdf',
    helper: 'Match letters with picture tiles and practice recognition.', layout: 'matching', icon: 'palette',
  },
  adhi: {
    label: 'Adhi Ashkal', title: 'Adhi Ashkal Matching / آدھی اشکال ملائیں', filename: 'worksheet_adhi_ashkal_match.pdf',
    helper: 'Match letters with their half-shape style cards.', layout: 'matching', icon: 'puzzle',
  },
} satisfies Record<string, WorksheetTemplate>

export type WorksheetType = keyof typeof WORKSHEET_TEMPLATES
export const PRACTICE_TEMPLATE_IDS = ['tracing', 'writing-rows', 'picture-rows', 'letter-focus', 'letter-find'] as const
