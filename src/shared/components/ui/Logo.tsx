import { Link } from "react-router-dom";
import { clsx } from "clsx";

const LOGO_IMAGES = {
  main: "/images/로고시안1.png",
  header: "/images/로고시안.png",
  mobile: "/images/모바일로고.png",
} as const;

interface LogoProps {
  className?: string;
  linkTo?: string;
  variant?: "main" | "header";
}

export const Logo = ({
  className,
  linkTo = "/",
  variant = "main",
}: LogoProps) => {
  const logoSrc = variant === "main" ? LOGO_IMAGES.main : LOGO_IMAGES.header;

  return (
    <Link
      to={linkTo}
      className={clsx(
        "inline-flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        "transition-transform duration-base",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded",
        className
      )}
    >
      {variant === "header" ? (
        <>
          {/* 데스크톱 로고 */}
          <img
            src={LOGO_IMAGES.header}
            alt="워크소스 로고"
            className="h-8 w-auto hidden sm:block"
            loading="lazy"
          />
          {/* 모바일 로고 */}
          <img
            src={LOGO_IMAGES.mobile}
            alt="워크소스"
            className="w-6 h-6 block sm:hidden"
            loading="lazy"
          />
        </>
      ) : (
        <img
          src={logoSrc}
          alt="워크소스 로고"
          className="w-32 sm:w-48 h-auto" // 디자인 시스템 값 사용
          loading="lazy"
        />
      )}
    </Link>
  );
};
