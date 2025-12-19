import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createBusinessVerification,
  getLatestBusinessVerification,
  uploadBusinessDocument,
} from "../api/businessApi";
import type {
  BusinessVerificationFormData,
  CreateBusinessVerificationPayload,
} from "../types/business.types";

/**
 * 기업 인증 상태 조회 훅
 */
export const useBusinessVerificationStatus = () => {
  return useQuery({
    queryKey: ["business-verification", "latest"],
    queryFn: async () => {
      const { data, error } = await getLatestBusinessVerification();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

/**
 * 기업 인증 신청 훅
 */
export const useCreateBusinessVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: BusinessVerificationFormData) => {
      // 1. 파일 업로드
      const {
        data: { user },
      } = await import("@/shared/lib/supabase").then(m =>
        m.supabase.auth.getUser()
      );

      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (
        !formData.business_registration_doc ||
        !formData.employment_certificate
      ) {
        throw new Error("필수 서류를 모두 업로드해주세요.");
      }

      // 사업자등록증 업로드
      const businessRegResult = await uploadBusinessDocument(
        formData.business_registration_doc,
        user.id,
        "business_registration"
      );

      if (businessRegResult.error || !businessRegResult.url) {
        throw new Error(
          businessRegResult.error || "사업자등록증 업로드에 실패했습니다."
        );
      }

      // 재직증명서 업로드
      const employmentCertResult = await uploadBusinessDocument(
        formData.employment_certificate,
        user.id,
        "employment_certificate"
      );

      if (employmentCertResult.error || !employmentCertResult.url) {
        throw new Error(
          employmentCertResult.error || "재직증명서 업로드에 실패했습니다."
        );
      }

      // 2. 기업 인증 신청 생성
      const payload: CreateBusinessVerificationPayload = {
        company_name: formData.company_name,
        business_number: formData.business_number,
        ceo_name: formData.ceo_name,
        manager_name: formData.manager_name,
        manager_email: formData.manager_email,
        business_registration_doc_url: businessRegResult.url,
        employment_certificate_url: employmentCertResult.url,
      };

      const { data, error } = await createBusinessVerification(payload);

      if (error) {
        throw new Error(error);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("기업 인증 신청이 완료되었습니다. 승인까지 1-3 영업일이 소요됩니다.");
      // 쿼리 무효화하여 최신 상태 갱신
      queryClient.invalidateQueries({
        queryKey: ["business-verification"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "기업 인증 신청에 실패했습니다.");
    },
  });
};
