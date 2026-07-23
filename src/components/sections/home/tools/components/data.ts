import { IconName } from '@/components/ui/icon';

export interface Tool {
  name: string;
  description: string;
  icon: IconName;
  invertOnHover?: boolean;
}

export const TOOLS: Tool[] = [
  {
    name: 'OpenAI',
    description: 'Foundation models and APIs for language, vision, and reasoning.',
    icon: 'LogoOpenAI',
    invertOnHover: true
  },
  {
    name: 'LangChain',
    description: 'Framework for building context-aware LLM applications.',
    icon: 'LogoLangChain',
    invertOnHover: true
  },
  {
    name: 'Pinecone',
    description: 'Vector database for semantic search and retrieval.',
    icon: 'LogoPinecone',
    invertOnHover: true
  },
  {
    name: 'Supabase',
    description: 'Postgres platform with auth, storage, and realtime APIs.',
    icon: 'LogoSupabase'
  },
  {
    name: 'Anthropic',
    description: 'Claude models for safe, high-quality AI assistants.',
    icon: 'LogoAnthropicClaude'
  },
  {
    name: 'Gemini',
    description: 'Google multimodal models for text, code, and vision.',
    icon: 'LogoGemini'
  },
  {
    name: 'Hugging Face',
    description: 'Open models, datasets, and ML infrastructure.',
    icon: 'LogoHuggingFace'
  },
  {
    name: 'LlamaIndex',
    description: 'Data framework for LLM retrieval and agents.',
    icon: 'LogoLlamaIndex'
  },
  {
    name: 'Meta',
    description: 'Open-weight Llama models and AI research stack.',
    icon: 'LogoMeta'
  },
  {
    name: 'Mistral AI',
    description: 'Efficient open and frontier language models.',
    icon: 'LogoMistralAI'
  },
  {
    name: 'OpenAI',
    description: 'Foundation models and APIs for language, vision, and reasoning.',
    icon: 'LogoOpenAI',
    invertOnHover: true
  },
  {
    name: 'LangChain',
    description: 'Framework for building context-aware LLM applications.',
    icon: 'LogoLangChain',
    invertOnHover: true
  },
  {
    name: 'Pinecone',
    description: 'Vector database for semantic search and retrieval.',
    icon: 'LogoPinecone',
    invertOnHover: true
  },
  {
    name: 'Supabase',
    description: 'Postgres platform with auth, storage, and realtime APIs.',
    icon: 'LogoSupabase'
  },
  {
    name: 'Anthropic',
    description: 'Claude models for safe, high-quality AI assistants.',
    icon: 'LogoAnthropicClaude'
  },
  {
    name: 'Gemini',
    description: 'Google multimodal models for text, code, and vision.',
    icon: 'LogoGemini'
  },
  {
    name: 'Hugging Face',
    description: 'Open models, datasets, and ML infrastructure.',
    icon: 'LogoHuggingFace'
  },
  {
    name: 'LlamaIndex',
    description: 'Data framework for LLM retrieval and agents.',
    icon: 'LogoLlamaIndex'
  },
  {
    name: 'Meta',
    description: 'Open-weight Llama models and AI research stack.',
    icon: 'LogoMeta'
  },
  {
    name: 'Mistral AI',
    description: 'Efficient open and frontier language models.',
    icon: 'LogoMistralAI'
  }
];
