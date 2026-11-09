/** Original beginner English course (our own content). Prompts in Turkish where a translation is asked. */

export type Question =
  | { type: "choose"; prompt: string; options: string[]; answer: string }
  | { type: "build"; prompt: string; source: string; answer: string[]; bank: string[] }
  | { type: "blank"; prompt: string; sentence: string; options: string[]; answer: string }
  | { type: "type"; prompt: string; source: string; accepted: string[] }
  | { type: "listen"; prompt: string; text: string };

export type Lesson = { id: string; title: string; questions: Question[] };
export type Unit = { id: string; title: string; subtitle: string; color: string; lessons: Lesson[] };

const choose = (prompt: string, answer: string, ...others: string[]): Question => ({
  type: "choose",
  prompt,
  answer,
  options: [answer, ...others],
});
const listen = (text: string): Question => ({ type: "listen", prompt: "Type what you hear", text });
const build = (answer: string, source: string, extra: string[]): Question => ({
  type: "build",
  prompt: "Translate this sentence",
  source,
  answer: answer.replace(/[.?!]/g, "").split(" "),
  bank: [...answer.replace(/[.?!]/g, "").split(" "), ...extra],
});

export const units: Unit[] = [
  {
    id: "u1",
    title: "Unit 1",
    subtitle: "Basics",
    color: "var(--c1)",
    lessons: [
      {
        id: "u1l1",
        title: "Greetings",
        questions: [
          choose('How do you say "Merhaba" in English?', "Hello", "Goodbye", "Thanks", "Sorry"),
          choose('What does "Good morning" mean?', "Günaydın", "İyi geceler", "Hoş geldin", "Güle güle"),
          { type: "blank", prompt: "Complete the sentence", sentence: "Nice to ___ you.", options: ["meet", "eat", "go", "play"], answer: "meet" },
          build("My name is Ali", "Benim adım Ali", ["your", "She", "are"]),
          { type: "type", prompt: "Type this in English", source: "Teşekkür ederim", accepted: ["thank you", "thanks", "thank you very much", "thanks a lot", "thank you so much", "many thanks"] },
          choose('Which reply fits "How are you?"', "I am fine, thanks.", "It is red.", "I have a dog.", "At six o'clock."),
          listen("Nice to meet you"),
        ],
      },
      {
        id: "u1l2",
        title: "Food and drink",
        questions: [
          choose('What is "water" in Turkish?', "Su", "Süt", "Çay", "Ekmek"),
          choose('Which word means "ekmek"?', "bread", "cheese", "rice", "apple"),
          { type: "blank", prompt: "Complete the sentence", sentence: "I drink ___ every morning.", options: ["tea", "chair", "bread", "table"], answer: "tea" },
          build("I eat an apple", "Ben bir elma yerim", ["drink", "a", "they"]),
          { type: "type", prompt: "Type this in English", source: "Ben süt içerim", accepted: ["i drink milk", "i drink some milk", "i drink the milk", "i am drinking milk", "i'm drinking milk", "i have milk"] },
          choose('"She likes cheese." means:', "O peyniri sever.", "O peyniri sevmez.", "O süt içer.", "O ekmek alır."),
        ],
      },
    ],
  },
  {
    id: "u2",
    title: "Unit 2",
    subtitle: "People and daily life",
    color: "var(--c3)",
    lessons: [
      {
        id: "u2l1",
        title: "Family",
        questions: [
          choose('Which word means "kız kardeş"?', "sister", "brother", "mother", "uncle"),
          { type: "blank", prompt: "Complete the sentence", sentence: "My ___ is a teacher. She works at a school.", options: ["mother", "father", "brother", "uncle"], answer: "mother" },
          build("He is my brother", "O benim erkek kardeşim", ["sister", "are", "your"]),
          choose('"They are my parents." means:', "Onlar benim ebeveynlerim.", "Onlar benim arkadaşlarım.", "Biz kardeşiz.", "O benim öğretmenim."),
          { type: "type", prompt: "Type this in English", source: "Benim iki kardeşim var", accepted: ["i have two brothers", "i have two sisters", "i have two siblings", "i have 2 brothers", "i have 2 sisters", "i have 2 siblings", "i've got two brothers", "i've got two sisters", "i've got two siblings", "i have got two brothers", "i have got two sisters", "i have got two siblings"] },
          choose("Choose the correct sentence", "We have a big family.", "We has a big family.", "We is a big family.", "We have big a family."),
          listen("I have a big family"),
        ],
      },
      {
        id: "u2l2",
        title: "Daily routine",
        questions: [
          choose('What does "wake up" mean?', "uyanmak", "uyumak", "koşmak", "yemek yemek"),
          { type: "blank", prompt: "Complete the sentence", sentence: "She ___ to school by bus.", options: ["goes", "go", "going", "gone"], answer: "goes" },
          build("I wake up at seven", "Ben yedide uyanırım", ["goes", "eat", "she"]),
          choose('Which is the right time? "Yediyi çeyrek geçiyor."', "It is a quarter past seven.", "It is half past seven.", "It is seven o'clock.", "It is a quarter to seven."),
          { type: "type", prompt: "Type this in English", source: "Ben her gün çalışırım", accepted: ["i work every day", "i work everyday", "i study every day", "i study everyday", "i work each day", "i study each day"] },
          choose("Choose the correct sentence", "He brushes his teeth after breakfast.", "He brush his teeth after breakfast.", "He brushing his teeth after breakfast.", "He is brush his teeth after breakfast."),
        ],
      },
    ],
  },
  {
    id: "u3",
    title: "Unit 3",
    subtitle: "Travel",
    color: "var(--c2)",
    lessons: [
      {
        id: "u3l1",
        title: "At the airport",
        questions: [
          choose('What does "passport" mean?', "pasaport", "bilet", "bavul", "uçak"),
          { type: "blank", prompt: "Complete the sentence", sentence: "Where is the ___ for flight 12?", options: ["gate", "kitchen", "pillow", "street"], answer: "gate" },
          build("Where is my suitcase", "Bavulum nerede", ["the", "are", "ticket"]),
          choose('"Your flight is delayed." means:', "Uçuşunuz rötar yaptı.", "Uçuşunuz iptal edildi.", "Uçuşunuz erken kalkıyor.", "Uçuşunuz doldu."),
          { type: "type", prompt: "Type this in English", source: "Biletim burada", accepted: ["my ticket is here", "here is my ticket", "here's my ticket", "my ticket's here", "this is my ticket", "my ticket is over here"] },
          choose("Which question is polite?", "Could you help me, please?", "Help me now.", "You help me.", "Me help please."),
        ],
      },
      {
        id: "u3l2",
        title: "Ordering at a café",
        questions: [
          choose('What does "I would like a coffee" mean?', "Bir kahve istiyorum.", "Bir kahve yaptım.", "Kahveyi sevmem.", "Kahve bitti."),
          { type: "blank", prompt: "Complete the sentence", sentence: "Can I have the ___, please?", options: ["bill", "sky", "shoe", "bed"], answer: "bill" },
          build("I would like a tea", "Bir çay istiyorum", ["coffee", "has", "we"]),
          choose('Which word means "hesap" at a restaurant?', "bill", "menu", "waiter", "table"),
          { type: "type", prompt: "Type this in English", source: "Bir su alabilir miyim?", accepted: ["can i have a water", "can i have some water", "can i have water", "can i get a water", "can i get some water", "can i get water", "could i have a water", "could i have some water", "could i have water", "could i get a water", "could i get some water", "may i have a water", "may i have some water", "may i have water", "can i have a glass of water", "could i have a glass of water", "can i get a glass of water"] },
          choose("Choose the correct sentence", "How much is this sandwich?", "How many is this sandwich?", "How much are this sandwich?", "How is much this sandwich?"),
          listen("Can I have the bill please"),
        ],
      },
    ],
  },
];

export const allLessons = units.flatMap((u) => u.lessons);
