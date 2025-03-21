import { AnchorHTMLAttributes, memo } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  url: keyof typeof getURL;
  children: React.ReactNode | string;
}

const getURL = {
  github: 'https://github.com/MehdiMstv/kozegaav-extension',
  MehdiMstv: 'https://x.com/MehdiMstv',
  snappHome: 'https://snapp.ir',
  snappPWA: 'https://app.snapp.taxi',
} as const;

const Link = ({ children, url, ...rest }: Props) => {
  return (
    <a rel="noopener noreferrer" href={getURL[url]} target="_blank" {...rest}>
      {children}
    </a>
  );
};

export default memo(Link);
