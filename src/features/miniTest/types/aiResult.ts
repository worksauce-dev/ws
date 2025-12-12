/**
 * minitest_answers 테이블의 타입 정의
 */
export interface AIResult {
  created_at: string;
  type_name: string;
  keywords: string[];
  one_liner: string;
  type_description: string[];
  strengths: string[];
  example_characters: {
    name: string;
    context: string;
  }[];
  advice: string[];
  summary_card: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  specific_behaviors: string[];
}
