import { Inter, League_Spartan } from 'next/font/google';

export const fontDisplay = League_Spartan({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display'
});

export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body'
});
