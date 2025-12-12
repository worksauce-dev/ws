import { useState } from "react";
import { verbQuestions } from "../const/miniTestData";

type VerbQuestionKey = "first" | "second" | "third" | "fourth" | "fifth";

export const useVerbTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);

  const totalQuestions = 5;
  const questionKeys: VerbQuestionKey[] = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
  ];

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== optionIndex));
    } else if (selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, optionIndex]);
    }
  };

  const handleNext = (onComplete: () => void) => {
    if (selectedOptions.length !== 2) return;

    if (currentQuestion === 1) {
      const sorts = selectedOptions.map(
        opt => verbQuestions.first.options[opt].sort
      );
      setSelectedSorts(sorts);
    }

    const newAnswers = [...answers, ...selectedOptions];
    setAnswers(newAnswers);
    setSelectedOptions([]);

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(1);
      setAnswers(newAnswers);
      onComplete();
    }
  };

  const getFilteredOptions = (questionKey: VerbQuestionKey) => {
    if (currentQuestion === 1) {
      return verbQuestions[questionKey].options;
    }
    return verbQuestions[questionKey].options.filter(option =>
      selectedSorts.includes(option.sort)
    );
  };

  const reset = () => {
    setCurrentQuestion(1);
    setAnswers([]);
    setSelectedOptions([]);
    setSelectedSorts([]);
  };

  return {
    currentQuestion,
    totalQuestions,
    answers,
    selectedOptions,
    questionKeys,
    handleSelectOption,
    handleNext,
    getFilteredOptions,
    reset,
  };
};
