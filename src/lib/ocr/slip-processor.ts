export type OcrProgress = {
  status: string;
  progress: number;
};

export type SlipDraft = {
  amount?: string;
  occurred_at?: string;
  receiver_name?: string;
  merchant_name?: string;
  bank_name?: string;
  reference_id?: string;
  raw_text: string;
};

export interface SlipProcessor {
  id: string;
  label: string;
  process(file: File, onProgress?: (progress: OcrProgress) => void): Promise<SlipDraft>;
}
