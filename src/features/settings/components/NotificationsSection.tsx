import { NOTIFICATION_ITEMS } from "../constants/settingsSections";

export const NotificationsSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">알림 설정</h2>
        <p className="text-sm text-neutral-600">받고 싶은 알림을 선택하세요</p>
      </div>

      <div className="space-y-4">
        {NOTIFICATION_ITEMS.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-neutral-800">{item.title}</p>
              <p className="text-sm text-neutral-600 mt-1">
                {item.description}
              </p>
            </div>
            <div className="text-sm text-neutral-400">준비 중</div>
          </div>
        ))}
      </div>
    </div>
  );
};
