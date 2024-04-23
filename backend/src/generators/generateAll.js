
import generateChapters from './generateChapters';
import generateSections from './generateSections';
import generateSectionContent from './generateSectionContent';

// Generate the whole book including the whole chapters, sections, and section contents
export async function generateWholeBook(db, openai, { userId, title, description, nChapter, nSection}) {
  
  const chapters = await generateChapters(db, openai, { userId, title, description, n: nChapter });

  let chapterWithSections = [];
  
  for (const chapter in chapters) {
    const chapterId = chapter._id;
    const chapterTitle = chapter.title;
    const chapterDescription = chapter.description;
    const bookTitle = title;
    const bookDescription = description;
    const sections = await generateSections(db, openai, { userId, chapterId, bookTitle, bookDescription, chapterTitle, chapterDescription, n: nSection });
    chapterWithSections.push({ _id : chapterId, title : chapterTitle, description : chapterDescription, sections });
  }

  for (let i = 0; i < chapterWithSections.length; i++) {
    const chapter = chapterWithSections[i];
    for (let j = 0; j < chapter.length; j++) {
      const section = chapter[j];
      const sectionId = section._id;
      const sectionTitle = section.title;
      const sectionDescription = section.description;
      await generateSectionContent(db, openai, 
        { userId, sectionId, bookTitle : title, bookDescription : description, chapterTitle, chapterDescription, sectionTitle, sectionDescription });
    }
  }
}

// Generate the whole chapter including the sections and section contents
export async function generateWholeChapter(db, openai, { userId, chapterId, title, description, nSection }) { 

  const chapterTitle = title;
  const chapterDescription = description;
  const bookTitle = title;
  const bookDescription = description;
  const sections = await generateSections(db, openai, { userId, chapterId, bookTitle, bookDescription, chapterTitle, chapterDescription, n: nSection });

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const sectionId = section._id;
    const sectionTitle = section.title;
    const sectionDescription = section.description;
    await generateSectionContent(db, openai, 
      { userId, sectionId, bookTitle : title, bookDescription : description, chapterTitle, chapterDescription, sectionTitle, sectionDescription });
  }
}

