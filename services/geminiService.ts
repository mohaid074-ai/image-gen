import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage } from '../types';

const apiKey = process.env.API_KEY || "AIzaSyDjxxeJo33gYsNeTY8ZoNZEzMI2xGAIGnI";

if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const base64FromFile = async (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      resolve({ mimeType: file.type, data: base64Data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const base64FromDataUrl = (dataUrl: string): {mimeType: string, data: string} => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const base64Data = parts[1];
    return { mimeType, data: base64Data };
}

export const refinePrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Refine this user's image generation prompt to be more descriptive, detailed, and evocative. Add specific details about style, lighting, and composition. Return only the refined prompt.
      
      User prompt: "${prompt}"
      
      Refined prompt:`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error refining prompt:", error);
    throw new Error("Failed to connect with the AI to refine the prompt.");
  }
};

export const generateImages = async (prompt: string, numVariations: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: numVariations,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please check your prompt and API key.");
  }
};

export const editImage = async (prompt: string, uploadedImage: UploadedImage): Promise<string[]> => {
    try {
        let imagePart;
        if(uploadedImage.file) {
            const {mimeType, data} = await base64FromFile(uploadedImage.file);
            imagePart = { inlineData: { data, mimeType }};
        } else {
            const {mimeType, data} = base64FromDataUrl(uploadedImage.dataUrl);
            imagePart = { inlineData: { data, mimeType }};
        }

        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const editedImages: string[] = [];
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                editedImages.push(imageUrl);
            }
        }
        
        if (editedImages.length === 0) {
            throw new Error("The AI did not return an edited image. It may have only responded with text.");
        }

        return editedImages;

    } catch(error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit the image. The model may not have been able to perform the requested edit.");
    }
}