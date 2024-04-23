// This file contains the code for generating book ideas

import { addIdea } from "../content/bookIdea/idea.js";

// title and description are the title and description of the idea for the books
// n is the number of book titles you want to generate
export default async function generateBookIdea(
  db,
  openai,
  { userId, title, description, n }
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
      content: `Gue butuh mencerahkan orang tentang ${title} dan gue mau nulis beberapa short books (20-30 halaman) tentang itu.
      Nah gue butuh ide buat judul buku2 itu, gue butuh ide title and descriptionnya juga, bikin witty, intriguing, dan catchy supaya pengen dibaca.`,
    },
    {
      role: "assistant",
      content:
        "Oke, coba elo ceritain lebih detail tentang topik yang mau elo bahas.",
    },
    { role: "user", content: description },
    { role: "assistant", content: "Butuh berapa ide?" },
    {
      role: "user",
      content: `Gue butuh ${n} ide buku, title-nya dan descriptionnya, 
      descriptionnya yg panjang ya untuk jelasin isi buku bakal kayak apa`,
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
        "Formatnya json yg isinya array of book ideas, tiap ide ada title and description",
    },
  ];

  const result = await openai({
    model: "gpt3",
    messages,
    userId,
    type: "bookIdeas",
  });

  const idea = {
    title,
    description,
    bookIdeas: result.bookIdeas,
  };

  const newIdea = await addIdea(db, userId, idea);

  return newIdea;
}
