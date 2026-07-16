'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function logButtonClick() {
  console.log('clicked');
}

export default function Home() {
  return (
    <div className='bg-background text-foreground flex flex-col items-center justify-center gap-8 px-6 py-20 text-center'>
      <Dialog>
        <DialogTrigger className='cursor-pointer'>Open Dialog Wrapper</DialogTrigger>
        <DialogContent className='p-4 md:p-10'>
          <DialogHeader className='mt-17 md:mt-12.75'>
            <DialogTitle>Client director</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Badge title='About us' />
      <div className='flex w-full max-w-md flex-col items-center gap-4'>
        <Input
          placeholder='Project details'
          handleIcon={() => console.log('clicked')}
          endIcon={<Icon icon='Paperclip' fill='#1B1C2380' width={20} height={20} />}
        />
        <Input
          error={'Error test text 404'}
          placeholder='Project details'
          handleIcon={() => console.log('clicked')}
          endIcon={<Icon icon='Paperclip' fill='#1B1C2380' width={20} height={20} />}
        />
      </div>

      <div className='border-outline flex w-full max-w-2xl flex-col items-start gap-6 rounded-xl border bg-gray-400 p-8 text-left'>
        <Typography variant='h3'>Buttons</Typography>

        <Button variant='primary' onClick={logButtonClick}>
          Discuss project
        </Button>
        <Button variant='primary' disabled>
          Discuss project
        </Button>
        <Button onClick={logButtonClick}>All</Button>
        <Button disabled>All</Button>
        <Button variant='white' onClick={logButtonClick}>
          All
        </Button>
        <Button variant='white' disabled>
          All
        </Button>

        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='icon' size='icon-lg' aria-label='Close large' onClick={logButtonClick}>
            <Icon icon='X' fill='currentColor' width={23} height={23} />
          </Button>
          <Button variant='icon' size='icon-md' aria-label='Close medium' onClick={logButtonClick}>
            <Icon icon='X' fill='currentColor' width={20} height={20} />
          </Button>
          <Button variant='white' size='icon-lg' aria-label='Close white large' onClick={logButtonClick}>
            <Icon icon='X' fill='currentColor' width={23} height={23} />
          </Button>
          <Button variant='white' size='icon-md' aria-label='Close white medium' onClick={logButtonClick}>
            <Icon icon='X' fill='currentColor' width={20} height={20} />
          </Button>
          <Button variant='icon' size='icon-md' aria-label='Close disabled' disabled>
            <Icon icon='X' fill='currentColor' width={20} height={20} />
          </Button>
        </div>
      </div>

      <div className='bg-mist-gray flex flex-wrap items-center gap-4 p-4'>
        <Icon icon='Burger' />
        <Icon icon='Logo' />
        <Icon icon='LogoWhite' />
        <Icon icon='ChevronDown' />
        <Icon icon='Play' />
        <Icon icon='SidebarTop' />
        <Icon icon='LogoOpenAI' />
        <Icon icon='LogoAnthropicClaude' />
        <Icon icon='LogoGemini' />
        <Icon icon='LogoMeta' />
        <Icon icon='LogoMistralAI' />
        <Icon icon='LogoHuggingFace' />
        <Icon icon='LogoSupabase' />
        <Icon icon='LogoLangChain' />
        <Icon icon='LogoPinecone' />
        <Icon icon='LogoLlamaIndex' />
        <Icon icon='LogoLinkedin' />
        <Icon icon='LogoX' />
        <Icon icon='LogoInstagram' />
        <Icon icon='LogoThreads' />
        <Icon icon='Copy' />
        <Icon icon='X' />
        <Icon icon='X' fill='#1B1C23' />
        <Icon icon='Paperclip' />
        <Icon icon='Paperclip' fill='#1B1C23' />
        <Icon icon='ArrowUp' />
        <Icon icon='ArrowUp' color='#fff' />
        <Icon icon='ArrowLeft' />
        <Icon icon='ArrowRight' />
        <Icon icon='ArrowUpRight' />
        <Icon icon='MagnifyingGlass' />
        <Icon icon='Stars' />
        <Icon icon='Crown' />
        <Icon icon='StarPlus' />
        <Icon icon='LogoMark' />
        <Icon icon='PencilSimple' />
        <Icon icon='ChevronLeft' />
        <Icon icon='ChevronRight' />
      </div>
      <div className='bg-surface border-outline flex w-full max-w-2xl flex-col items-center gap-6 rounded-xl border p-8 text-left'>
        <Typography variant='h3'>Color Palette</Typography>
        <div className='flex flex-wrap justify-center gap-4'>
          {[
            { name: 'Electric Green', color: 'bg-electric-green' },
            { name: 'Lime Glow', color: 'bg-lime-glow' },
            { name: 'Digital Cyan', color: 'bg-digital-cyan' },
            { name: 'Deep Teal', color: 'bg-deep-teal' },
            { name: 'Graphite Gray', color: 'bg-graphite-gray' },
            { name: 'Mist Gray', color: 'bg-mist-gray' },
            { name: 'Black', color: 'bg-brand-black' },
            { name: 'Black 50%', color: 'bg-brand-black/50' },
            { name: 'White', color: 'bg-brand-white' },
            { name: 'White 50%', color: 'bg-brand-white/50' }
          ].map((item) => (
            <div key={item.name} className='flex flex-col items-center gap-2'>
              <div className={`border-outline h-16 w-16 rounded-full border shadow-sm ${item.color}`} />
              <Typography variant='caption'>{item.name}</Typography>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-surface border-outline flex w-full max-w-2xl flex-col items-center gap-6 rounded-xl border p-8 text-left'>
        <Typography variant='h3'>Border Radiuses & Gradient</Typography>
        <div className='flex flex-wrap justify-center gap-6'>
          {[
            { name: '10px (sm)', radius: 'rounded-sm' },
            { name: '12px (md)', radius: 'rounded-md' },
            { name: '16px (lg)', radius: 'rounded-lg' },
            { name: '20px (xl)', radius: 'rounded-xl' },
            { name: '36px (2xl)', radius: 'rounded-2xl' }
          ].map((item) => (
            <div key={item.name} className='flex flex-col items-center gap-2'>
              <div className={`from-electric-green to-digital-cyan h-24 w-24 bg-gradient-to-br shadow-sm ${item.radius}`} />
              <Typography variant='caption'>{item.name}</Typography>
            </div>
          ))}
        </div>
      </div>

      <Typography variant='display1'>Display 1 (96/40)</Typography>
      <Typography variant='display2'>Display 2 (80/40)</Typography>
      <Typography variant='h1'>Heading 1 (70/40)</Typography>
      <Typography variant='h2'>Heading 2 (48/32)</Typography>
      <Typography variant='h3'>Heading 3 (32/24)</Typography>
      <Typography variant='h4'>Heading 4 (24/20)</Typography>
      <Typography variant='h5'>Heading 5 (20/20)</Typography>
      <Typography variant='h6'>Heading 6 (18/18)</Typography>
      <Typography variant='body1'>Body 1 (24/20)</Typography>
      <Typography variant='body2'>Body 2 (20/20)</Typography>
      <Typography variant='body3'>Body 3 (18/18)</Typography>
      <Typography variant='description'>Description (16/16)</Typography>
      <Typography variant='caption'>Caption (16/16)</Typography>
    </div>
  );
}
