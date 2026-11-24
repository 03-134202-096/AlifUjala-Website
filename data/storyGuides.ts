import { rabbitTurtleScenes } from './rabbitTurtleScenes'
import { lionFoxScenes } from './lionFoxScenes'
import { crowWaterScenes } from './crowWaterScenes'
import { greedyDogScenes } from './greedyDogScenes'
import { antGrasshopperScenes } from './antGrasshopperScenes'
import { foxGrapesScenes } from './foxGrapesScenes'
import { sheepWolfScenes } from './sheepWolfScenes'
import { hardworkingFarmerScenes } from './hardworkingFarmerScenes'

export type StoryScene = { text: string; img?: string; ending?: boolean; redEnding?: boolean }

export type VocabularyWord = { ur: string; roman: string; en: string }

export interface StoryGuide {
  /** URL slug: /stories/[slug] */
  slug: string
  /** Matches the video file in /public/videos/[storyId].mp4 and the story modal id */
  storyId: string
  titleEn: string
  titleUr: string
  cover: string
  /** One-line summary used on cards and in the meta description */
  summary: string
  /** The same summary in simple, everyday Urdu (shown first on cards and story pages) */
  summaryUr: string
  /** English translation, one entry per illustrated scene (same order as the Urdu scenes) */
  englishScenes: string[]
  /** English meaning of the closing lesson line(s) */
  moralEn: string
  ages: string
  themes: string[]
  /** The themes in everyday Urdu, shown as labels on the story page */
  themesUr: string[]
  vocabulary: VocabularyWord[]
  /** Discussion questions in English (shown with the translation toggle) */
  questions: string[]
  /** The same questions in simple, everyday Urdu (shown first) */
  questionsUr: string[]
  activity: string
  scenes: StoryScene[]
}

export const storyGuides: StoryGuide[] = [
  {
    slug: 'rabbit-and-tortoise',
    storyId: 'rabbit-turtle',
    titleEn: 'The Rabbit and the Tortoise',
    titleUr: 'خرگوش اور کچھوا',
    cover: '/images/stories/sroty 1.webp',
    summary:
      'A boastful rabbit races a slow tortoise, stops for a nap and loses — a classic Urdu moral story about patience, steady effort and the danger of pride.',
    summaryUr:
      'تیز دوڑنے والا خرگوش سست کچھوے کا مذاق اڑاتا ہے، مگر مقابلے کے بیچ میں سو جاتا ہے۔ آہستہ مگر لگاتار چلنے والا کچھوا جیت جاتا ہے۔',
    englishScenes: [
      "In a forest there lived a very clever and very fast rabbit. He always laughed at how slowly the tortoise moved and made fun of him.",
      'The tortoise just went quietly on his way. One day, the two of them had a race.',
      'As soon as the race began, the rabbit dashed far ahead.',
      'When he turned to look back, there was no sign of the tortoise anywhere. Along the way, the rabbit saw a shady tree.',
      'Then the rabbit thought, "If I rest for a little while, I will still win the race easily later." He lay down under a shady tree and fell asleep right there.',
      'Meanwhile the tortoise kept walking, slowly but steadily, and never stopped once. He went right past the rabbit sleeping under the tree.',
      'At last, the tortoise reached the finish line.',
      'When the rabbit woke up and came running, he was amazed to see that the tortoise was already there. The rabbit felt very ashamed.',
    ],
    moralEn:
      'Whoever keeps trying, slowly but steadily, succeeds in the end. Pride always comes before a fall (literally: "the head of pride is always bowed").',
    ages: '3–7',
    themes: ['Patience', 'Humility', 'Perseverance'],
    themesUr: ['صبر', 'عاجزی', 'ہمت نہ ہارنا'],
    vocabulary: [
      { ur: 'خرگوش', roman: 'khargosh', en: 'rabbit' },
      { ur: 'کچھوا', roman: 'kachhwa', en: 'tortoise' },
      { ur: 'دوڑ', roman: 'daur', en: 'race' },
      { ur: 'درخت', roman: 'darakht', en: 'tree' },
      { ur: 'منزل', roman: 'manzil', en: 'finish line, destination' },
      { ur: 'شرمندہ', roman: 'sharminda', en: 'ashamed' },
    ],
    questions: [
      'Why did the rabbit think he could take a nap in the middle of the race?',
      'What did the tortoise do differently from the rabbit?',
      'How do you think the rabbit should treat the tortoise next time?',
      'Can you remember a time when practising a little every day helped you get better at something?',
    ],
    questionsUr: [
      'خرگوش نے یہ کیوں سوچا کہ وہ دوڑ کے بیچ میں سو سکتا ہے؟',
      'کچھوے نے ایسا کیا کیا جو خرگوش نے نہیں کیا؟',
      'آپ کے خیال میں اگلی بار خرگوش کو کچھوے کے ساتھ کیسا برتاؤ کرنا چاہیے؟',
      'کیا آپ کو کوئی ایسا کام یاد ہے جو روز تھوڑی تھوڑی مشق سے آپ کو اچھی طرح آ گیا؟',
    ],
    activity:
      'Play a "slow and steady" game: draw a simple race track with ten boxes. Each time your child reads one new Urdu word correctly, the tortoise moves one box forward. Finishing the track — however long it takes — is the win.',
    scenes: rabbitTurtleScenes,
  },
  {
    slug: 'lion-and-the-clever-fox',
    storyId: 'lion-fox',
    titleEn: 'The Lion and the Clever Fox',
    titleUr: 'شیر اور چالاک لومڑی',
    cover: '/images/stories/sroty 2.webp',
    summary:
      'The jungle animals live in fear of a bullying lion until a quick-thinking fox tricks him with his own reflection in a well — a story about brains over brawn.',
    summaryUr:
      'جنگل کے سب جانور ایک ظالم شیر سے ڈرتے ہیں۔ ایک چالاک لومڑی اسے کنویں میں اس کا اپنا عکس دکھا کر سب کو بچا لیتی ہے۔',
    englishScenes: [
      'The lion of a jungle was powerful and mischievous. He went hunting every day, and the animals lived in fear.',
      'At last the animals decided that every day one animal would go to the lion by itself, so that the lion would not come into the jungle to hunt.',
      "When it was the fox's turn, she played a clever trick and arrived late on purpose.",
      'The fox said, "Another lion stopped me on the way! Come, I will show you where he is."',
      'She took him to a well and said, "He is in there!"',
      'The lion peered into the water and saw his own reflection. He roared, thought it was another lion, and in his anger jumped into the well.',
      'The fox was happy, and all the animals celebrated, because cruelty had come to a bad end.',
    ],
    moralEn: 'Wisdom works where strength fails — a clever mind can solve problems that force cannot.',
    ages: '5–9',
    themes: ['Problem solving', 'Courage', 'Standing up to bullies'],
    themesUr: ['مسئلے کا حل', 'بہادری', 'ظلم کا مقابلہ'],
    vocabulary: [
      { ur: 'شیر', roman: 'sher', en: 'lion' },
      { ur: 'لومڑی', roman: 'lomri', en: 'fox' },
      { ur: 'جنگل', roman: 'jangal', en: 'jungle, forest' },
      { ur: 'کنواں', roman: 'kunwaan', en: 'well' },
      { ur: 'عکس', roman: 'aks', en: 'reflection' },
      { ur: 'عقل', roman: 'aql', en: 'wisdom, good sense' },
    ],
    questions: [
      'Why were the animals afraid of the lion?',
      'What trick did the fox play, and why did it work?',
      'What did the lion see when he looked into the well?',
      'Was there another way the animals could have solved their problem together?',
    ],
    questionsUr: [
      'جانور شیر سے کیوں ڈرتے تھے؟',
      'لومڑی نے کیا چال چلی، اور وہ کامیاب کیوں ہوئی؟',
      'شیر نے کنویں میں جھانکا تو اسے کیا نظر آیا؟',
      'کیا جانور مل کر اپنی مشکل کسی اور طریقے سے بھی حل کر سکتے تھے؟',
    ],
    activity:
      'Look into a bowl of water or a mirror together and talk about reflections. Then write the word عکس (aks) on paper and ask your child to find the letter ع in it.',
    scenes: lionFoxScenes,
  },
  {
    slug: 'the-thirsty-crow',
    storyId: 'crow-water',
    titleEn: 'The Thirsty Crow',
    titleUr: 'کوا اور پانی',
    cover: '/images/stories/story 3.webp',
    summary:
      'On a scorching day a thirsty crow finds a pitcher with too little water — and solves the problem one pebble at a time. A favourite Urdu story about clever thinking.',
    summaryUr:
      'ایک پیاسے کوے کو گھڑا ملتا ہے، مگر اس میں پانی بہت کم ہے۔ وہ ایک ایک کنکر ڈال کر پانی اوپر لے آتا ہے اور اپنی پیاس بجھاتا ہے۔',
    englishScenes: [
      'During the hot summer days, a crow wandered here and there searching for water.',
      'He reached a garden and found a clay pitcher with only a little water in it.',
      'The water was so low that the crow’s beak could not reach it.',
      'Quickly, the crow gathered small pebbles from all around.',
      'He began dropping the pebbles into the pitcher, one by one.',
      'As more and more pebbles fell in, the water began to rise. At last it came up high enough for the crow to drink and quench his thirst.',
      'He thanked Allah and flew away happily.',
    ],
    moralEn:
      'Good sense and clever thinking can find a way through any difficulty — as the saying goes, "necessity is the mother of invention".',
    ages: '3–7',
    themes: ['Problem solving', 'Persistence', 'Gratitude'],
    themesUr: ['مسئلے کا حل', 'لگاتار کوشش', 'شکر'],
    vocabulary: [
      { ur: 'کوا', roman: 'kawwa', en: 'crow' },
      { ur: 'پانی', roman: 'paani', en: 'water' },
      { ur: 'گھڑا', roman: 'ghara', en: 'clay pitcher' },
      { ur: 'کنکر', roman: 'kankar', en: 'pebble' },
      { ur: 'چونچ', roman: 'chonch', en: 'beak' },
      { ur: 'پیاس', roman: 'pyaas', en: 'thirst' },
    ],
    questions: [
      'The crow found a pitcher, so what was the problem?',
      'Why did the water rise when the crow dropped pebbles into it?',
      'What would you have done if you were the crow?',
      'What do you say when someone helps you or when something good happens?',
    ],
    questionsUr: [
      'کوے کو گھڑا تو مل گیا، مگر مشکل کیا تھی؟',
      'کوے نے کنکر ڈالے تو پانی اوپر کیوں آ گیا؟',
      'اگر آپ کوے کی جگہ ہوتے تو کیا کرتے؟',
      'جب کوئی آپ کی مدد کرے یا کوئی اچھی بات ہو، تو آپ کیا کہتے ہیں؟',
    ],
    activity:
      'Try the crow’s experiment at home: half-fill a glass with water, mark the level with tape, then drop in clean pebbles or marbles and watch the water rise. Count the pebbles in Urdu as you go: ایک (one), دو (two), تین (three).',
    scenes: crowWaterScenes,
  },
  {
    slug: 'the-greedy-dog',
    storyId: 'greedy-dog',
    titleEn: 'The Greedy Dog',
    titleUr: 'لالچی کتا',
    cover: '/images/stories/story 4/thumbnail.webp',
    summary:
      'A dog with a bone sees his reflection in a stream, wants the "other" bone too, and loses everything — a short Urdu story about greed and gratitude.',
    summaryUr:
      'ایک کتے کو ہڈی ملتی ہے۔ پانی میں اپنا عکس دیکھ کر وہ دوسری ہڈی کے لالچ میں آ جاتا ہے اور اپنی ہڈی بھی کھو بیٹھتا ہے۔',
    englishScenes: [
      'Once, a dog found a bone. He was very happy and ran off towards home.',
      'On the way he came to a bridge. Looking down, the dog saw his own reflection in the water.',
      'He thought there was another dog in the water with a big bone in its mouth.',
      'He became greedy and started barking to snatch that dog’s bone.',
      'But as soon as he opened his mouth, his own bone fell into the water and sank.',
      'The dog was left full of regret. He had lost his own bone, and he never got the bone he saw in the water either.',
    ],
    moralEn: 'Greed is a curse. Be thankful for what you have — otherwise you may lose even that.',
    ages: '3–7',
    themes: ['Gratitude', 'Contentment', 'Thinking before acting'],
    themesUr: ['شکر', 'قناعت', 'سوچ کر کام کرنا'],
    vocabulary: [
      { ur: 'کتا', roman: 'kutta', en: 'dog' },
      { ur: 'ہڈی', roman: 'haddi', en: 'bone' },
      { ur: 'پل', roman: 'pul', en: 'bridge' },
      { ur: 'لالچ', roman: 'laalach', en: 'greed' },
      { ur: 'شکر', roman: 'shukr', en: 'thankfulness' },
    ],
    questions: [
      'What did the dog see in the water?',
      'Why did the dog’s own bone fall into the water?',
      'What does it mean to be thankful for what you have?',
      'Which three things are you thankful for today?',
    ],
    questionsUr: [
      'کتے کو پانی میں کیا نظر آیا؟',
      'کتے کی اپنی ہڈی پانی میں کیوں گر گئی؟',
      'جو کچھ ہمارے پاس ہے، اس پر شکر کرنے کا کیا مطلب ہے؟',
      'آج آپ کن تین چیزوں کے لیے شکر گزار ہیں؟',
    ],
    activity:
      'Make a small "shukr jar": each evening, help your child write (or draw) one thing they are thankful for and drop it in. Practise writing the word شکر, which is made of three letters: ش (sheen), ک (kaaf) and ر (ray).',
    scenes: greedyDogScenes,
  },
  {
    slug: 'ant-and-the-grasshopper',
    storyId: 'ant-grasshopper',
    titleEn: 'The Ant and the Grasshopper',
    titleUr: 'چیونٹی اور ٹڈی',
    cover: '/images/stories/ant-grasshopper/thumnnail.webp',
    summary:
      'A hardworking ant stores food all summer while a carefree grasshopper plays. When winter arrives, only one of them is ready — an Urdu story about planning ahead.',
    summaryUr:
      'گرمیوں میں چیونٹی محنت سے کھانا جمع کرتی ہے اور ٹڈی سارا دن کھیلتی رہتی ہے۔ جب سردیاں آتی ہیں تو پتا چلتا ہے کہ پہلے سے تیاری کتنی ضروری ہے۔',
    englishScenes: [
      'During the summer days, a little ant worked hard day and night. She was gathering food.',
      'Nearby, a grasshopper went about singing and hopping. She was not worried about the winter.',
      'The grasshopper said to the ant, "Why do you work so hard? Come and play with me!"',
      'The ant said, "Winter is coming, and I have to store food." But the grasshopper just kept laughing.',
      'When winter came, the ground was covered with snow. The grasshopper had nothing to eat, and she began to shiver with hunger.',
      'The ant’s home was full of food. She was warm and happy. The grasshopper finally realised her mistake.',
    ],
    moralEn: 'Today’s hard work makes tomorrow easier. Don’t put things off — start preparing now!',
    ages: '4–8',
    themes: ['Hard work', 'Planning ahead', 'Responsibility'],
    themesUr: ['محنت', 'پہلے سے تیاری', 'ذمہ داری'],
    vocabulary: [
      { ur: 'چیونٹی', roman: 'chiyunti', en: 'ant' },
      { ur: 'ٹڈی', roman: 'tiddi', en: 'grasshopper' },
      { ur: 'محنت', roman: 'mehnat', en: 'hard work' },
      { ur: 'گرمی', roman: 'garmi', en: 'summer, heat' },
      { ur: 'سردی', roman: 'sardi', en: 'winter, cold' },
      { ur: 'برف', roman: 'barf', en: 'snow, ice' },
    ],
    questions: [
      'What was the ant doing all summer? What was the grasshopper doing?',
      'Why was the ant warm and happy in winter?',
      'Are play and rest important too? How can we make time for both work and play?',
      'What is one thing you can get ready today for tomorrow?',
    ],
    questionsUr: [
      'گرمیوں میں چیونٹی کیا کر رہی تھی؟ اور ٹڈی کیا کر رہی تھی؟',
      'سردیوں میں چیونٹی گرم اور خوش کیوں تھی؟',
      'کیا کھیلنا اور آرام کرنا بھی ضروری ہے؟ ہم کام اور کھیل، دونوں کے لیے وقت کیسے نکالیں؟',
      'کل کے لیے آپ آج کون سی ایک تیاری کر سکتے ہیں؟',
    ],
    activity:
      'Sort pictures or toys into two baskets: things we need in گرمی (summer) and things we need in سردی (winter). Say each Urdu word aloud as you sort.',
    scenes: antGrasshopperScenes,
  },
  {
    slug: 'fox-and-the-grapes',
    storyId: 'fox-grapes',
    titleEn: 'The Fox and the Grapes',
    titleUr: 'لومڑی اور انگور',
    cover: '/images/stories/fox/thumbnail.webp',
    summary:
      'A hungry fox jumps again and again for a bunch of grapes she cannot reach, then walks away claiming they were sour anyway — the origin of “sour grapes”.',
    summaryUr:
      'ایک بھوکی لومڑی اونچائی پر لٹکے انگوروں تک پہنچنے کے لیے بار بار اچھلتی ہے۔ جب نہیں پہنچ پاتی تو کہتی ہے: ”انگور کھٹے ہیں!“',
    englishScenes: [
      'One day it was very hot. A hungry fox was wandering through the forest. She was looking for something to eat.',
      'She saw a beautiful bunch of black, juicy grapes hanging from a vine.',
      'Her mouth watered. She jumped up to pick the grapes, but they were far too high.',
      'The fox jumped again and again, but failed every time. She grew tired and began to pant.',
      'At last she lost hope and turned back. As she walked away, she turned up her nose and said:',
      '"These grapes are unripe and sour! I don’t even eat grapes like these!" — even though she knew the truth: she simply could not reach them.',
    ],
    moralEn:
      'It is wrong to call something bad just because we cannot get it. Always tell the truth, and keep working hard.',
    ages: '4–8',
    themes: ['Honesty', 'Handling disappointment', 'Perseverance'],
    themesUr: ['سچائی', 'ناکامی کو قبول کرنا', 'ہمت نہ ہارنا'],
    vocabulary: [
      { ur: 'انگور', roman: 'angoor', en: 'grapes' },
      { ur: 'گچھا', roman: 'guchha', en: 'bunch' },
      { ur: 'بیل', roman: 'bel', en: 'vine, creeper' },
      { ur: 'کھٹا', roman: 'khatta', en: 'sour' },
      { ur: 'چھلانگ', roman: 'chhalaang', en: 'jump, leap' },
    ],
    questions: [
      'Why couldn’t the fox reach the grapes?',
      'Were the grapes really sour? How do you know?',
      'How do you feel when you can’t do something you really want to do?',
      'What could the fox have tried instead of giving up?',
    ],
    questionsUr: [
      'لومڑی انگوروں تک کیوں نہ پہنچ سکی؟',
      'کیا انگور سچ میں کھٹے تھے؟ آپ کو کیسے پتا؟',
      'جب آپ کوئی کام کرنا چاہیں اور نہ کر سکیں، تو آپ کو کیسا لگتا ہے؟',
      'ہمت ہارنے کے بجائے لومڑی اور کیا کر سکتی تھی؟',
    ],
    activity:
      'Talk about tastes in Urdu: میٹھا (sweet), کھٹا (sour), نمکین (salty). Taste a grape, a slice of lemon and a cracker, and let your child name each taste in Urdu.',
    scenes: foxGrapesScenes,
  },
  {
    slug: 'boy-who-cried-wolf',
    storyId: 'sheep-wolf',
    titleEn: 'The Boy Who Cried Wolf',
    titleUr: 'بھیڑیا آیا! بھیڑیا آیا!',
    cover: '/images/stories/sheep-story/thumbnail.webp',
    summary:
      'Ahmed the shepherd boy tricks his village twice with a false alarm. When a real wolf comes, nobody believes him — an Urdu moral story about honesty and trust.',
    summaryUr:
      'چرواہا احمد دو بار جھوٹ موٹ چلّاتا ہے: ”بھیڑیا آیا!“ جب سچ میں بھیڑیا آتا ہے تو کوئی اس کی بات نہیں مانتا۔',
    englishScenes: [
      'In a village near a mountain lived a shepherd boy named Ahmed. Every day he took the sheep out to graze.',
      'One day he thought of a prank. He shouted loudly, "The wolf is here! The wolf is here!"',
      'The villagers came running with their sticks, but there was no wolf. Ahmed burst out laughing.',
      'The next day he played the same trick. Again everyone came running, and again he laughed.',
      'On the third day a wolf really did come! Ahmed shouted, "The wolf is here! Help!"',
      'But this time nobody came, because everyone thought he was lying again. The wolf killed the sheep.',
      'Ahmed cried and cried. Now he understood that when someone lies again and again, nobody believes them even when they tell the truth.',
    ],
    moralEn: 'Always tell the truth. People stop trusting someone who tells lies.',
    ages: '4–9',
    themes: ['Honesty', 'Trust', 'Responsibility'],
    themesUr: ['سچ بولنا', 'اعتبار', 'ذمہ داری'],
    vocabulary: [
      { ur: 'چرواہا', roman: 'charwaaha', en: 'shepherd' },
      { ur: 'بھیڑ', roman: 'bher', en: 'sheep' },
      { ur: 'بھیڑیا', roman: 'bheriya', en: 'wolf' },
      { ur: 'گاؤں', roman: 'gaaon', en: 'village' },
      { ur: 'سچ', roman: 'sach', en: 'truth' },
      { ur: 'جھوٹ', roman: 'jhoot', en: 'lie' },
    ],
    questions: [
      'Why did the villagers come running the first time?',
      'Why didn’t anyone come on the third day?',
      'How do you think the villagers felt after being tricked?',
      'What can Ahmed do to earn back people’s trust?',
    ],
    questionsUr: [
      'پہلی بار گاؤں والے بھاگتے ہوئے کیوں آئے؟',
      'تیسرے دن کوئی کیوں نہیں آیا؟',
      'دھوکا کھا کر گاؤں والوں کو کیسا لگا ہو گا؟',
      'احمد لوگوں کا اعتبار دوبارہ کیسے جیت سکتا ہے؟',
    ],
    activity:
      'Play "سچ یا جھوٹ" (true or false): say simple sentences such as "The sky is green" or "A cat says meow" and let your child answer سچ or جھوٹ. Then swap roles.',
    scenes: sheepWolfScenes,
  },
  {
    slug: 'farmer-and-the-bundle-of-sticks',
    storyId: 'hardworking-farmer',
    titleEn: 'The Hardworking Farmer and the Bundle of Sticks',
    titleUr: 'محنتی کسان',
    cover: '/images/stories/farmer/thumbnail.webp',
    summary:
      'A hardworking old farmer uses a bundle of sticks to show his three quarrelling sons that together they cannot be broken — a short Urdu story about unity and teamwork.',
    summaryUr:
      'ایک بوڑھے کسان کے تین بیٹے ہر وقت جھگڑتے رہتے ہیں۔ کسان لکڑیوں کے ایک گٹھے سے انہیں سمجھاتا ہے کہ مل کر رہنے میں ہی طاقت ہے۔',
    englishScenes: [
      'An old farmer had three sons who were always quarrelling with one another. The farmer was very worried about them.',
      'When the farmer knew that his time to die was near, he called all three sons and gave them a bundle of three sticks.',
      'He said, "Whoever can break this bundle will get all my savings!" All three tried, but the bundle would not break.',
      'Then the farmer untied the bundle and gave each son a single stick. All three snapped their sticks easily.',
      'The farmer smiled and said, "A single stick is weak, but together they cannot be broken — and you three are just the same!"',
      'The three brothers realised their mistake. They worked together and made their field green and full of life.',
    ],
    moralEn: 'There is blessing in unity. Stand by one another — together, every difficulty becomes easy!',
    ages: '5–10',
    themes: ['Unity', 'Teamwork', 'Family'],
    themesUr: ['اتحاد', 'مل جل کر کام کرنا', 'خاندان'],
    vocabulary: [
      { ur: 'کسان', roman: 'kisaan', en: 'farmer' },
      { ur: 'بیٹا', roman: 'beta', en: 'son' },
      { ur: 'لکڑی', roman: 'lakri', en: 'stick, wood' },
      { ur: 'گٹھا', roman: 'gattha', en: 'bundle' },
      { ur: 'کھیت', roman: 'khet', en: 'field' },
      { ur: 'اتحاد', roman: 'ittehaad', en: 'unity' },
    ],
    questions: [
      'Why couldn’t the sons break the bundle of sticks?',
      'What was the farmer trying to teach his sons?',
      'When have you worked together with someone to do something difficult?',
      'How can brothers and sisters help each other at home?',
    ],
    questionsUr: [
      'بیٹے لکڑیوں کا گٹھا کیوں نہ توڑ سکے؟',
      'کسان اپنے بیٹوں کو کیا سکھانا چاہتا تھا؟',
      'کیا آپ نے کبھی کسی کے ساتھ مل کر کوئی مشکل کام کیا ہے؟',
      'بہن بھائی گھر میں ایک دوسرے کی مدد کیسے کر سکتے ہیں؟',
    ],
    activity:
      'Do the experiment yourselves with dry spaghetti or thin twigs: snap one, then try a bundle of ten. Afterwards, count the sticks in Urdu from ایک to دس.',
    scenes: hardworkingFarmerScenes,
  },
]

export function getStoryGuide(slug: string) {
  return storyGuides.find((s) => s.slug === slug)
}

export function getStoryGuideByStoryId(storyId: string) {
  return storyGuides.find((s) => s.storyId === storyId)
}

const URDU_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/** Writes the digits of a number in Urdu, e.g. "7" becomes "۷". */
export function toUrduDigits(value: string) {
  return value.replace(/[0-9]/g, (d) => URDU_DIGITS[Number(d)])
}

/** The age range in everyday Urdu, e.g. "3–7" becomes "عمر: ۳ سے ۷ سال". */
export function urduAges(ages: string) {
  const [from, to] = ages.split(/[–-]/).map((n) => toUrduDigits(n.trim()))
  return to ? `عمر: ${from} سے ${to} سال` : `عمر: ${from} سال`
}
