import { MdChevronRight } from "react-icons/md";

export const SecuritySection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">보안 설정</h2>
        <p className="text-sm text-neutral-600">계정 보안을 강화하세요</p>
      </div>

      <div className="space-y-4">
        <button
          disabled
          className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-neutral-800">비밀번호 변경</p>
            <p className="text-sm text-neutral-600 mt-1">
              정기적으로 비밀번호를 변경하세요
            </p>
          </div>
          <MdChevronRight className="w-5 h-5 text-neutral-400" />
        </button>

        <button
          disabled
          className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-neutral-800">2단계 인증</p>
            <p className="text-sm text-neutral-600 mt-1">
              추가 보안 계층 활성화
            </p>
          </div>
          <MdChevronRight className="w-5 h-5 text-neutral-400" />
        </button>

        <div className="pt-4 text-sm text-neutral-500">
          * 보안 기능은 곧 제공될 예정입니다
        </div>
      </div>
    </div>
  );
};
