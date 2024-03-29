import type { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  fontFamily: {
    primary: 'Roboto, sans-serif',
    mono: '"Roboto Mono", monospace',
  },
  animation: {
    duration: '200ms',
    timingFunction: 'ease-in-out',
  },
  transition: {
    duration: '200ms',
    timingFunction: 'ease-in-out',
  },
  fontSizes: {
    xxxs: '10px',
    xxs: '12px',
    xs: '14px',
    s: '16px',
    m: '20px',
    l: '24px',
    xl: '32px',
    xxl: '40px',
    xxxl: '48px',
  },
  lineHeights: {
    xs: '0.5',
    m: '1',
    l: '1.5',
  },
  colors: {
    accentColor: '#007AFFFF',
    white: 'var(--color-white)',
    black: 'var(--color-black)',
    blue: 'var(--color-blue)',
    brown: 'var(--color-brown)',
    gray: 'var(--color-gray)',
    green: 'var(--color-green)',
    orange: 'var(--color-orange)',
    pink: 'var(--color-pink)',
    purple: 'var(--color-purple)',
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    darkGray: '#242424',
    softGray: '#3b3b3b',
    midGray: '#484848',
    lightGray: '#858585',
    violet: '#6400ff',
  },
  spacing: {
    xxxs: '2px',
    xxs: '4px',
    xs: '6px',
    s: '8px',
    m: '12px',
    l: '16px',
    xl: '24px',
    xxl: '28px',
    xxxl: '32px',
  },
  borderRadius: {
    xxxs: '2px',
    xxs: '4px',
    xs: '6px',
    s: '8px',
    m: '12px',
    l: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },
};
