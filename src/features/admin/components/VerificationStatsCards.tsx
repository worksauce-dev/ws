interface VerificationStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const VerificationStatsCards = ({
  stats,
}: VerificationStatsCardsProps) => {
  const cards = [
    {
      label: "총 신청",
      value: stats.total,
      bgColor: "bg-white",
      borderColor: "border-neutral-200",
      textColor: "text-neutral-600",
      valueColor: "text-neutral-900",
    },
    {
      label: "대기 중",
      value: stats.pending,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      valueColor: "text-yellow-900",
    },
    {
      label: "승인",
      value: stats.approved,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      valueColor: "text-green-900",
    },
    {
      label: "거부",
      value: stats.rejected,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      valueColor: "text-red-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4`}
        >
          <p className={`text-sm ${card.textColor}`}>{card.label}</p>
          <p className={`text-2xl font-bold ${card.valueColor} mt-1`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};
