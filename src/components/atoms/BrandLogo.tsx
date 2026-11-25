import { cn } from '@/lib/utils';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 select-none', className)}>
      <svg
        width={compact ? 22 : 66}
        height={20}
        viewBox={compact ? '0 0 22 20' : '0 0 74 20'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Kaza"
      >
        {/* Stylized K */}
        <path
          d="M2.5 4.2V15.8M12.5 4.2L4.2 10L13 15.8"
          stroke="#18181B"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {!compact && (
          <>
            {/* A */}
            <path
              d="M19 15.8L24.2 4.2L29.4 15.8M20.8 12.2H27.6"
              stroke="#18181B"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Z */}
            <path
              d="M34.5 4.4H45.2L35 15.6H45.8"
              stroke="#18181B"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* A */}
            <path
              d="M51 15.8L56.2 4.2L61.4 15.8M52.8 12.2H59.6"
              stroke="#18181B"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}
