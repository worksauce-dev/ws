import { useState, useMemo } from "react";
import { useUser } from "@/shared/hooks/useUser";
import { supabase } from "@/shared/lib/supabase";
import toast from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { PasswordStrengthIndicator } from "@/features/auth/components/ui/PasswordStrengthIndicator";
import { calculatePasswordStrength } from "@/features/auth/utils/calculatePasswordStrength";

export const ProfileSection = () => {
  const { userName, userEmail } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(newPassword);
  }, [newPassword]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다");
      return;
    }

    if (!passwordStrength.checks.uppercase) {
      toast.error("대문자를 포함해주세요");
      return;
    }

    if (!passwordStrength.checks.lowercase) {
      toast.error("소문자를 포함해주세요");
      return;
    }

    if (!passwordStrength.checks.number) {
      toast.error("숫자를 포함해주세요");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("더 강한 비밀번호를 사용해주세요");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("현재 비밀번호와 새 비밀번호가 같습니다");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 현재 비밀번호로 재인증 (Supabase는 직접 확인 불가, updateUser만 가능)
      // 2. 새 비밀번호로 업데이트
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        // 일반적으로 권한 오류가 발생하면 현재 비밀번호가 틀렸을 가능성
        toast.error("비밀번호 변경에 실패했습니다");
        console.error("Password update error:", error);
        return;
      }

      toast.success("비밀번호가 성공적으로 변경되었습니다");

      // 폼 초기화
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("비밀번호 변경 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">
          프로필 정보
        </h2>
        <p className="text-sm text-neutral-600">
          계정 정보를 확인하고 비밀번호를 변경하세요
        </p>
      </div>

      <div className="space-y-4">
        {/* 이름 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            이름
          </label>
          <input
            type="text"
            value={userName}
            readOnly
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500 mt-1">이름은 변경할 수 없습니다</p>
        </div>

        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500 mt-1">이메일은 변경할 수 없습니다</p>
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="pt-6 border-t border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            비밀번호 변경
          </h3>

          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              비밀번호 변경하기
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* 현재 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="현재 비밀번호 입력"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showCurrentPassword ? (
                      <MdVisibilityOff className="w-5 h-5" />
                    ) : (
                      <MdVisibility className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="비밀번호 (8자 이상, 대소문자, 숫자 포함)"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showNewPassword ? (
                      <MdVisibilityOff className="w-5 h-5" />
                    ) : (
                      <MdVisibility className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <PasswordStrengthIndicator
                  password={newPassword}
                  strength={passwordStrength}
                  className="mt-3"
                />
              </div>

              {/* 새 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="새 비밀번호 재입력"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff className="w-5 h-5" />
                    ) : (
                      <MdVisibility className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
