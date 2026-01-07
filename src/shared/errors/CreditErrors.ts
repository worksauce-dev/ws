/**
 * 크레딧 관련 에러 클래스
 */

/**
 * 크레딧 부족 에러
 * deductCredits 함수에서 잔액이 부족할 때 발생
 */
export class InsufficientCreditsError extends Error {
  readonly required: number;
  readonly available: number;

  constructor(required: number, available: number) {
    super(
      `크레딧이 부족합니다. 필요: ${required}, 보유: ${available}`
    );
    this.name = "InsufficientCreditsError";
    this.required = required;
    this.available = available;

    // TypeScript에서 Error 상속 시 필요한 설정
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}
