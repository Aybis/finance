import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClass =
    size === 'sm' ? 'h-7 w-7 text-[10px]' : size === 'lg' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#EAEAEF] bg-gradient-to-br from-[#F4EDE2] via-[#DFD5C6] to-[#B7ACA0] font-semibold text-[#18181B] shadow-2xs select-none',
        sizeClass,
        className
      )}
      aria-label={name}
    >
      {/* Crisp stylized portrait silhouette */}
      <svg
        viewBox="0 0 40 40"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="avatarBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ECE7DF" />
            <stop offset="100%" stopColor="#D3CBC0" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" fill="url(#avatarBg)" />
        <circle cx="20" cy="15.5" r="6.5" fill="#27272A" />
        <path
          d="M8.5 36.5C10.2 29.2 14.6 25.5 20 25.5C25.4 25.5 29.8 29.2 31.5 36.5"
          fill="#27272A"
        />
      </svg>
      <span className="sr-only">{initials}</span>
    </div>
  );
}
