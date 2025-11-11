import { VERB_POOL, ALL_VERBS } from "../constants/verbTest";
import type {
  WorkTypeCode,
  VerbCategory,
  WorkGroup,
  Verb,
} from "../types/verbTest.types";
import { WORK_TYPE_INFO, WORK_TYPE_GROUPS } from "../constants/verbTest";

/**
 * 특정 category의 모든 동사 가져오기
 * @example getVerbsByCategory('start') // 10개 start 동사
 */
export function getVerbsByCategory(category: VerbCategory): Verb[] {
  return ALL_VERBS.filter(verb => verb.category === category);
}

/**
 * 특정 WorkType들의 특정 category 동사 가져오기
 * @example getVerbsByTypesAndCategory(['SE', 'SA', 'AS', 'AF'], 'advance') // 8개
 */
export function getVerbsByTypesAndCategory(
  types: WorkTypeCode[],
  category: VerbCategory
): Verb[] {
  return types
    .flatMap(type => VERB_POOL[type])
    .filter(verb => verb.category === category);
}

/**
 * 대분류(Group)에 속한 모든 타입 가져오기
 * @example getTypesByGroup('S') // ['SE', 'SA']
 */
export function getTypesByGroup(group: WorkGroup): WorkTypeCode[] {
  return WORK_TYPE_GROUPS[group];
}

/**
 * 선택한 타입들이 속한 대분류들 가져오기
 * @example getGroupsFromTypes(['SE', 'AS']) // ['S', 'A']
 */
export function getGroupsFromTypes(types: WorkTypeCode[]): WorkGroup[] {
  return Array.from(new Set(types.map(type => WORK_TYPE_INFO[type].group)));
}

/**
 * 선택한 타입들의 대분류에 속한 모든 관련 타입들 가져오기
 * @example getRelatedTypes(['SE', 'AS']) // ['SE', 'SA', 'AS', 'AF']
 * @example getRelatedTypes(['SE', 'SA']) // ['SE', 'SA'] (같은 그룹)
 */
export function getRelatedTypes(selectedTypes: WorkTypeCode[]): WorkTypeCode[] {
  // 1. 선택된 타입들의 대분류 추출
  const groups = getGroupsFromTypes(selectedTypes);

  // 2. 각 대분류에 속한 모든 타입들 추출
  const relatedTypes = groups.flatMap(group => getTypesByGroup(group));

  // 3. 중복 제거 및 반환
  return Array.from(new Set(relatedTypes));
}

/**
 * 동사 ID로 동사 객체 찾기
 * @example getVerbById('SE-1') // { id: 'SE-1', text: '인식하다', ... }
 */
export function getVerbById(verbId: string): Verb | undefined {
  return ALL_VERBS.find(verb => verb.id === verbId);
}

/**
 * 동사 ID들로 WorkType 코드들 추출
 * @example getWorkTypesFromVerbIds(['SE-1', 'AS-1']) // ['SE', 'AS']
 */
export function getWorkTypesFromVerbIds(verbIds: string[]): WorkTypeCode[] {
  return verbIds
    .map(id => getVerbById(id))
    .filter((verb): verb is Verb => verb !== undefined)
    .map(verb => verb.workType);
}

/**
 * WorkType 코드로 한글 이름 가져오기
 * @example getWorkTypeName('SE') // '기준윤리'
 */
export function getWorkTypeName(code: WorkTypeCode): string {
  return WORK_TYPE_INFO[code].name;
}

/**
 * WorkType 코드로 전체 표시명 가져오기
 * @example getWorkTypeDisplayName('SE') // '기준윤리형'
 */
export function getWorkTypeDisplayName(code: WorkTypeCode): string {
  return `${WORK_TYPE_INFO[code].name}형`;
}
