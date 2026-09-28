import Image from 'next/image';

export default function PartnershipWorkflow() {
  return (
    <figure className='partnership-visual'>
      <Image
        src='/images/partnership/partnership-ribbons.webp'
        width={1254}
        height={1254}
        sizes='(max-width: 767px) 280px, (max-width: 1199px) 40vw, 520px'
        priority
        alt='Graphite and lime ribbons weaving together, representing design and engineering in collaboration.'
      />
    </figure>
  );
}
