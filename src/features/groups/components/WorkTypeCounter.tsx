import { MdAdd, MdRemove } from "react-icons/md";
import type { WorkTypeCode } from "../constants/workTypeKeywords";

interface WorkTypeCounterProps {
  workTypeName: string;
  code: WorkTypeCode;
  count: number;
  onChange: (code: WorkTypeCode, newCount: number) => void;
}

export const WorkTypeCounter = ({
  workTypeName,
  code,
  count,
  onChange,
}: WorkTypeCounterProps) => {
  const handleIncrement = () => {
    onChange(code, count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      onChange(code, count - 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors duration-200">
      <span className="text-sm font-medium text-neutral-700">{workTypeName}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={count === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
            count === 0
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:scale-95"
          }`}
          aria-label={`${workTypeName} 감소`}
        >
          <MdRemove className="w-4 h-4" />
        </button>
        <span className="text-base font-semibold text-neutral-800 w-8 text-center">
          {count}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 active:scale-95 transition-all duration-200"
          aria-label={`${workTypeName} 증가`}
        >
          <MdAdd className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
