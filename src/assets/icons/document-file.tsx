import { IconCommonProps } from '@/components/ui/icon';

export interface DocumentFileProps extends IconCommonProps {
  extension?: string;
}

export const DocumentFile = ({ extension = 'file', ...style }: DocumentFileProps) => {
  const ext = extension.toLowerCase().replace('.', '');

  // Truncate to 4 chars max
  const text = ext.slice(0, 4).toUpperCase();

  let color = '#7A7A7A'; // Default Gray
  const badgeWidth = text.length > 3 ? 24 : 17.5;

  if (['pdf'].includes(ext))
    color = '#CB1111'; // Red
  else if (['doc', 'docx', 'txt', 'rtf'].includes(ext))
    color = '#2B579A'; // Blue
  else if (['xls', 'xlsx', 'csv'].includes(ext))
    color = '#217346'; // Green
  else if (['ppt', 'pptx'].includes(ext))
    color = '#B7472A'; // Orange/Red
  else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
    color = '#8A2BE2'; // Purple
  else if (['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(ext))
    color = '#00A2BB'; // Teal
  else if (['mp3', 'wav', 'ogg', 'mp4', 'mov', 'avi'].includes(ext)) color = '#FF1493'; // Pink

  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={style.style}
      className={style.className}
    >
      <g clipPath='url(#clip0_doc)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.1613 2.5C15.9069 2.50066 16.6218 2.7974 17.1488 3.325L24.1763 10.35C24.7038 10.8775 25 11.5925 25 12.3388V24.375C25 25.2038 24.6708 25.9987 24.0847 26.5847C23.4987 27.1708 22.7038 27.5 21.875 27.5L21.25 27.5L19.1625 27.5H8.125C7.2962 27.5 6.50134 27.1708 5.91529 26.5847C5.32924 25.9987 5 25.2038 5 24.375L5 17.5L5 12.5L5 5.625C5 4.7962 5.32924 4.00134 5.91529 3.41529C6.50134 2.82924 7.2962 2.5 8.125 2.5H15.1613ZM21.25 25.625H19.375H8.125C7.79348 25.625 7.47554 25.4933 7.24112 25.2589C7.0067 25.0245 6.875 24.7065 6.875 24.375L6.875 12.5L6.875 17.5V5.625C6.875 5.29348 7.0067 4.97554 7.24112 4.74112C7.47554 4.5067 7.79348 4.375 8.125 4.375H15V10C15 10.663 15.2634 11.2989 15.7322 11.7678C16.2011 12.2366 16.837 12.5 17.5 12.5H23.125V24.375C23.125 24.7065 22.9933 25.0245 22.7589 25.2589C22.5245 25.4933 22.2065 25.625 21.875 25.625H21.25ZM17.0581 10.4419C16.9409 10.3247 16.875 10.1658 16.875 10V5.7L21.8 10.625H17.5C17.3342 10.625 17.1753 10.5592 17.0581 10.4419Z'
          fill='#1B1C23'
          fillOpacity='0.3'
        />
        <rect y='15' width={badgeWidth} height='9.49' rx='1.67' fill={color} />
        <text
          x={badgeWidth / 2}
          y='22'
          fill='white'
          fontSize={text.length > 3 ? '5' : '6.5'}
          fontWeight='800'
          fontFamily='sans-serif'
          textAnchor='middle'
        >
          {text}
        </text>
      </g>
      <defs>
        <clipPath id='clip0_doc'>
          <rect width='30' height='30' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
};
