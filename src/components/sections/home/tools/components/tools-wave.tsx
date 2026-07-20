'use client';

import { useEffect, useRef } from 'react';

import { Icon, IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import { ToolItem } from './tool-item';

interface Tool {
  name: string;
  description: string;
  icon: IconName;
  invertOnHover?: boolean;
}

const TOOLS: Tool[] = [
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

const WAVE_STAGGER_S = 0.22;
const AUTO_SCROLL_SPEED_PX_PER_S = 48;

export function ToolsWave() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollContainer = container;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) return;

    let animationFrameId = 0;
    let previousTimestamp: number | null = null;
    let isScrollComplete = false;

    function stopScroll() {
      isScrollComplete = true;
      cancelAnimationFrame(animationFrameId);
    }

    function step(timestamp: number) {
      if (isScrollComplete) return;

      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      }

      const elapsedMs = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      if (maxScrollLeft <= 0) {
        stopScroll();
        return;
      }

      const distance = (AUTO_SCROLL_SPEED_PX_PER_S * elapsedMs) / 1000;
      const nextScrollLeft = scrollContainer.scrollLeft + distance;

      if (nextScrollLeft >= maxScrollLeft) {
        scrollContainer.scrollLeft = maxScrollLeft;
        stopScroll();
        return;
      }

      scrollContainer.scrollLeft = nextScrollLeft;
      animationFrameId = requestAnimationFrame(step);
    }

    animationFrameId = requestAnimationFrame(step);

    return stopScroll;
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className='w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    >
      <ul className={cn('mx-auto flex w-max items-center gap-4 px-4 pt-16 pb-36', 'sm:gap-5 sm:pt-20 lg:gap-6 lg:pt-24 lg:pb-56')}>
        {TOOLS.map(function renderTool(tool, index) {
          return (
            <li
              key={`${tool.name}-${index}`}
              className='tools-wave-item relative z-0 will-change-transform hover:z-20'
              style={{ animationDelay: `${-index * WAVE_STAGGER_S}s` }}
            >
              <ToolItem
                icon={<Icon icon={tool.icon} size={85} />}
                name={tool.name}
                description={tool.description}
                invertOnHover={tool.invertOnHover}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
