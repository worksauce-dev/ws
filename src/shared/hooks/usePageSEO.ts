import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonical?: string;
  noindex?: boolean;
}

// 기본 SEO 설정 (워크소스 프로젝트용)
const DEFAULT_SEO: Partial<SEOConfig> = {
  ogImage: "/images/og/default.png",
  twitterCard: "OG_orangebg.png",
  canonical: "https://worksauce.kr",
};

export const usePageSEO = (config: SEOConfig) => {
  useEffect(() => {
    const finalConfig = { ...DEFAULT_SEO, ...config };

    // 기본 메타태그 설정
    document.title = finalConfig.title;

    updateMetaTag("name", "description", finalConfig.description);

    if (finalConfig.keywords) {
      updateMetaTag("name", "keywords", finalConfig.keywords);
    }

    // Open Graph 태그
    updateMetaTag(
      "property",
      "og:title",
      finalConfig.ogTitle || finalConfig.title
    );
    updateMetaTag(
      "property",
      "og:description",
      finalConfig.ogDescription || finalConfig.description
    );
    updateMetaTag("property", "og:image", finalConfig.ogImage!);
    updateMetaTag("property", "og:url", finalConfig.canonical!);

    // Twitter Card
    updateMetaTag("name", "twitter:card", finalConfig.twitterCard!);
    updateMetaTag(
      "name",
      "twitter:title",
      finalConfig.ogTitle || finalConfig.title
    );
    updateMetaTag(
      "name",
      "twitter:description",
      finalConfig.ogDescription || finalConfig.description
    );
    updateMetaTag("name", "twitter:image", finalConfig.ogImage!);

    // Canonical URL
    updateLinkTag("canonical", finalConfig.canonical!);

    // Robots meta tag
    if (finalConfig.noindex) {
      updateMetaTag("name", "robots", "noindex, nofollow");
    } else {
      updateMetaTag("name", "robots", "index, follow");
    }

    // 클린업 함수 (필요시)
    return () => {
      // 컴포넌트 언마운트 시 기본값으로 복원
      document.title = "워크소스 - 스마트 채용 플랫폼";
    };
  }, [config]);
};

// 헬퍼 함수들
const updateMetaTag = (attribute: string, name: string, content: string) => {
  let element = document.querySelector(
    `meta[${attribute}="${name}"]`
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

// 워크소스 전용 SEO 프리셋
export const WORKSAUCE_SEO_PRESETS = {
  landing: {
    title: "워크소스 | 지속가능한 인재 채용 관리",
    description:
      "지원자 직무실행유형 검사 서비스. 검사 이메일 발송, AI 기반 직무적합성 분석, 유형별 면접질문 및 온보딩 가이드 제공.",
    keywords: "워크소스, 직무실행유형, 검사, 채용, 인재, 면접, 온보딩",
  },

  login: {
    title: "로그인 | 워크소스",
    description: "워크소스에 로그인하여 직무실행유형 검사를 시작하세요.",
    noindex: true, // 로그인 페이지는 검색 노출 안함
  },

  signup: {
    title: "회원가입 | 워크소스",
    description: "워크소스 회원가입으로 직무실행유형 검사를 시작하세요.",
    noindex: true,
  },

  dashboard: {
    title: "대시보드 | 워크소스",
    description: "지원자들의 직무실행유형 검사 결과를 확인하고 분석하세요.",
    noindex: true, // 개인정보 포함된 페이지
  },
} as const;
