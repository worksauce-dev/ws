import { useAuth } from "@/shared/contexts/useAuth";

export const ProfileSection = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">
          프로필 정보
        </h2>
        <p className="text-sm text-neutral-600">
          개인 정보를 관리하고 업데이트하세요
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            이름
          </label>
          <input
            type="text"
            value={user?.user_metadata?.name || ""}
            readOnly
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-800"
          />
        </div>

        <div className="pt-4">
          <button
            disabled
            className="px-6 py-3 bg-neutral-100 text-neutral-400 rounded-lg cursor-not-allowed"
          >
            프로필 수정 (준비 중)
          </button>
        </div>
      </div>
    </div>
  );
};
