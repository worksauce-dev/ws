import { useState, useCallback } from "react";
import { miniTestQuestions } from "../const/miniTestData";

export const useMiniTest = (initialVerbScores: Record<string, number>) => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  // 2D array: [typeIndex][questionIndex] = rating (0 = not answered, 1-5 = selected)
  const [miniTestAnswers, setMiniTestAnswers] = useState<number[][]>(() => {
    // Initialize with 10 types, each with 3 questions, all set to 0
    return miniTestQuestions.map(typeBlock =>
      new Array(typeBlock.questions.length).fill(0)
    );
  });

  const isLastType = currentTypeIndex === miniTestQuestions.length - 1;
  const progress = ((currentTypeIndex + 1) / miniTestQuestions.length) * 100;

  // Answer a specific question
  const handleAnswer = useCallback(
    (typeIdx: number, qIdx: number, score: number) => {
      setMiniTestAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[typeIdx] = [...newAnswers[typeIdx]];
        newAnswers[typeIdx][qIdx] = score;
        return newAnswers;
      });
    },
    []
  );

  // Check if current type is complete (all questions answered)
  const isCurrentTypeComplete = useCallback(() => {
    const currentAnswers = miniTestAnswers[currentTypeIndex];
    return currentAnswers.every(answer => answer > 0);
  }, [miniTestAnswers, currentTypeIndex]);

  // Navigate to next type
  const goToNext = useCallback(() => {
    if (!isLastType) {
      setCurrentTypeIndex(prev => prev + 1);
    }
  }, [isLastType]);

  // Navigate to previous type
  const goToPrevious = useCallback(() => {
    if (currentTypeIndex > 0) {
      setCurrentTypeIndex(prev => prev - 1);
    }
  }, [currentTypeIndex]);

  // Calculate final scores (Korean type names)
  const calculateFinalScores = useCallback((): Record<string, number> => {
    const finalScores: Record<string, number> = { ...initialVerbScores };

    // Add mini test scores
    miniTestQuestions.forEach((typeBlock, typeIdx) => {
      const typeName = typeBlock.type;
      let typeScore = 0;

      typeBlock.questions.forEach((question, qIdx) => {
        const rating = miniTestAnswers[typeIdx][qIdx];
        // Apply baseScore weighting
        typeScore += rating * question.baseScore;
      });

      finalScores[typeName] = (finalScores[typeName] || 0) + typeScore;
    });

    return finalScores;
  }, [initialVerbScores, miniTestAnswers]);

  // Get the final type (highest score)
  const getFinalType = useCallback((): string => {
    const scores = calculateFinalScores();
    let maxScore = -1;
    let finalType = "";

    Object.entries(scores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        finalType = type;
      }
    });

    return finalType;
  }, [calculateFinalScores]);

  // Reset
  const reset = useCallback(() => {
    setCurrentTypeIndex(0);
    setMiniTestAnswers(
      miniTestQuestions.map(typeBlock =>
        new Array(typeBlock.questions.length).fill(0)
      )
    );
  }, []);

  return {
    currentTypeIndex,
    miniTestAnswers,
    isLastType,
    progress,
    handleAnswer,
    isCurrentTypeComplete: isCurrentTypeComplete(),
    goToNext,
    goToPrevious,
    calculateFinalScores,
    getFinalType,
    reset,
  };
};
