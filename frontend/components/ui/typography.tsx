// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { PropsWithoutRef, RefAttributes } from 'react';
import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  as?: keyof JSX.IntrinsicElements;
  blockquote?: boolean;
  children?: React.ReactNode;

  className?: string;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  large?: boolean;
  lead?: boolean;
  muted?: boolean;
  small?: boolean;
}

const defaultProps = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  blockquote: false,
  lead: false,
  large: false,
  small: false,
  muted: false
};

const typographyVariants = cva('', {
  variants: {
    size: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      p: 'leading-7'
    }
  },
  defaultVariants: {
    size: 'p'
  }
});

type ElementMap = { [key in keyof JSX.IntrinsicElements]?: boolean };
type TextRenderableElements = Array<keyof JSX.IntrinsicElements>;

export type HTMLTypographyElement = HTMLHeadingElement | HTMLParagraphElement;

type NativeAttrs = Omit<React.HTMLAttributes<HTMLTypographyElement>, keyof Props>;
export type TypographyProps = Props &
  NativeAttrs &
  typeof defaultProps &
  VariantProps<typeof typographyVariants>;

// eslint-disable-next-line react/no-forward-ref
const Typography = React.forwardRef<HTMLTypographyElement, TypographyProps>(
  (
    { className, as, children, h1, h2, h3, h4, blockquote, lead, large, small, muted, ...props },
    ref
  ) => {
    const elements: ElementMap = { h1, h2, h3, h4, blockquote };
    const sizesMap = { lead, large, small, muted };

    const names = Object.keys(elements).filter(
      (name) => elements[name as keyof typeof elements]
    ) as TextRenderableElements;
    const sizes = Object.keys(sizesMap).filter((size) => sizesMap[size as keyof typeof sizesMap]);

    const tag = useMemo(() => {
      if (as) return as;
      if (names[0]) return names[0];
      return 'p';
    }, [names, as]);

    const resolveSize = (): string => {
      return names[0] ? names[0] : sizes[0] ? sizes[0] : 'p';
    };

    return React.createElement(
      tag,
      {
        className: cn(typographyVariants({ size: resolveSize(), className })),
        ref,
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';
Typography.defaultProps = defaultProps;

type ComponentProps = Omit<Props, keyof typeof defaultProps> & Partial<typeof defaultProps>;
type TypographyComponent = React.ForwardRefExoticComponent<
  PropsWithoutRef<ComponentProps> & RefAttributes<HTMLElement>
>;

const MemoTypographyComponent = Typography as TypographyComponent;

export { MemoTypographyComponent as Typography };
