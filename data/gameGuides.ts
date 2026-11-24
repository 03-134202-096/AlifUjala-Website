/**
 * Written guides shown under every game: what the game teaches, how to play it,
 * and how a parent or teacher can get the most out of it.
 * Each entry also supplies the page's title and meta description.
 */

export interface GameGuideData {
  slug: string
  name: string
  urduName?: string
  seoTitle: string
  description: string
  ages: string
  /** What the game is and why it exists — 2 short paragraphs */
  intro: string[]
  howToPlay: string[]
  skills: { title: string; body: string }[]
  parentTips: string[]
  /** Optional deeper reading */
  learnMore?: { href: string; label: string }
  /** Slugs of games to suggest next */
  next: string[]
}

export const GAME_GUIDES: Record<string, GameGuideData> = {
  urduHunter: {
    slug: 'urduHunter',
    name: 'Alphabet Hunter',
    urduName: 'حروف کا شکاری',
    seoTitle: 'Alphabet Hunter — Pop the Right Urdu Letter (Free Game for Kids)',
    description:
      'Bubbles carrying Urdu letters fall from the sky — pop the one that matches the target letter. A fast, free game that builds instant Urdu letter recognition for ages 4–9.',
    ages: '4–9',
    intro: [
      'Alphabet Hunter turns letter recognition into a quick-reaction game. A target letter is shown at the top of the screen, and bubbles carrying different Urdu letters fall from the sky. Your child pops the bubbles that match the target and lets the others go.',
      'Because the letters keep moving and the speed rises with every level, children stop "working out" each letter and start recognising it at a glance — the same skill they need later to read words fluently.',
    ],
    howToPlay: [
      'Press Start and look at the target letter shown at the top.',
      'Tap or click every bubble that carries the target letter.',
      'Popping a wrong letter, or letting the target letter escape, costs one of your five lives.',
      'Score enough points and you move up a level — the bubbles get faster each time.',
    ],
    skills: [
      { title: 'Visual discrimination', body: 'Telling apart look-alike letters such as ب and ت, which differ only by their dots.' },
      { title: 'Speed of recognition', body: 'Recognising a letter in under a second, a key step towards reading whole words.' },
      { title: 'Focus and self-control', body: 'Waiting for the right bubble instead of tapping everything on screen.' },
    ],
    parentTips: [
      'Before each round, say the target letter’s name and sound together, for example “seen — sss”.',
      'If your child often pops the wrong letter, pause and compare the two shapes side by side on paper.',
      'Keep sessions short: three or four rounds is enough for young children.',
    ],
    learnMore: { href: '/blog/nuqta-dots-in-urdu-letters', label: 'Why dots matter: a parent’s guide to nuqtas' },
    next: ['urduBasketCatch', 'urduBalloonPop', 'urduNuqtaSort'],
  },

  urduBasketCatch: {
    slug: 'urduBasketCatch',
    name: 'Basket Catch',
    urduName: 'ٹوکری میں پکڑو',
    seoTitle: 'Urdu Basket Catch — Catch the Falling Letters (Free Kids Game)',
    description:
      'Move the basket to catch the target Urdu letter and dodge the rest. A free arcade-style game for children that trains fast letter recognition and hand–eye coordination.',
    ages: '4–9',
    intro: [
      'In Basket Catch, Urdu letters fall from the top of the screen and your child moves a basket left and right to catch only the target letter. Every other letter must be avoided.',
      'Children have to identify each letter while it is moving and decide quickly whether to catch it, which strengthens recognition far more than looking at a static chart.',
    ],
    howToPlay: [
      'Press Start and note the target letter.',
      'Move the basket with the arrow keys, the mouse, or by dragging your finger on a phone or tablet.',
      'Catch the target letter to score points. Catching a wrong letter, or missing the target, costs a life.',
      'You have five lives. Each new level makes the letters fall faster and more often.',
    ],
    skills: [
      { title: 'Letter recognition in motion', body: 'Identifying letters quickly while they move.' },
      { title: 'Hand–eye coordination', body: 'Steering the basket to the right place at the right time.' },
      { title: 'Decision making', body: 'Choosing what to catch and what to avoid under gentle time pressure.' },
    ],
    parentTips: [
      'Ask your child to say the letter name out loud every time they catch it.',
      'Younger players can play together with you: you steer, they shout “catch!” when they see the target.',
      'Once a letter becomes easy, look for it in a storybook or on a food packet.',
    ],
    next: ['urduHunter', 'urduTileTap', 'memoryMatch'],
  },

  memoryMatch: {
    slug: 'memoryMatch',
    name: 'Memory Match',
    urduName: 'یادداشت کا کھیل',
    seoTitle: 'Urdu Letter Memory Match — Flip & Find the Pairs (Free Game)',
    description:
      'A free Urdu alphabet memory game: flip the cards, remember where each letter is hiding and find all the pairs. Three difficulty levels for children aged 4–10.',
    ages: '4–10',
    intro: [
      'Memory Match is the classic card-flipping game with Urdu letters on the cards. Children flip two cards at a time and try to find matching pairs, remembering where each letter was hiding.',
      'Every flip is a small recognition exercise: to know whether two cards match, a child has to look closely at both letters — including their dots — and hold them in memory.',
    ],
    howToPlay: [
      'Choose Easy (12 cards), Medium (16 cards) or Hard (20 cards).',
      'Flip two cards. If the letters are the same, the pair stays open.',
      'If they are different, they turn back over — try to remember where they were.',
      'Match every pair to win. Try to beat your best time and use fewer moves.',
    ],
    skills: [
      { title: 'Working memory', body: 'Remembering the position of several letters at once.' },
      { title: 'Careful looking', body: 'Checking small details such as the number and position of dots.' },
      { title: 'Letter naming', body: 'Saying each letter as it is flipped turns the game into gentle revision.' },
    ],
    parentTips: [
      'Make a rule that each flipped letter must be named aloud before the next flip.',
      'Play in turns with your child — children love beating a parent at memory games.',
      'Start on Easy and only move up once your child can finish without help.',
    ],
    learnMore: { href: '/urdu-alphabet', label: 'See every letter with its sound and example word' },
    next: ['alphabetMatch', 'urduGridFind', 'urduHunter'],
  },

  whackALetter: {
    slug: 'whackALetter',
    name: 'Whack-a-Letter',
    seoTitle: 'Whack-a-Letter — Fast Urdu Letter Game for Kids (Free)',
    description:
      'Moles pop up holding Urdu letters — tap only the ones with the target letter before the 30-second timer runs out. A free, quick-fire Urdu letter recognition game.',
    ages: '4–8',
    intro: [
      'Whack-a-Letter is a 30-second burst of fun. Moles pop up from their holes, each holding an Urdu letter, and your child taps only the moles that hold the target letter.',
      'The short timer makes it ideal as a warm-up before reading or writing practice, or as a reward at the end of a lesson.',
    ],
    howToPlay: [
      'Press Start and look at the target letter.',
      'Tap a mole when it is holding the target letter to score.',
      'Ignore moles with other letters.',
      'Score as many points as you can before the 30 seconds are up.',
    ],
    skills: [
      { title: 'Quick recognition', body: 'Spotting the target letter among others in a split second.' },
      { title: 'Attention', body: 'Staying focused on one letter while distractions appear.' },
      { title: 'Confidence', body: 'Short rounds give frequent wins, which keeps beginners motivated.' },
    ],
    parentTips: [
      'Use it as a 30-second warm-up at the start of each Urdu session.',
      'After the round, ask: “Which letter were you looking for? Can you draw it?”',
    ],
    next: ['urduBalloonPop', 'urduTileTap', 'urduHunter'],
  },

  urduBalloonPop: {
    slug: 'urduBalloonPop',
    name: 'Balloon Pop',
    urduName: 'غبارے پھوڑو',
    seoTitle: 'Urdu Balloon Pop — Pop the Correct Letter (Free Kids Game)',
    description:
      'Colourful balloons float up carrying Urdu letters. Pop the ones with the target letter before 45 seconds run out — a gentle, free letter recognition game for young children.',
    ages: '3–7',
    intro: [
      'Balloon Pop is one of the gentlest games on Alif Ujala, which makes it a good first game for very young learners. Balloons float slowly up the screen, each carrying an Urdu letter, and children pop the ones that show the target letter.',
      'Fittingly, the Urdu word for balloon — غبارہ (ghubaara) — begins with the letter غ, so it is a lovely game to pair with learning that letter.',
    ],
    howToPlay: [
      'Press Start and look at the target letter.',
      'Tap the balloons that carry the target letter to pop them and score.',
      'Let the other balloons float away.',
      'Pop as many correct balloons as you can in 45 seconds.',
    ],
    skills: [
      { title: 'First letter recognition', body: 'Slow-moving targets give beginners time to look and decide.' },
      { title: 'Fine motor control', body: 'Tapping a moving target helps small hands develop precision.' },
      { title: 'Vocabulary', body: 'A natural moment to teach غبارہ (balloon) and the letter غ.' },
    ],
    parentTips: [
      'For three- and four-year-olds, sit together and point to the target letter on the screen first.',
      'Celebrate correct pops by saying the letter name together.',
    ],
    next: ['whackALetter', 'memoryMatch', 'urduHunter'],
  },

  urduTrainPuzzle: {
    slug: 'urduTrainPuzzle',
    name: 'Alphabet Train',
    urduName: 'حروف کی ریل گاڑی',
    seoTitle: 'Urdu Alphabet Train — Which Letter Comes Next? (Free Puzzle)',
    description:
      'Complete the Urdu alphabet train by choosing the letter that comes next in the sequence. A free puzzle that teaches the order of the Urdu letters (حروفِ تہجی).',
    ages: '5–10',
    intro: [
      'The Alphabet Train shows a short run of Urdu letters in their alphabet order, with the last carriage empty. Your child chooses which letter belongs in the missing carriage from four options.',
      'Knowing the alphabet order is useful long after the early years — it is how children later find words in an Urdu dictionary (لغت) and follow the order of a qaida.',
    ],
    howToPlay: [
      'Look at the letters already on the train. They are in alphabet order, read from right to left.',
      'Choose the letter that comes next from the four options below the train.',
      'A correct answer earns 20 points and sends the train to the next puzzle.',
      'A wrong answer costs 5 points — have another look and try again.',
    ],
    skills: [
      { title: 'Alphabet sequence', body: 'Learning the order of the Urdu letters, not just their shapes.' },
      { title: 'Right-to-left reading', body: 'Following a sequence in the direction Urdu is read.' },
      { title: 'Reasoning', body: 'Ruling out options that cannot be correct.' },
    ],
    parentTips: [
      'Say the alphabet aloud together, the way it is recited in a qaida, before playing.',
      'Keep a printed alphabet chart nearby the first few times so your child can check the order.',
    ],
    learnMore: { href: '/urdu-alphabet', label: 'Print-friendly Urdu alphabet chart and guide' },
    next: ['alphabetMatch', 'memoryMatch', 'urduGridFind'],
  },

  urduGridFind: {
    slug: 'urduGridFind',
    name: 'Grid Find',
    urduName: 'حرف ڈھونڈو',
    seoTitle: 'Urdu Grid Find — Spot Every Matching Letter (Free Kids Game)',
    description:
      'Scan a 4×4 grid and find every copy of the target Urdu letter before time runs out. A free visual-scanning game that prepares children to find letters inside words.',
    ages: '5–10',
    intro: [
      'Grid Find shows a 4×4 grid of Urdu letters. Your child must find every square that contains the target letter — and only those squares — before the timer runs out.',
      'This kind of careful scanning is exactly what children do when they look for a letter inside a word or a line of text, so it is a great bridge between recognising single letters and reading.',
    ],
    howToPlay: [
      'Press Start and look at the target letter.',
      'Tap every square in the grid that shows the target letter.',
      'Clearing a grid earns bonus time and a fresh grid.',
      'You begin with 60 seconds — see how many grids you can clear.',
    ],
    skills: [
      { title: 'Visual scanning', body: 'Searching systematically, row by row, instead of tapping at random.' },
      { title: 'Discrimination', body: 'Rejecting look-alike letters from the same family.' },
      { title: 'Persistence', body: 'Checking the whole grid before moving on.' },
    ],
    parentTips: [
      'Teach your child to scan from right to left along each row — just like reading Urdu.',
      'Afterwards, open any Urdu book and play the same game: “How many ب can you find on this page?”',
    ],
    next: ['urduNuqtaSort', 'memoryMatch', 'urduTileTap'],
  },

  urduNuqtaSort: {
    slug: 'urduNuqtaSort',
    name: 'Nuqta Sorter',
    urduName: 'نقطے والے حروف',
    seoTitle: 'Nuqta Sorter — Does This Urdu Letter Have Dots? (Free Game)',
    description:
      'Sort Urdu letters into “has dots” and “no dots” before the timer ends. A free game that teaches nuqtas (نقطے), the small dots that tell Urdu letters apart.',
    ages: '4–9',
    intro: [
      'In Urdu, dots (نقطے, nuqtay) are not decoration — they are what turn one letter into another. ب has one dot below, ت has two above and ث has three above, yet all three share the same body.',
      'Nuqta Sorter asks one simple question about each letter: does it have dots or not? Answering it again and again trains children to look at the dots first, which prevents the most common Urdu reading mistakes.',
    ],
    howToPlay: [
      'Press Start. A single Urdu letter appears in the middle of the screen.',
      'Decide whether the letter has dots (nuqta) or no dots.',
      'Tap the matching bin to sort it. Correct answers score points.',
      'Sort as many letters as you can in 45 seconds.',
    ],
    skills: [
      { title: 'Noticing dots', body: 'Building the habit of checking dots before naming a letter.' },
      { title: 'Letter families', body: 'Seeing that dotted and undotted letters often share a shape, such as ح and خ.' },
      { title: 'Quick decisions', body: 'Answering confidently under gentle time pressure.' },
    ],
    parentTips: [
      'After a round, pick one letter and ask: “How many dots? Above or below?”',
      'Point out pairs that differ only by dots: س and ش, then ر and ز, then ع and غ.',
      'Note: ٹ (ttay), ڈ (ddaal) and ڑ (rray) carry a small ط sign rather than dots, so they count as “no dots”.',
    ],
    learnMore: { href: '/blog/nuqta-dots-in-urdu-letters', label: 'Read: Nuqtas explained for parents' },
    next: ['urduGridFind', 'urduHunter', 'urduDottedMatch'],
  },

  urduTileTap: {
    slug: 'urduTileTap',
    name: 'Tile Tap',
    seoTitle: 'Urdu Tile Tap — Tap the Target Letter Tiles (Free Rhythm Game)',
    description:
      'Piano-style tiles carrying Urdu letters slide down the screen — tap the target letter before it reaches the bottom. A free 30-second game for confident letter learners.',
    ages: '6–10',
    intro: [
      'Tile Tap is a fast, piano-style game for children who already know many letters. Tiles slide down in lanes, each showing an Urdu letter, and your child taps the tiles with the target letter before they reach the bottom.',
      'It is the most challenging recognition game on the site, so it works well as a “boss level” once a child is comfortable with Balloon Pop and Alphabet Hunter.',
    ],
    howToPlay: [
      'Press Start and look at the target letter.',
      'Tap each tile showing the target letter before it slides off the bottom.',
      'Avoid tapping tiles with other letters.',
      'Get the highest score you can in 30 seconds.',
    ],
    skills: [
      { title: 'Automatic recognition', body: 'Recognising letters fast enough that it no longer needs effort.' },
      { title: 'Reaction time', body: 'Responding quickly and accurately.' },
      { title: 'Concentration', body: 'Tracking several moving lanes at once.' },
    ],
    parentTips: [
      'If it feels too fast, go back to Balloon Pop for a few days and return later.',
      'Challenge older siblings to beat each other’s scores using the same target letter.',
    ],
    next: ['urduHunter', 'urduBasketCatch', 'whackALetter'],
  },

  alphabetMatch: {
    slug: 'alphabetMatch',
    name: 'Letter to Letter Match',
    urduName: 'حرف ملاؤ',
    seoTitle: 'Urdu Letter to Letter Matching — Free Activity & Printable Worksheet',
    description:
      'Match each Urdu letter to its twin by drawing a line between the two columns. Choose the letter range and number of pairs, play online, or download it as a free worksheet.',
    ages: '3–7',
    intro: [
      'Letter to Letter Match is a classic matching activity, the kind children meet in their first Urdu workbooks. Two columns show the same Urdu letters in a different order, and your child connects each letter to its twin.',
      'You choose which part of the alphabet to practise and how many pairs to show, so the same activity grows with your child — from five letters of the bay family to the full alphabet.',
    ],
    howToPlay: [
      'Choose a starting and ending letter to set the range, and how many pairs (5–8) to show.',
      'Press Start Game, then drag from a letter on one side to the same letter on the other side.',
      'When every letter is connected, press Submit to check your answers.',
      'Press the shuffle button for a new set, or download the same activity as a printable worksheet.',
    ],
    skills: [
      { title: 'Shape matching', body: 'The first step in learning any alphabet is noticing when two shapes are the same.' },
      { title: 'Attention to dots', body: 'Matching ب with ب rather than ت teaches children to check the dots.' },
      { title: 'Fine motor skills', body: 'Drawing a line from one letter to another prepares the hand for writing.' },
    ],
    parentTips: [
      'Start with a small range from one letter family, for example ب to ث.',
      'Print the worksheet for car journeys or quiet time away from screens.',
      'Ask your child to name each letter as they connect it.',
    ],
    learnMore: { href: '/blog/teaching-urdu-letters-by-family', label: 'How to teach Urdu letters family by family' },
    next: ['matching', 'urduDottedMatch', 'adhiAshkalMatch'],
  },

  matching: {
    slug: 'matching',
    name: 'Letter to Picture Match',
    urduName: 'حرف اور تصویر',
    seoTitle: 'Urdu Letter to Picture Matching — Free Phonics Activity for Kids',
    description:
      'Match each Urdu letter to a picture whose name starts with it, such as ا for انار (pomegranate). A free phonics activity with a printable worksheet option.',
    ages: '4–8',
    intro: [
      'Letter to Picture Match connects each Urdu letter to a word that begins with its sound: ا with انار (pomegranate), ب with بلی (cat), پ with پتنگ (kite). Children look at a picture, say its name, listen for the first sound and find the matching letter.',
      'This is the heart of phonics — linking a written symbol to a spoken sound — and it builds Urdu vocabulary at the same time.',
    ],
    howToPlay: [
      'Choose how many pairs to show and press Start Game.',
      'Look at each picture and say its name out loud.',
      'Drag a line from the picture to the letter its name starts with.',
      'Press Submit to check, then shuffle for a new set or download a printable worksheet.',
    ],
    skills: [
      { title: 'Phonics', body: 'Hearing the first sound of a word and linking it to a letter.' },
      { title: 'Vocabulary', body: 'Learning everyday Urdu nouns through pictures.' },
      { title: 'Speaking', body: 'Saying words aloud helps children who understand Urdu but rarely speak it.' },
    ],
    parentTips: [
      'Exaggerate the first sound: “bbb-illi”. Children hear it more easily.',
      'If your child names a picture in English, give the Urdu word and repeat it together.',
      'Use the same words around the house: point to a real cat or kite and ask which letter it starts with.',
    ],
    learnMore: { href: '/urdu-alphabet', label: 'Example words for every Urdu letter' },
    next: ['alphabetMatch', 'adhiAshkalMatch', 'memoryMatch'],
  },

  adhiAshkalMatch: {
    slug: 'adhiAshkalMatch',
    name: 'Half Letters Match',
    urduName: 'آدھی اشکال',
    seoTitle: 'Urdu Half Letters (Adhi Ashkal) Matching — Free Activity',
    description:
      'Match full Urdu letters with their half forms (آدھی اشکال), the shapes they take when joined inside a word. A free activity and printable worksheet for early readers.',
    ages: '5–10',
    intro: [
      'Most Urdu letters change shape when they join other letters. At the start or middle of a word, many letters shrink to a short “half” form — called آدھی شکل (adhi shakal). For example, ب at the start of بلی is only a small hook with a dot.',
      'Children who know only the full letters often get stuck the first time they see a real word. This activity bridges that gap by matching every full letter to its half form.',
    ],
    howToPlay: [
      'Choose the letter range and the number of pairs, then press Start Game.',
      'Look at a full letter on one side and find its half form on the other.',
      'Drag a line to connect them, then press Submit to check.',
      'Shuffle for a new set, or download the activity as a worksheet.',
    ],
    skills: [
      { title: 'Joined letter shapes', body: 'Recognising letters in the form they really appear inside words.' },
      { title: 'Early reading', body: 'Taking the step from single letters to whole words.' },
      { title: 'Letter families', body: 'Seeing that half forms in a family still differ only by their dots.' },
    ],
    parentTips: [
      'Write a short word such as بت or بس, and ask your child to find the half letter in it.',
      'Remind your child that nine letters never join to the next letter, so they have no separate half form: ا د ڈ ذ ر ڑ ز ژ و',
    ],
    learnMore: { href: '/blog/urdu-joining-letters-half-forms', label: 'Read: How Urdu letters join (half forms explained)' },
    next: ['urduDottedMatch', 'alphabetMatch', 'matching'],
  },

  urduDottedMatch: {
    slug: 'urduDottedMatch',
    name: 'Dotted Letter Match',
    seoTitle: 'Dotted Urdu Letter Match — Tracing Readiness Activity for Kids',
    description:
      'Match dotted Urdu letter outlines to their full forms. A free activity that builds shape recognition and prepares children for tracing and writing Urdu letters.',
    ages: '3–7',
    intro: [
      'Before children can write a letter, they need to “see” its shape inside a dotted outline — exactly what they will meet on a tracing worksheet. Dotted Letter Match shows dotted outlines on one side and full letters on the other.',
      'Matching them helps children recognise each letter’s skeleton, which makes their first tracing sessions far less frustrating.',
    ],
    howToPlay: [
      'Look at a dotted letter on the left.',
      'Find the same letter, written in full, on the right.',
      'Drag a line from the dotted letter to its full form.',
      'Match them all, then start a new round with different letters.',
    ],
    skills: [
      { title: 'Shape recognition', body: 'Seeing a letter’s form even when it is only an outline.' },
      { title: 'Tracing readiness', body: 'Preparing the eye before the hand starts writing.' },
      { title: 'Concentration', body: 'Comparing outlines carefully, dot by dot.' },
    ],
    parentTips: [
      'After playing, print a tracing worksheet from the Activities page with the same letters.',
      'Show your child where each letter starts — Urdu letters are written from right to left.',
    ],
    learnMore: { href: '/blog/urdu-handwriting-tracing-tips', label: 'Read: Urdu handwriting and tracing tips' },
    next: ['alphabetMatch', 'adhiAshkalMatch', 'urduNuqtaSort'],
  },
}

export function getGameGuide(slug: string) {
  return GAME_GUIDES[slug]
}
