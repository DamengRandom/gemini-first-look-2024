import "dotenv/config";
import input from "@inquirer/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const aiClassInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiGenerativeAI {
  constructor(aiClassInstance) {
    this.aiClassInstance = aiClassInstance;
  }

  fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }

  defineModel(model) {
    return this.aiClassInstance.getGenerativeModel({
      model,
    });
  }

  async getOutput(geminiProAgent, prompt, imageParts) {
    const output = await geminiProAgent.generateContent(
      imageParts ? [prompt, ...imageParts] : prompt
    );
    const response = output.response;

    const text = response.text();

    console.log("Result: ", text);
  }
}

// const fileToGenerativePart = (path, mimeType) => ({
//   inlineData: {
//     data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//     mimeType,
//   },
// });

// const defineModel = (model) =>
//   aiClassInstance.getGenerativeModel({
//     model,
//   });

// const getOutput = async (geminiProAgent, prompt, imageParts) => {
//   const output = await geminiProAgent.generateContent(
//     imageParts ? [prompt, ...imageParts] : prompt
//   );
//   const response = output.response;

//   const text = response.text();

//   console.log("Result: ", text);
// };

// Class based model definition
const geminiGenerativeAI = new GeminiGenerativeAI(aiClassInstance);

// model agent for text inquiry
// const geminiProAgent = defineModel("gemini-pro");
const geminiProAgent = geminiGenerativeAI.defineModel("gemini-pro");

// model agent for vision detector
// const geminiProVisionAgent = defineModel("gemini-pro-vision");
const geminiProVisionAgent =
  geminiGenerativeAI.defineModel("gemini-pro-vision");

const qna = async () => {
  const prompt = await input({
    message: "Please enter the question below",
  });

  // await getOutput(geminiProAgent, prompt);
  await geminiGenerativeAI.getOutput(geminiProAgent, prompt);
};

const imageReader = async () => {
  const prompt = "what this image about, any description?";
  // const imageFile = [fileToGenerativePart("assets/code.png", "image/png")];
  const imageFile = [
    geminiGenerativeAI.fileToGenerativePart("assets/code.png", "image/png"),
  ];

  // await getOutput(geminiProVisionAgent, prompt, imageFile);
  await geminiGenerativeAI.getOutput(geminiProVisionAgent, prompt, imageFile);
};

imageReader(); // start Image Reader
// qna(); // start Question & Answer
