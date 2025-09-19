
import { GoogleGenAI, Modality } from "@google/genai";
import { EditingOptions, GeneratedImage } from '../types';

// This is a simplified color manipulation function.
// A more robust library like tinycolor2 would be better for production.
const generateColorShades = (hexColor: string): { name: string; hex: string }[] => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => 
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

  const adjustLightness = (rgb: { r: number; g: number; b: number }, factor: number) => {
    const newR = Math.max(0, Math.min(255, rgb.r + (255 - rgb.r) * factor));
    const newG = Math.max(0, Math.min(255, rgb.g + (255 - rgb.g) * factor));
    const newB = Math.max(0, Math.min(255, rgb.b + (255 - rgb.b) * factor));
    return { r: Math.round(newR), g: Math.round(newG), b: Math.round(newB) };
  };
  
  const adjustDarkness = (rgb: { r: number; g: number; b: number }, factor: number) => {
    const newR = Math.max(0, Math.min(255, rgb.r * factor));
    const newG = Math.max(0, Math.min(255, rgb.g * factor));
    const newB = Math.max(0, Math.min(255, rgb.b * factor));
    return { r: Math.round(newR), g: Math.round(newG), b: Math.round(newB) };
  };

  const baseRgb = hexToRgb(hexColor);
  
  const shades = [
    { name: 'Pastel (Nhạt)', hex: rgbToHex(adjustLightness(baseRgb, 0.6).r, adjustLightness(baseRgb, 0.6).g, adjustLightness(baseRgb, 0.6).b) }, // Pastel
    { name: 'Tươi', hex: hexColor }, // Original
    { name: 'Rượu vang', hex: rgbToHex(adjustDarkness(baseRgb, 0.7).r, adjustDarkness(baseRgb, 0.7).g, adjustDarkness(baseRgb, 0.7).b) }, // Wine
    { name: 'Đô (Sẫm)', hex: rgbToHex(adjustDarkness(baseRgb, 0.4).r, adjustDarkness(baseRgb, 0.4).g, adjustDarkness(baseRgb, 0.4).b) }, // Dark
  ];

  return shades;
};

const getPromptDetails = (options: EditingOptions): string => {
    let prompt = `The subject should wear a '${options.clothingStyle}'. `;
    if (options.collarStyle === 'Tự chọn' && options.customCollar) {
        prompt += `The collar style is custom: '${options.customCollar}'. `;
    }
    if (options.clothingPattern === 'Ngẫu nhiên kiểu hoa văn phù hợp phần ngực áo') {
        prompt += `The clothing should have a suitable, subtle pattern on the chest area. `;
    }
    if (options.hairstyle === 'Thêm vài sợi tóc li ti, rìa tóc mềm mại') {
        prompt += `Enhance the hair by adding a few fine, wispy strands and softening the hairline for a more natural look. `;
    } else if (options.hairstyle === 'Tự chọn' && options.customHairstyle) {
        prompt += `The hairstyle should be changed to: '${options.customHairstyle}'. `;
    }
    if (options.expression === 'Thêm nụ cười mỉm nhẹ tự nhiên, không làm thay đổi cấu trúc khuôn mặt') {
        prompt += `Adjust the facial expression to a gentle, natural, closed-mouth smile without altering the core facial structure. `;
    }
    return prompt;
};


const enhancementPrompts = [
    { id: 1, title: 'Vẻ đẹp tự nhiên', prompt: "Apply a 'natural beauty' enhancement: refine skin tone, lighting, and sharpness for a clear, authentic look. Ensure the face appears bright and true-to-life." },
    { id: 2, title: 'Gương mặt hồng hào', prompt: "Apply a 'rosy glow' enhancement: add a subtle, healthy pink hue to the cheeks and lips for a radiant and vibrant appearance." },
    { id: 3, title: 'Tinh chỉnh ngẫu nhiên 1', prompt: "Apply a 'subtle refinement' beauty algorithm: gently smooth the skin, slightly increase contrast, and enhance facial contours for a polished yet natural look." },
    { id: 4, title: 'Tinh chỉnh ngẫu nhiên 2', prompt: "Apply a 'professional polish' beauty algorithm: subtly brighten the eyes, even out skin tone under the eyes, and add a soft focus effect while keeping key features sharp." },
];

export const generateIdPhotos = async (
  base64ImageData: string,
  mimeType: string,
  options: EditingOptions
): Promise<GeneratedImage[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image-preview';

  const colorShades = generateColorShades(options.clothingColor);
  const commonPromptDetails = getPromptDetails(options);

  const generationPromises = enhancementPrompts.map(async (enhancement, index) => {
    const colorInfo = colorShades[index];
    const fullPrompt = `
      From the provided portrait, generate a professional 3x4cm ID photo with 300 DPI resolution.
      The background must be a solid, uniform blue (#007bff).
      Keep the subject's core facial features, identity, and head position identical to the original image.
      ${commonPromptDetails}
      The clothing color should be a '${colorInfo.name}' shade, specifically the hex color '${colorInfo.hex}'.
      Facial enhancement: ${enhancement.prompt}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { data: base64ImageData, mimeType: mimeType } },
            { text: fullPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return {
            id: enhancement.id,
            src: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
            title: enhancement.title,
            colorName: colorInfo.name,
          };
        }
      }
      throw new Error(`Image part not found in response for enhancement: ${enhancement.title}`);

    } catch (error) {
       console.error(`Error generating image for ${enhancement.title}:`, error);
       throw new Error(`Failed to generate image for "${enhancement.title}". Please check console for details.`);
    }
  });

  const results = await Promise.all(generationPromises);
  return results.filter((r): r is GeneratedImage => r !== undefined);
};
