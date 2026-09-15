/**
 * UI Card Components.
 * Styled with slate-900 surface, rounded-xl borders, soft shadows,
 * and optional framer-motion stagger child animations.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const cardMotionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-md transition-all',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const MotionCard = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    variants={cardMotionVariants}
    initial="hidden"
    animate="visible"
    className={cn(
      'rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-md transition-all',
      className
    )}
    {...props}
  />
));
MotionCard.displayName = 'MotionCard';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-slate-400 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0 border-t border-slate-800/60 mt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export default Card;
