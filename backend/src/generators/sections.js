// Generate sections for a chapter in a book

import { addSections } from "../content/chapterSection/section.js";

// title and description are the title and description of the book
// n is the number of chapters you want to generate
export default async function generateSections(
  db,
  openai,
  {
    userId,
    chapterId,
    bookTitle,
    bookDescription,
    chapterTitle,
    chapterDescription,
    n,
  }
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
      content: `Gue lagi ngarang buku judulnya ${bookTitle} dengan deskripsi begini ${bookDescription}.`,
    },
    { role: "assistant", content: "Oke, terus?" },
    {
      role: "user",
      content: `Gue lagi nulis chapter yg judulnya ${chapterTitle}.
      Nah sekarang gue butuh ide untuk susun sectionnya untuk chapter ini.`,
    },
    { role: "assistant", content: "Coba jelasin isi chapternya apa?" },
    { role: "user", content: chapterDescription },
    { role: "assistant", content: "Butuh berapa sections untuk chapter ini?" },
    {
      role: "user",
      content: `Gue butuh ${n} sections, biasanya section awal kasih intro yg bikin yg baca relate and penasaran,
      abis itu baru section2 selanjutnya deep dive into the topic, jangan kasih kesimpulan ya,
      terus sekalian sama title and description untuk tiap section yak`,
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
        "Formatnya json yg isinya array of sections, tiap section ada title and description",
    },
  ];

  const result = await openai({
    model: "gpt3",
    messages,
    userId,
    type: "sections",
  });

  const newSection = await addSections(db, chapterId, result.sections);

  return newSection;
}
