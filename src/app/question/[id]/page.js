"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { surveyQuestions } from "@/data/questions";
import { useSurvey } from "@/services/survey";

// helper function used for final navigation to pages 
function buildQueryParams(answers, destination) {
  const params = new URLSearchParams();

  if (destination === 'find_a_provider') {
    if (answers.provider_state) params.append('state', answers.provider_state);
    if (answers.virtual_only) params.append('virtualOnly', answers.virtual_only);
  }

  if (destination === 'access_resources') {
    if (answers.resources_subject && answers.resources_subject.length) {
      params.append('subject', answers.resources_subject.join(','));
    }
    if (answers.resources_category && answers.resources_category.length) {
      params.append('category', answers.resources_category.join(','));
    }
  }

  return params.toString();
}

//-----------------------------------------------------

export default function QuestionPage() {
  const { 
    storeAnswer, 
    answers, 
    getAnswer, 
    setPathForQuestion, 
    getPathForQuestion 
  } = useSurvey();
  
  const { id } = useParams();
  const router = useRouter();
  const questionId = Number(id);
  const question = surveyQuestions[questionId];
  const [selectedValue, setSelectedValue] = useState(''); //will be grabbing current selected value
  const [nextPath, setNextPath] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize localAnswer with saved answer if it exists
  const [localAnswer, setLocalAnswer] = useState(
    question?.type === "multi-select" ? [] : ""
  );

  // Load saved answer and navigation path when component mounts or question changes
  useEffect(() => {
    if (question) {
      // Load saved answer
      const savedAnswer = getAnswer(question.field);
      if (savedAnswer !== undefined) {
        setLocalAnswer(savedAnswer);
        if (question.type === 'single-select' || question.type === 'dropdown') {
          setSelectedValue(savedAnswer);
        }
      }

      // Load saved navigation path for this question
      const savedPath = getPathForQuestion(questionId);
      if (savedPath && savedPath.length > 0) {
        setNextPath(savedPath);
      } else if (savedAnswer !== undefined) {
        // If there's a saved answer but no path, try to determine the path from the answer
        const selectedOption = question.options?.find(opt => 
          question.type === 'multi-select' 
            ? savedAnswer.includes(opt.value)
            : savedAnswer === opt.value
        );
        
        if (selectedOption?.next) {
          const path = Array.isArray(selectedOption.next) 
            ? [...selectedOption.next] 
            : [selectedOption.next];
          setNextPath(path);
        }
      }
      
      setIsLoading(false);
    }
  }, [question, questionId, getAnswer, getPathForQuestion]);

  // Save the navigation path whenever it changes
  useEffect(() => {
    if (question && nextPath.length > 0) {
      setPathForQuestion(questionId, nextPath);
    }
  }, [nextPath, question, questionId, setPathForQuestion]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!question) {
    return <div className="p-4 text-red-600">Question not found</div>;
  }

  function findPreviousQuestionId(currentQuestionId) {
    for (const [id, question] of Object.entries(surveyQuestions)) {
      for (const option of question.options || []) {
        const next = option.next;
        if (Array.isArray(next) && next.includes(currentQuestionId)) {
          return Number(id); // return the question that led here
        }
        if (typeof next === 'number' && next === currentQuestionId) {
          return Number(id);
        }
      }
    }
    return null; // not found
  }

  const handleBack = () => {
    const prevId = findPreviousQuestionId(questionId);
    if (prevId === null || prevId === 0) {
      router.push('/');
    } else {
      router.push(`/question/${prevId}`);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    setLocalAnswer(value);
    setError(''); // Clear error when user makes a selection

    const selectedOption = question.options.find(option => option.value === value)

    if (selectedOption) {
      const newPath = Array.isArray(selectedOption.next)
        ? [...selectedOption.next]
        : selectedOption.next
          ? [selectedOption.next]
          : [];
      
      setNextPath(newPath);
      if (question) {
        setPathForQuestion(questionId, newPath);
      }
    }
  };

  const handleContinue = () => {
    // Validate answer before proceeding
    if ((question.type === 'single-select' || question.type === 'dropdown') && !localAnswer) {
      setError('Please select an option to continue');
      return;
    }
    
    if (question.type === 'multi-select' && (!Array.isArray(localAnswer) || localAnswer.length === 0)) {
      setError('Please select at least one option');
      return;
    }

    // Save answer
    storeAnswer(question, localAnswer);

    // Determine the next step based on the current path
    let nextStep = null;
    
    // If we have a saved path, use the first item
    if (nextPath.length > 0) {
      nextStep = nextPath[0];
    } else {
      // Otherwise, try to determine the next step from the selected option
      const selectedOption = question.options?.find(opt => 
        question.type === 'multi-select' 
          ? localAnswer.includes(opt.value)
          : localAnswer === opt.value
      );
      
      if (selectedOption?.next) {
        nextStep = Array.isArray(selectedOption.next) 
          ? selectedOption.next[0] 
          : selectedOption.next;
      }
    }

    // Handle the next step
    if (nextStep) {
      if (typeof nextStep === 'string' && nextStep.startsWith('redirect:')) {
        const redirectPath = nextStep.replace('redirect:', '');
        router.push(redirectPath);
      } else if (typeof nextStep === 'number') {
        router.push(`/question/${nextStep}`);
      } else if (typeof nextStep === 'string') {
        // Handle named destinations (like 'find_a_provider' or 'access_resources')
        const destination = nextStep;
        const query = buildQueryParams(answers, destination);
        
        if (destination === 'access_resources') {
          router.push(`/resources?${query}`);
        } else if (destination === 'find_a_provider') {
          router.push(`/providers?${query}`);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } else {
      // If no specific next step is defined, try to determine the destination
      const destination = answers.visit_reason;
      if (destination) {
        const query = buildQueryParams(answers, destination);
        
        if (destination === 'access_resources') {
          router.push(`/resources?${query}`);
        } else if (destination === 'find_a_provider') {
          router.push(`/providers?${query}`);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="p-6 bg-[#FFF5EA] h-screen min-h-200">
      <div>
        <button
          onClick={handleBack}
          className="#000000 w-[60px] h-[55px] rounded-[8px] text-4xl flex items-center justify-center mb-6 text-black cursor-pointer"
          aria-label="Go back to previous question"
        >
          ←
        </button>
      </div>

      <div className="flex flex-col justify-center items-center pt-5 gap-10">
        <h1
          className="text-2xl font-bold mb-4 text-black w-90 text-center max-sm:text-lg max-sm:w-70"
          id={`question-${question.id}-label`}
        >
          {question.text}
        </h1>

        {error && (
          <div className="text-red-600 mb-4 text-center">
            {error}
          </div>
        )}

        {(question.type === "single-select" || question.type === "multi-select") && (
          <fieldset aria-labelledby={`question-${question.id}-label`}>
            <legend className="sr-only">{question.text}</legend>
            <ul className="space-y-6 mb-6">
              {question.options.map((option, idx) => (
                <li key={idx}>
                  <label className="flex items-center text-black cursor-pointer">
                    <input
                      type={question.type === "multi-select" ? "checkbox" : "radio"}
                      name={`question-${question.id}`}
                      value={option.value}
                      className="mr-2 cursor-pointer"
                      checked={
                        question.type === "multi-select"
                          ? localAnswer.includes(option.value)
                          : localAnswer === option.value
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedValue(value);
                        setError('');

                        if (question.type === "multi-select") {
                          const checked = e.target.checked;
                          if (checked) {
                            setLocalAnswer([...localAnswer, option.value]);
                          } else {
                            setLocalAnswer(
                              localAnswer.filter((val) => val !== option.value)
                            );
                          }
                        } else {
                          setLocalAnswer(option.value);
                        }

                        // Update next path based on selected option
                        if (option.next) {
                          const newPath = Array.isArray(option.next)
                            ? [...option.next]
                            : [option.next];
                          setNextPath(newPath);
                          setPathForQuestion(questionId, newPath);
                        } else {
                          setNextPath([]);
                          setPathForQuestion(questionId, []);
                        }
                      }}
                      aria-required="true"
                    />
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        {question.type === "dropdown" && (
          <select
            name={`question-${question.id}`}
            className="mt-2 p-2 border rounded mb-6 border-black text-black cursor-pointer"
            value={localAnswer}
            onChange={handleChange}
            aria-labelledby={`question-${question.id}-label`}
            aria-required="true"
          >
            <option value="" disabled>Select an option</option>
            {question.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleContinue}
          className={`w-full max-w-md h-[55px] bg-[#C96C86] rounded-[8px] text-white font-semibold mt-15
             cursor-pointer transition-transform duration-300 hover:scale-105
            `}
          aria-label="Continue to next question"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
