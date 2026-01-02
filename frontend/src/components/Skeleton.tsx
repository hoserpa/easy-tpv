interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export default function Skeleton({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full', 
  variant = 'rectangular' 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-600 rounded';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${height} ${width} ${className}`}
      role="presentation"
      aria-label="Cargando..."
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 3 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4 p-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              height="h-8" 
              width={colIndex === 0 ? 'w-48' : 'w-24'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ height = 'h-24' }: { height?: string }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
      <Skeleton height="h-6" width="w-3/4" className="mb-3" />
      <Skeleton height={height} />
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          <Skeleton variant="circular" height="h-10" width="w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton height="h-4" width="w-3/4" />
            <Skeleton height="h-3" width="w-1/2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton height="h-8" width="w-20" />
            <Skeleton height="h-8" width="w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}