// 메뉴 아이템 타입
export interface MenuItem {
  href: string;
  label: string;
  isExternal?: boolean;
}

// 메뉴 링크 컴포넌트 Props
export interface MenuLinkProps {
  item: MenuItem;
  isMobile: boolean;
  onClose: () => void;
}

// 모바일 메뉴 Props
export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}
