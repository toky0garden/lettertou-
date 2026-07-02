import Image from 'next/image';

interface FrameCardProps {
  src: string;
  index: number;
  onClick: () => void;
}

export function FrameCard({ src, index, onClick }: FrameCardProps) {
  return (
    <div className='relative flex w-full flex-col'>
      <div className='bg-primary/10 w-full overflow-hidden rounded-sm transition-all duration-300 ease-out select-none hover:brightness-80'>
        <Image
          alt={`Кадр ${index + 1}`}
          className='h-full w-full object-cover object-center transition-transform duration-300 select-none group-hover:scale-105'
          height={720}
          quality={70}
          src={src}
          width={1280}
          decoding='async'
          loading={index === 0 ? 'eager' : 'lazy'}
          priority={index === 0}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
