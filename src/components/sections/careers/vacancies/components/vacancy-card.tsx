import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { VacancyDialog } from '@/components/vacancy-dialog';

interface VacancyCardProps {
  badge: string;
  title: string;
  description: string;
}

const MOCK_ROLE_DESCRIPTION =
  "You're a seasoned Client Services professional who thrives at the intersection of relationships, process, and creative excellence. With a knack for building trust and a meticulous eye for detail, you guide clients and teams through every stage of the branding journey. You balance the big picture with the small details, always to deliver work that is not only exceptional but impactful.";

const MOCK_RESPONSIBILITIES = (
  <ol className='marker:text-foreground/50 list-decimal space-y-4 pl-8 text-[20px] md:text-[24px]'>
    <li>
      Lead & Deliver Exceptional Work. Manage multiple branding projects, balancing scope, budget, and timelines without compromising
      quality. You move effortlessly between fast-paced startups and more complex, established organizations.
    </li>
    <li>
      Shape the Client Experience. Build strong, long-term relationships with clients, serving as their go-to partner. You advocate for both
      the client and the agency, ensuring successful outcomes.
    </li>
    <li>
      Strategic Guidance. Provide strategic counsel to clients, helping them navigate complex branding challenges and seize new
      opportunities.
    </li>
    <li>
      Team Mentorship. Mentor and guide junior team members, fostering a culture of continuous learning and professional growth within the
      Client Services team.
    </li>
    <li>Business Development. Identify and pursue new business opportunities, contributing to the agency&apos;s growth and expansion.</li>
    <li>
      Process Optimization. Continuously evaluate and improve internal workflows and processes to maximize efficiency and project
      profitability.
    </li>
    <li>
      Quality Assurance. Ensure all deliverables meet the highest standards of quality and align with the client&apos;s strategic
      objectives.
    </li>
  </ol>
);

export const VacancyCard = ({ badge, title, description }: VacancyCardProps) => {
  return (
    <VacancyDialog title={title} roleDescription={MOCK_ROLE_DESCRIPTION} responsibilities={MOCK_RESPONSIBILITIES}>
      <button className='group bg-muted relative flex h-auto min-h-77.75 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg p-4 text-left md:min-h-93.75 md:p-8'>
        <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
          <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
        </div>

        <div className='absolute top-8 right-8 z-10'>
          <Button variant='icon' size='icon-md' className='pointer-events-none rounded-full' asChild>
            <span>
              <Icon icon='ArrowUpRight' width={23} height={23} />
            </span>
          </Button>
        </div>

        <div className='bg-foreground-secondary/4 relative z-10 w-fit rounded-sm px-3.5 py-[12.5px]'>
          <Typography variant='h6' className='font-medium md:font-normal'>
            {badge}
          </Typography>
        </div>

        <div className='relative z-10 space-y-4.25'>
          <Typography variant='h4' className='text-[24px] leading-[1.24] font-medium'>
            {title}
          </Typography>
          <Typography variant='body3' className='text-foreground-secondary'>
            {description}
          </Typography>
        </div>
      </button>
    </VacancyDialog>
  );
};
