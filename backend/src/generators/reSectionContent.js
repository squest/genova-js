
import { updateSection } from '../content/chapterSection/section';
import { getAuthorStyle } from '../user/author';

export default async function regenerateSectionContent(db, openai, 
  { 
    userId,
    sectionId,
    title, 
    sectionContent,
    feedback
  }) 
  {
    const styleGuide = await getAuthorStyle(db, userId);
    const messages = [
      {
        role : "system",
        content : "Gue adalah best selling author untuk buku-buku yang promoting science and reason"
      },
      {
        role: "user",
        content: `Gue lagi nulis satu bab dari buku, terus ini ada section judulnya ${title}.`
      },
      {
        role: "assistant",
        content: "Oke, terus?"
      },
      {
        role: "user",
        content: `Ini tulisan gue so far ${sectionContent}`
      },
      {
        role: "assistant",
        content: "Oke, sekarang yang elo butuh dari gue apa?"
      },
      {
        role: "user",
        content: `Gue butuh elo nulis ulang section ini, minimal 1000 kata untuk section ini ya. 
        Coba elo bikin tulisan yang menarik, engaging, logical connection jelas. Coba ubah jadi kira kira begini ${feedback}`
      },
      {
        role: "assistant",
        content: "Bahasanya gimana? Formal/informal? Bahasa Indonesia/Inggris?"
      },
      {
        role: "user",
        content: `Secara umum informal, catchy, witty, TAPI JANGAN CRINGE & SOK ASIK, ini style guide gue ${styleGuide}`
      },
      {
        role: "assistant",
        content: `Formatnya gimana?`
      },
      {
        role: "user",
        content: `Formatnya json yang isinya js object dengan property title dan content`
      }
    ]

    const result = await openai({
      model: "gpt3",
      messages,
      type: "sectionContent"
    });

    const newContent = await updateSection(db, sectionId, result.content);
}