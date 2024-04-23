// This function generates the content of a section in a book.

import { addSectionContent } from "../content/chapterSection/section.js";
import { getAuthorStyle } from "../user/author.js";
// title and description are the title and description of the book
// n is the number of chapters you want to generate
export default async function generateSectionContent(
  db,
  openai,
  {
    userId,
    sectionId,
    bookTitle,
    bookDescription,
    chapterTitle,
    chapterDescription,
    sectionTitle,
    sectionDescription,
  }
) {

  const { styleGuide } = await getAuthorStyle(db, userId);
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
      content: `Gue lagi nulis chapter yg judulnya ${chapterTitle}. yang big-picture isinya kira2x begini ${chapterDescription}.`,
    },
    { role: "assistant", content: "Oke, terus?" },
    {
      role: "user",
      content: `Nah sekarang gue lagi nulis bagian section di chapter ini yg judulnya ${sectionTitle}.
      Isinya kira2x seputar ini ${sectionDescription}.`,
    },
    { role: "assistant", content: "Oke, sekarang yg elo butuh dari gue apa?" },
    {
      role: "user",
      content: `Gue butuh elo nulis section ini, minimal 1000 kata untuk section ini ya. Coba elo bikin tulisan yang menarik, engaging, logical connection jelas,
      comprehensive, bisa dimengerti banyak orang, jangan pelit ngasih penjelasan. Harus jelas alesan kenapanya, dan jangan lupa kasih referensi juga ya kalo dibutuhin`,
    },
    {
      role: "assistant",
      content: "Bahasanya gimana? Formal/informal? Bahasa Indonesia/Inggris?",
    },
    {
      role: "user",
      content:
        `Secara umum informal, catchy, witty, TAPI JANGAN CRINGE & SOK ASIK
        Nah lengkapnya ada di sini ${styleGuide}.`
    },
    { role: "assistant", content: "Readersnya bakal kayak gimana?" },
    {
      role: "user",
      content:
        `Readersnya kira2 umur 18-35, jadi elo ngomong jangan kayak ke anak kecil, tapi jangan juga kayak ke orang tua, 
        dan yang paling penting JANGAN NGASIH KESIMPULAN SOK BIJAK`,
    },
    { role: "assistant", content: "Oke, formatnya gimana?" },
    {
      role: "user",
      content: `Formatnya itu object artikel json yg isinya title and content, 
                contentnya berupa string panjang yang isinya artikelnya, dalam format html.`,
    },
  ];

  const result = await openai({
    model: "gpt3",
    messages,
    userId,
    type: "sectionContent",
  });

  const newContent = await addSectionContent(db, sectionId, result.content);

  return newContent;
}
