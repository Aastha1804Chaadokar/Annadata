export interface StructuredDosage {
  product: string;
  amountPerAcre: string;
  timing: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: string;
  category?: 'fertilizer' | 'pest' | 'irrigation' | 'crop_selection' | 'general';
  structuredData?: {
    summary?: string;
    dosages?: StructuredDosage[];
    warnings?: string[];
    steps?: string[];
  };
  suggestedFollowUps?: string[];
}

export interface AssistantSession {
  sessionId: string;
  messages: ChatMessage[];
  farmerContextSummary: string;
  createdAt: string;
}
