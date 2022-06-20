import { useMediaQuery } from 'react-responsive';

export function useMobile(): boolean {
  return useMediaQuery({ query: '(max-width: 767px)' });
}
