
'use client'
import { createContext, useState, useContext, useCallback } from "react";

export const SurveyContext = createContext();

export const useSurvey = () => useContext(SurveyContext);

export const SurveyProvider = ({ children }) => {
  const [answers, setAnswers] = useState({});
  const [navigationPath, setNavigationPath] = useState({});

  const storeAnswer = useCallback((question, answer) => {
    const field = question.field;
    setAnswers((prev) => ({ ...prev, [field]: answer }));
  }, []);

  const getAnswer = useCallback((field) => {
    return answers[field];
  }, [answers]);

  const setPathForQuestion = useCallback((questionId, path) => {
    setNavigationPath(prev => ({
      ...prev,
      [questionId]: path
    }));
  }, []);

  const getPathForQuestion = useCallback((questionId) => {
    return navigationPath[questionId] || [];
  }, [navigationPath]);

  return (
    <SurveyContext.Provider value={{ 
      answers, 
      storeAnswer, 
      getAnswer,
      setPathForQuestion,
      getPathForQuestion
    }}>
      {children}
    </SurveyContext.Provider>
  );
};
