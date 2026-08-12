import Link from 'next/link';

import { Typography } from '@/components/ui/typography';

import footerContent from '../content.json';

export const FooterNav = () => {
  return (
    <nav className='text-foreground mb-7.25 flex flex-col gap-11.25 md:mb-9 md:flex-row md:justify-between' aria-label='Footer Navigation'>
      <div className='flex flex-col gap-5'>
        <Typography variant='description'>{footerContent.location}</Typography>
        <ul className='flex flex-col gap-5'>
          {footerContent.contacts.map((contact) => (
            <li key={contact.href}>
              <Link href={contact.href} className='text-foreground/50 hover:text-foreground transition-colors'>
                {contact.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {footerContent.navSections.map((section) => (
        <div key={section.title} className='flex flex-col gap-5'>
          <Typography variant='description'>{section.title}</Typography>
          <ul className='flex flex-col gap-5'>
            {section.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className='text-foreground/60 hover:text-foreground transition-colors'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
