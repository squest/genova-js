import axios from "axios";
import { recordRequest } from "../admin/gptAccounting.js";
import { addGptResult } from "../admin/gptRecorder.js";
import { v4 as uuid } from "uuid";

const models = {
  gpt3: "gpt-3.5-turbo-0125",
  gpt4: "gpt-4-turbo",
};

export default async function getGenerator(config, db) {
  const apiKey = config.OPENAI_API_KEY;
  const openaiUrl = config.OPENAI_URL;
  const openai = axios.create({
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  return async ({ model, messages, userId, type }) => {
    return await generate(
      db,
      { openai, openaiUrl },
      { model, messages, userId, type }
    );
  };
}

async function generate(
  db,
  { openai, openaiUrl },
  { model, messages, userId, type }
) {
  try {
    console.log("Calling generator function");
    console.log({ model, messages, userId, type });
    const response = await openai.post(openaiUrl, {
      messages: messages,
      max_tokens: 4000,
      temperature: 0.21,
      n: 1,
      model: models[model],
      response_format: { type: "json_object" },
    });
    if (response) {
      const result = JSON.parse(response.data.choices[0].message.content);
      console.log("result", result);
      const record = response.data.usage;
      await addGptResult(db, {
        type,
        gptVersion: model,
        userId,
        result,
      });
      // Acceptable types are 'bookIdeas', 'chapters', 'sections', 'sectionContent'
      // acceptable models 'gpt3', 'gpt4'
      await recordRequest(db, {
        type,
        gptVersion: model,
        userId,
        inputToken: record.prompt_tokens,
        outputToken: record.completion_tokens,
        totalToken: record.prompt_tokens + record.completion_tokens,
      });
      return result;
    }
  } catch (error) {
    console.error(
      "The AI unironically ngabarin kalo it made an error :",
      error.response ? error.response.data : error.message
    );
  }
}
