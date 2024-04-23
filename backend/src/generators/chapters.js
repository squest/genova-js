// This function generates chapters for a book based on the title and description of the book

import { addChapters } from "../content/chapterSection/chapter.js";

async function expandChapters(openai, {title, description}) {
  const messages = [
    {
      role: "system",
      content: "Gue ada author yang jago untuk nentuin topik apa yang mesti dibahas dengan sistematik, urutan logiknya bagus, dan jelas buat pembaca"
    },
    {
      role: "user", 
      content: `Gue butuh elo untuk jabarin lebih lengkap apa yang harus dibahas dari suatu topik, ini buat chapter buku yang judulnya ${title}`
    },
    {
      role: "assistant",
      content: "Oke, coba elo ceritain lebih detail tentang topik yang mau elo bahas."
    },
    { 
      role: "user", 
      content: `OK, ini isi bab yang mesti elo expand jadi lebih detail, lebih lengkap, panjang, dan jelas: ${description}`
    },
    {
      role: "assistant",
      content: "Formatnya gimana?"
    },
    {
      role: "user",
      content: "Formatnya json yang isinya js object yang propertinya title and description, title isinya judul bab, description isinya isi bab yang mesti elo expand"
    }
  ]

  const result = await openai({
    model: "gpt3",
    messages,
    type: "chapter"
  });

  return result;
}

// title and description are the title and description of the book
// n is the number of chapters you want to generate
export default async function generateChapters(
  db,
  openai,
  { userId, bookId, title, description, n }
) {
  const messages = [
    {
      role: "system",
      content: `Gue adalah sang pencerah, gue bisa bikin orang jadi ateis rational saintifik,
    dengan cara bikin orang mempertanyakan segala sesuatu, dan secara meyakinkan gue bisa bikin orang jadi skeptis, 
    tapi skeptis yang cerdas. Plus gue bisa ngasih insights yang bikin mereka punya worldview yang lebih saintifik dan ngubah 
    the way the see the world.`,
    },
    {
      role: "user",
      content: `Gue lagi ngarang buku judulnya ${title} and gue butuh elo untuk susun chapternya.`,
    },
    {
      role: "assistant",
      content:
        "Oke, coba elo ceritain lebih detail tentang topik yang mau elo bahas.",
    },
    { role: "user", content: description },
    { role: "assistant", content: "Butuh berapa chapters?" },
    {
      role: "user",
      content: `Gue butuh ${n} chapters, sekalian sama title and description untuk tiap chapter yak`,
    },
    {
      role: "assistant",
      content: "Bahasanya gimana? Formal/informal? Bahasa Indonesia/Inggris?",
    },
    {
      role: "user",
      content:
        "Bahasa Indonesia campur catchy english, informal, catchy, witty, tapi JANGAN CRINGE & SOK ASIK",
    },
    { role: "assistant", content: "Readersnya bakal kayak gimana?" },
    {
      role: "user",
      content:
        "Readersnya kira2 umur 18-35, jadi elo ngomong jangan kayak ke anak kecil, tapi jangan juga kayak ke orang tua,",
    },
    { role: "assistant", content: "Oke, formatnya gimana?" },
    {
      role: "user",
      content:
        "Formatnya json yg isinya array of chapters, tiap chapter ada title and description",
    },
  ];

  const result = await openai({
    model: "gpt3",
    messages,
    userId,
    type: "chapters",
  });

  const chapters = await result.chapters.map((chapter, idx) => {
    return expandChapters(openai, {title: chapter.title, description: chapter.description});
  })

  const chapterResult = await addChapters(db, bookId, chapters);

  return chapterResult;
}
