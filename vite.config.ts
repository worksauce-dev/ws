import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/features": path.resolve(__dirname, "./src/features"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // 경고 임계값을 1000KB로 증가
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules 라이브러리들을 개별 청크로 분리
          if (id.includes("node_modules")) {
            // React 관련 라이브러리
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            // Supabase
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // React Router
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            // React Query
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            // React Hook Form & Zod (폼 관련)
            if (id.includes("react-hook-form") || id.includes("zod")) {
              return "vendor-forms";
            }
            // Framer Motion (애니메이션)
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            // React Icons
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            // Headless UI
            if (id.includes("@headlessui")) {
              return "vendor-headlessui";
            }
            // 나머지 node_modules
            return "vendor-misc";
          }

          // Feature 별로 청크 분리 (lazy loading과 함께 사용)
          if (id.includes("/features/dashboard/")) {
            return "feature-dashboard";
          }
          if (id.includes("/features/groups/")) {
            return "feature-groups";
          }
          if (id.includes("/features/auth/")) {
            return "feature-auth";
          }
          if (id.includes("/features/landing/")) {
            return "feature-landing";
          }
        },
      },
    },
  },
});
