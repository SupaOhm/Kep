"use client";

import { createWorker } from "tesseract.js";
import { parseSlipText } from "./slip-parser";
import type { OcrProgress, SlipProcessor } from "./slip-processor";

export const localTesseractSlipProcessor: SlipProcessor = {
  id: "local-tesseract",
  label: "Local OCR",
  async process(file: File, onProgress?: (progress: OcrProgress) => void) {
    const worker = await createWorker("eng+tha", 1, {
      logger(message) {
        if (typeof message.progress === "number") {
          onProgress?.({ status: message.status, progress: message.progress });
        }
      }
    });

    try {
      const result = await worker.recognize(file);
      return parseSlipText(result.data.text);
    } finally {
      await worker.terminate();
    }
  }
};
