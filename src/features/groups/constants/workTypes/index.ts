import type { WorkTypeCode, WorkTypeData } from "../../types/workType.types";
import SE_DATA from "./SE_DATA";
import SA_DATA from "./SA_DATA";
import AS_DATA from "./AS_DATA";
import AF_DATA from "./AF_DATA";
import UM_DATA from "./UM_DATA";
import UR_DATA from "./UR_DATA";
import CA_DATA from "./CA_DATA";
import CH_DATA from "./CH_DATA";
import EE_DATA from "./EE_DATA";
import EG_DATA from "./EG_DATA";

export const WORK_TYPE_DATA: Record<WorkTypeCode, WorkTypeData> = {
  SE: SE_DATA, // 기준윤리형
  SA: SA_DATA, // 기준심미형
  AS: AS_DATA, // 예술느낌형
  AF: AF_DATA, // 예술융합형
  UM: UM_DATA, // 이해관리형
  UR: UR_DATA, // 이해연구형
  CA: CA_DATA, // 소통도움형
  CH: CH_DATA, // 소통조화형
  EE: EE_DATA, // 도전확장형
  EG: EG_DATA, // 도전목표형
};

export default WORK_TYPE_DATA;
