import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";

// 회사 정보 상수화
const COMPANY_INFO = {
  name: "워크소스",
  ceo: "나요한",
  businessNumber: "123-45-67890", // 실제 사업자번호로 변경 필요
  email: "worksauce.info@gmail.com",
  linkedIn:
    "https://www.linkedin.com/company/%EC%9B%8C%ED%81%AC%EC%86%8C%EC%8A%A4/",
} as const;

// 푸터 링크 데이터
const FOOTER_SECTIONS = [
  {
    title: "서비스",
    links: [
      {
        label: "직무실행유형 진단도구 : 소스테스트",
        href: "https://worksauce.gitbook.io/infomation/test/sauce",
        external: true,
      },
      {
        label: "직무스트레스 진단도구 : 슈가테스트",
        href: "https://worksauce.gitbook.io/infomation/test/sauce-1",
        external: true,
      },
    ],
  },
  {
    title: "회사",
    links: [
      {
        label: "비전과 미션",
        href: "https://worksauce.gitbook.io/infomation/about/worksauce/vam",
        external: true,
      },
      {
        label: "팀 소개",
        href: "https://worksauce.gitbook.io/infomation/about/worksauce/people",
        external: true,
      },
    ],
  },
  {
    title: "리소스",
    links: [
      {
        label: "도움말 센터",
        href: "https://worksauce.gitbook.io/infomation",
        external: true,
      },
    ],
  },
  {
    title: "법적 정보",
    links: [
      {
        label: "이용약관",
        href: "https://worksauce.gitbook.io/infomation/service/terms-and-conditions",
        external: true,
      },
      {
        label: "개인정보 취급방침",
        href: "https://worksauce.gitbook.io/infomation/service/privacy-policy",
        external: true,
      },
    ],
  },
] as const;

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  delay?: number;
  external?: boolean;
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.3 }, // duration-base 적용
};

const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

const FooterLink = ({
  href,
  children,
  delay = 0,
  external = false,
}: FooterLinkProps) => {
  const linkContent = (
    <span className="text-neutral-600 hover:text-primary-500 transition-colors duration-base text-sm">
      {children}
    </span>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {linkContent}
        </a>
      ) : (
        <Link to={href} className="block">
          {linkContent}
        </Link>
      )}
    </motion.li>
  );
};

export const LandingFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-neutral-50 w-full px-6 lg:px-8 py-16 snap-start">
      <div className="container mx-auto">
        {/* 상단 섹션: 제목 및 CTA 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <motion.div {...fadeInUp} className="mb-6 md:mb-0">
            <div className="flex items-center mb-3">
              <h3 className="heading-3 text-primary-500 font-bold">
                WORKSAUCE
              </h3>
            </div>
            <p className="text-neutral-600 max-w-md border-l-4 border-primary-500 pl-4 body-base">
              인재 선발부터 조직 성장까지, 데이터 기반 HR 솔루션
            </p>
          </motion.div>

          <div className="hidden md:flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <motion.div {...buttonHover}>
              <Link
                to="/auth/signup"
                className="btn-primary px-6 py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 group"
              >
                무료 체험
                <MdArrowForward className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* 푸터 링크 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {FOOTER_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h4 className="label text-neutral-800 mb-4 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <FooterLink
                    key={link.href}
                    href={link.href}
                    external={link.external}
                    delay={linkIndex * 0.05}
                  >
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 하단 정보 */}
        <motion.div
          className="border-t border-neutral-200 pt-6 sm:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4 sm:gap-6">
            {/* <div className="flex flex-col items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <p className="caption text-neutral-500">
                  <span className="font-medium">{COMPANY_INFO.name}</span> |
                  대표: {COMPANY_INFO.ceo} | 사업자번호:{" "}
                  {COMPANY_INFO.businessNumber}
                </p>
                <p className="caption text-neutral-500">
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </p>
              </div>
            </div> */}

            <div className="flex space-x-3 mt-3 sm:mt-0">
              <motion.a
                href={COMPANY_INFO.linkedIn}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn 페이지 방문"
              >
                <FaLinkedin size={14} className="sm:text-base" />
              </motion.a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="caption text-neutral-400 mb-2 sm:mb-0">
              Copyright &copy; 2025 {COMPANY_INFO.name} All rights reserved
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
              {FOOTER_SECTIONS[3].links.map((link, index) => (
                <span
                  key={link.href}
                  className="flex items-center gap-2 sm:gap-4"
                >
                  {index > 0 && (
                    <span className="text-neutral-300 hidden sm:inline">|</span>
                  )}
                  <a
                    href={link.href}
                    className="caption text-neutral-400 hover:text-primary-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
