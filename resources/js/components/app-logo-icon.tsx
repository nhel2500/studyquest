import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/official_logo.png" // Make sure you put your logo.png in the /public folder
      alt="App Logo"
      width={40}
      height={42}
      {...props}
    />
  );
}
