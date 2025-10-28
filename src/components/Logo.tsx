import { FC } from 'react';

type LogoProps = {
  className?: string;
  isLink?: boolean;
  spanClassName?: string;
};

const Logo: FC<LogoProps> = ({
  className = '',
  spanClassName = '',
  isLink = false,
}) => {
  return isLink ? (
    <a
      href="/"
      className={`font-bold font-merriweather text-main ${className}`}
    >
      Cholesterin<span className={`text-main3 ${spanClassName}`}>Tipps</span>
    </a>
  ) : (
    <p className={`font-bold font-merriweather text-main ${className}`}>
      Cholesterin<span className={`text-main3 ${spanClassName}`}>Tipps</span>
    </p>
  );
};

export default Logo;
