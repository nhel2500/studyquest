import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import {
  GameData,
  TriviaItem,
  Collectible,
  GameSession,
  RowStatus,
  FiftyFiftyOption,
  Option,
  CluesData,
  Clue,
  User
} from '@/types/index';

interface TriviaGameProps {
  gameData: GameData;
  user: User;
}

import {
  Card, CardContent, CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// Breadcrumbs
const breadcrumbs = [
  {
    title: 'play',
    href: '/play',
  },
];

// Main component
export default function TriviaGame(props: TriviaGameProps) {
  // Safety check - handle missing props
  const gameData = props?.gameData || {};
  const user = props?.user;

  // Game data loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);

  // State variables
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'gameOver' | 'levelComplete'>('playing');
  const [showCollectibleModal, setShowCollectibleModal] = useState<boolean>(false);
  const [currentCollectible, setCurrentCollectible] = useState<Collectible | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('Welcome to StudyQuest! Answer Philippine history trivia to collect rare items!');
  const [aiMood, setAiMood] = useState<'happy' | 'excited' | 'sad' | 'worried'>('happy');
  const [timerValue, setTimerValue] = useState<number>(20); // 20 seconds per question
  const [showTimerWarning, setShowTimerWarning] = useState<boolean>(false);

  // Initialize with gameData state - with fallbacks for all properties
  const [triviaData, setTriviaData] = useState<TriviaItem[]>([]);
  const [cluesData, setCluesData] = useState<CluesData[]>([]);
  const [collectedItems, setCollectedItems] = useState<Collectible[]>([]);
  const [session, setSession] = useState<GameSession>({
    id: 0,
    level: 1,
    currentRow: 1,
    score: 0,
    streak: 0,
    hearts: 3,
    gameMode: 'normal'
  });
  const [availablePowerUps, setAvailablePowerUps] = useState<string[]>([]);
  const [rowStatus, setRowStatus] = useState<RowStatus>({
    row1Completed: false,
    row2Completed: false,
    row3Completed: false
  });
  const [fiftyFiftyOptions, setFiftyFiftyOptions] = useState<FiftyFiftyOption | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  // Clue system state
  const [currentClueLevel, setCurrentClueLevel] = useState<number>(0);
  const [clueUsed, setClueUsed] = useState<boolean>(false);
  const [availableClues, setAvailableClues] = useState<{level: number, used: boolean}[]>([
    {level: 1, used: false},
    {level: 2, used: false},
    {level: 3, used: false}
  ]);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game data from props
  useEffect(() => {
    console.log("Initializing game data from props:", props);

    try {
      if (!props || !props.gameData) {
        setLoadError("Game data is missing");
        setIsLoading(false);
        return;
      }

      const { gameData } = props;

      // Check if triviaData exists and is an array
      if (!gameData.triviaData || !Array.isArray(gameData.triviaData) || gameData.triviaData.length === 0) {
        setLoadError("Trivia questions are missing");
        setIsLoading(false);
        return;
      }

      // Initialize state with data from props
      setTriviaData(gameData.triviaData);
      setCluesData(Array.isArray(gameData.cluesData) ? gameData.cluesData : []);
      setCollectedItems(Array.isArray(gameData.collectedItems) ? gameData.collectedItems : []);
      setSession(gameData.session && typeof gameData.session === 'object' ? gameData.session : {
        id: 0,
        level: 1,
        currentRow: 1,
        score: 0,
        streak: 0,
        hearts: 3,
        gameMode: 'normal'
      });
      setAvailablePowerUps(Array.isArray(gameData.powerUps) ? gameData.powerUps : []);
      setRowStatus(gameData.rowStatus && typeof gameData.rowStatus === 'object' ? gameData.rowStatus : {
        row1Completed: false,
        row2Completed: false,
        row3Completed: false
      });
      setCompletedQuestions(Array.isArray(gameData.completedQuestions) ? gameData.completedQuestions : []);

      // Mark loading as complete
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing game data:", error);
      setLoadError("Failed to initialize game data");
      setIsLoading(false);
    }
  }, [props]);

  // Find an unanswered question to start with after data is loaded
  useEffect(() => {
    if (!isLoading && triviaData && triviaData.length > 0) {
      console.log("Game data loaded, finding first question");
      findUnansweredQuestion();
    }
  }, [isLoading, triviaData]);

  // FIXED TIMER FUNCTIONALITY: Use a React effect to manage the timer based on game state
  // Fetch game data and find first question
useEffect(() => {
    if (!isLoading && triviaData && triviaData.length > 0) {
      console.log("Game data loaded, finding first question");
      findUnansweredQuestion();
    }
  }, [isLoading, triviaData]);

  // Timer functionality depending on game state
  useEffect(() => {
    if (gameState === 'playing' && !isAnswered) {
      console.log("Starting timer - game state is 'playing' and question is not answered");

      const initialTime = session.gameMode === 'normal' ? 20 : 15;
      setTimerValue(initialTime);
      setShowTimerWarning(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimerValue(prev => {
          if (prev <= 5 && prev > 0) {
            setShowTimerWarning(true);
          }
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (!isAnswered) {
              handleTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        console.log("Clearing timer - game state is not 'playing' or question is answered");
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        console.log("Cleaning up timer in effect cleanup");
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, isAnswered, session.gameMode]);




  // Change timer duration based on game mode
  useEffect(() => {
    const baseTime = session.gameMode === 'normal' ? 20 : 15; // 15 seconds for sudden death
    setTimerValue(baseTime);
  }, [session.gameMode]);

  // Find an unanswered question to start with
  const findUnansweredQuestion = () => {
    // Make sure triviaData exists before trying to filter it
    if (!triviaData || triviaData.length === 0) {
      console.error("Cannot find unanswered question - triviaData is empty");
      return;
    }

    try {
      const currentRowQuestions = triviaData.filter(q => q.row === session.currentRow);
      const unansweredQuestions = currentRowQuestions.filter(q => !q.completed);

      if (unansweredQuestions.length > 0) {
        // Find the index of this question in the full triviaData array
        const questionIndex = triviaData.findIndex(q => q.id === unansweredQuestions[0].id);
        if (questionIndex !== -1) {
          setCurrentQuestion(questionIndex);
        } else {
          console.error("Question index not found in triviaData");
        }
      } else {
        console.warn("No unanswered questions found in current row");
      }
    } catch (error) {
      console.error("Error finding unanswered question:", error);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    if (gameState !== 'playing') return;

    // If Shield powerup is active
    if (activePowerUp === 'shield') {
      setAiMessage("Shield activated! Your heart is protected from the timer.");
      setActivePowerUp(null);
    } else {
      setSession(prev => ({
        ...prev,
        hearts: prev.hearts - 1,
        streak: 0
      }));
      setAiMood('sad');
      setAiMessage("Time's up! You lost a heart.");
    }

    setIsAnswered(true);

    // 🔥 Instead of just revealing, let's check game over or move next
    setTimeout(() => {
      setGameState(prev => {
        if (session.hearts <= 1) {
          return 'gameOver';
        } else {
          handleNextQuestion();
          return 'playing'; // Continue playing
        }
      });
    }, 1000); // 1-second pause for "Time's Up" animation
  };


  // Streak handler
  useEffect(() => {
    if (session.streak === 3) {
      setAiMessage("You're becoming a history scholar! Keep it up!");
      setAiMood('excited');

      // 30% chance to get a power-up at 3 streak
      if (Math.random() < 0.3) {
        addRandomPowerUp();
      }
    } else if (session.streak === 5) {
      setAiMessage("Impressive knowledge! Rizal would be proud!");
      setAiMood('excited');
      addRandomPowerUp(); // Guaranteed power-up at 5 streak
    } else if (session.streak === 10) {
      setAiMessage("LEGENDARY STREAK! You're writing your own place in history!");
      setAiMood('excited');
      addRandomPowerUp();
      addRandomPowerUp(); // Two power-ups at 10 streak
    }
  }, [session.streak]);

  // Add power-up via API call
  const addRandomPowerUp = async () => {
    try {
      const response = await axios.post('/api/trivia/add-powerup');
      if (response.data.success) {
        setAvailablePowerUps(prev => [...prev, response.data.powerUp]);
      }
    } catch (error) {
      console.error('Error adding power-up:', error);
      // Fallback: add a random power-up client-side if API call fails
      const powerUps = ['shield', 'fifty-fifty', 'double-points', 'heal', 'shuffle'];
      const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
      setAvailablePowerUps(prev => [...prev, randomPowerUp]);
    }
  };

  // Get clue for current question
  const getClue = async (level: number): Promise<void> => {
    // Make sure triviaData exists and we have a valid current question
    if (!triviaData || !triviaData[currentQuestion]) return;

    try {
      const response = await axios.post('/api/trivia/clue', {
        questionId: triviaData[currentQuestion].id,
        clueLevel: level
      });
      if (response.data.success) {
        setCurrentClueLevel(level);
        setClueUsed(true);
        setAiMood('excited');
        setAiMessage(`CLUE: ${response.data.clue.text}`);

        // Update score if points were deducted
        setSession(prev => ({
          ...prev,
          score: response.data.updatedScore
        }));
      }
    } catch (error) {
      console.error('Error getting clue:', error);

      // Fallback: provide a generic clue if API call fails
      setCurrentClueLevel(level);
      setClueUsed(true);
      setAiMood('excited');

      // Client-side cost calculation
      const costMap: Record<number, number> = { 1: 0, 2: 5, 3: 10 };
      const cost = costMap[level] || 0;

      // Update score
      setSession(prev => ({
        ...prev,
        score: Math.max(0, prev.score - cost)
      }));

      setAiMessage(`CLUE: Think about the historical context of this question. (Cost: ${cost} points)`);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setAiMessage(error.response.data.message);
        setAiMood('worried');
      }

    }

    // Update clue button state
    setAvailableClues(prev =>
      prev.map(c => c.level === level ? {...c, used: true} : c)
    );
  };

  // Reset clues when moving to next question
  const resetClues = (): void => {
    setCurrentClueLevel(0);
    setClueUsed(false);
    setAvailableClues([
      {level: 1, used: false},
      {level: 2, used: false},
      {level: 3, used: false}
    ]);
  };

  // Handle answer selection
  const handleAnswerSelect = async (answerId: string) => {
    if (isAnswered || gameState !== 'playing') return;

    setSelectedAnswer(answerId);
    setIsAnswered(true);

    try {
      const response = await axios.post('/api/trivia/answer', {
        questionId: triviaData[currentQuestion].id,
        selectedAnswer: answerId,
        activePowerUp: activePowerUp
      });

      if (response.data.success) {
        const { isCorrect, pointsEarned, collectibleAwarded, gameState: newGameState, session: updatedSession } = response.data;

        // Update session data
        setSession(updatedSession);

        // Update completed questions
        setCompletedQuestions(prev => [...prev, triviaData[currentQuestion].id]);

        // Update trivia data to mark question as completed
        setTriviaData(prev =>
          prev.map(item =>
            item.id === triviaData[currentQuestion].id
              ? { ...item, completed: true }
              : item
          )
        );

        if (isCorrect) {
          setAiMood('excited');
          setAiMessage(`Correct! ${activePowerUp === 'double-points' ? 'DOUBLE POINTS!' : ''}`);

          // Show collectible if awarded
          if (collectibleAwarded) {
            setCurrentCollectible(collectibleAwarded);
            setCollectedItems(prev => [...prev, collectibleAwarded]);

            setTimeout(() => {
              setShowCollectibleModal(true);
            }, 1000);
          }
        } else {
          setAiMood('sad');
          setAiMessage(`That's not correct. The answer was ${getOptionTextById(triviaData[currentQuestion].correctAnswer)}`);
        }

        // Set game state based on response
        setGameState(newGameState);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);

      // CLIENT-SIDE FALLBACK for answer checking if API fails
      const currentTriviaItem = triviaData[currentQuestion];
      const isCorrect = answerId === currentTriviaItem.correctAnswer;

      // Update completed questions locally
      setCompletedQuestions(prev => [...prev, currentTriviaItem.id]);

      // Update trivia data to mark question as completed
      setTriviaData(prev =>
        prev.map(item =>
          item.id === currentTriviaItem.id
            ? { ...item, completed: true }
            : item
        )
      );

      // Calculate points
      const basePoints = isCorrect ? 10 : 0;
      const pointsMultiplier = activePowerUp === 'double-points' ? 2 : 1;
      const pointsEarned = basePoints * pointsMultiplier;

      // Update session data locally
      setSession(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        streak: isCorrect ? prev.streak + 1 : 0
      }));

      if (isCorrect) {
        setAiMood('excited');
        setAiMessage(`Correct! ${activePowerUp === 'double-points' ? 'DOUBLE POINTS!' : ''}`);

        // 10% chance to get a collectible on correct answer
        if (Math.random() < 0.1) {
            const rarities = ['NORMAL', 'COMMON', 'RARE', 'VERY RARE', 'LEGENDARY'] as const;
            type Rarity = typeof rarities[number]; // <-- now TypeScript knows these are the only valid options

            const randomRarity: Rarity = rarities[Math.floor(Math.random() * rarities.length)];

            const newCollectible = {
              id: Date.now(),
              name: `Philippine Artifact`,
              rarity: randomRarity,
              bonus: randomRarity === 'LEGENDARY' ? '+50 points on next correct answer' : undefined,
              image: '/images/default-collectible.png'
            };

            setCurrentCollectible(newCollectible);
            setCollectedItems(prev => [...prev, newCollectible]);

            setTimeout(() => {
              setShowCollectibleModal(true);
            }, 1000);
          }
      } else {
        setAiMood('sad');
        setAiMessage(`That's not correct. The answer was ${getOptionTextById(currentTriviaItem.correctAnswer)}`);
      }

      // Set game state
      setGameState('revealed');
    }

    // Reset active power-up after use
    if (activePowerUp) {
      setActivePowerUp(null);
    }
  };

  // Get option text by ID
  const getOptionTextById = (optionId: string): string => {
    if (!triviaData || !triviaData[currentQuestion]) return '';

    const option = triviaData[currentQuestion].options.find(opt => opt.id === optionId);
    return option ? option.text : '';
  };

  // Handle next question
  const handleNextQuestion = () => {
    // Game over check
    if (session.hearts <= 0) {
      setGameState('gameOver');
      return;
    }

    // Level complete check
    if (rowStatus.row1Completed && rowStatus.row2Completed && rowStatus.row3Completed) {
      setGameState('levelComplete');
      return;
    }

    // Reset clues for next question
    resetClues();

    // Find next question in current row
    const currentRowQuestions = triviaData.filter(q => q.row === session.currentRow);
    const unansweredQuestions = currentRowQuestions.filter(q => !q.completed);

    if (unansweredQuestions.length > 0) {
      // Go to a random unanswered question in current row
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
      const nextQuestionIndex = triviaData.findIndex(q => q.id === unansweredQuestions[randomIndex].id);

      setCurrentQuestion(nextQuestionIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFiftyFiftyOptions(null);
      setGameState('playing'); // This will automatically trigger the timer through useEffect
      setAiMessage('What do you know about this piece of Philippine history?');
      setAiMood('happy');
      setShowCollectibleModal(false);
    } else {
      // All questions in current row are answered
      if (session.currentRow < 3) {
        setSession(prev => ({
          ...prev,
          currentRow: prev.currentRow + 1
        }));

        // Find first question in new row
        const nextRowQuestions = triviaData.filter(q => q.row === session.currentRow + 1);
        if (nextRowQuestions.length > 0) {
          const nextQuestionIndex = triviaData.findIndex(q => q.id === nextRowQuestions[0].id);

          setCurrentQuestion(nextQuestionIndex);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setFiftyFiftyOptions(null);
          setGameState('playing'); // This will automatically trigger the timer through useEffect
          setAiMessage(`Moving to Row ${session.currentRow + 1}!`);
          setAiMood('excited');
          setShowCollectibleModal(false);

          // Update row status
          setRowStatus(prev => {
            const newStatus = { ...prev };
            if (session.currentRow === 1) newStatus.row1Completed = true;
            if (session.currentRow === 2) newStatus.row2Completed = true;
            return newStatus;
          });
        }
      } else {
        // All rows completed
        setGameState('levelComplete');
        setRowStatus(prev => ({
          ...prev,
          row3Completed: true
        }));
      }
    }
  };

  // Handle level completion
  const handleNextLevel = async () => {
    try {
      const response = await axios.post('/api/trivia/next-level');

      if (response.data.success) {
        // Update game data with the response
        const { gameData } = response.data;

        setTriviaData(gameData.triviaData);
        setSession(gameData.session);
        setAvailablePowerUps(gameData.powerUps);
        setRowStatus(gameData.rowStatus);
        setCompletedQuestions(gameData.completedQuestions);

        // Reset game state
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFiftyFiftyOptions(null);
        setGameState('playing'); // This will automatically trigger the timer through useEffect
        setShowCollectibleModal(false);
        resetClues();

        // Set AI message
        setAiMessage(`Level ${gameData.session.level} begins! The questions will be more challenging now.`);
        setAiMood('excited');

        // Find an unanswered question
        const currentRowQuestions = gameData.triviaData.filter((q: TriviaItem) => q.row === 1);
        if (currentRowQuestions.length > 0) {
            const questionIndex = gameData.triviaData.findIndex((q: TriviaItem) => q.id === currentRowQuestions[0].id);
          setCurrentQuestion(questionIndex);
        }
      }
    } catch (error) {
      console.error('Error advancing to next level:', error);

      // CLIENT-SIDE FALLBACK for next level if API fails
      // Increase level number
      const nextLevel = session.level + 1;

      // Reset session for new level
      setSession(prev => ({
        ...prev,
        level: nextLevel,
        currentRow: 1,
        // Keep score and streak from previous level
      }));

      // Reset row status
      setRowStatus({
        row1Completed: false,
        row2Completed: false,
        row3Completed: false
      });

      // Mark all questions as not completed
      setTriviaData(prevData =>
        prevData.map(item => ({ ...item, completed: false }))
      );

      // Reset completed questions
      setCompletedQuestions([]);

      // Reset game state
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFiftyFiftyOptions(null);
      setGameState('playing');
      setShowCollectibleModal(false);
      resetClues();

      // Set AI message
      setAiMessage(`Level ${nextLevel} begins! The questions will be more challenging now.`);
      setAiMood('excited');

      // Find a question to start with
      findUnansweredQuestion();

      toast.success(`Advanced to Level ${nextLevel}!`);
    }
  };

  // CLIENT-SIDE IMPLEMENTATION OF RESTART GAME FUNCTION
  const handleRestartGame = async (gameMode: 'normal' | 'suddenDeath') => {
    try {
      // Show loading state
      setIsRestarting(true);
      const loadingToast = toast.loading(`Restarting game in ${gameMode} mode...`);

      try {
        const response = await axios.post('/api/trivia/restart', {
          gameMode: gameMode === 'suddenDeath' ? 'sudden_death' : gameMode
        });

        toast.dismiss(loadingToast);

        if (response.data.success) {
          toast.success(`Game restarted in ${gameMode} mode!`);

          // 🔥 Instead of manually resetting everything — just reload page:
          window.location.href = '/play';
          return;
        } else {
          throw new Error(response.data.message || 'Failed to restart game');
        }
      } catch (error) {
        console.error('Error restarting game with API:', error);
        toast.dismiss(loadingToast);
        toast.error('Failed to restart game. Reloading page.');

        // 🔥 Fallback: reload page even if API fails
        window.location.href = '/play';
        return;
      }
    } finally {
      setIsRestarting(false);
    }
  };


  const switchGameMode = (mode: 'normal' | 'suddenDeath') => {
    handleRestartGame(mode);
  };

  // Power-up usage
  const usePowerUp = (powerUpId: string) => {
    if (gameState !== 'playing' || isAnswered) return;

    setActivePowerUp(powerUpId);
    setAvailablePowerUps(prev => prev.filter(id => id !== powerUpId));

    if (powerUpId === 'fifty-fifty') {
      const currentTriviaItem = triviaData[currentQuestion];
      if (!currentTriviaItem) return;

      const correctAnswerId = currentTriviaItem.correctAnswer;

      // Get all incorrect answer IDs
      const incorrectAnswerIds = currentTriviaItem.options
        .filter(option => option.id !== correctAnswerId)
        .map(option => option.id);

      // Randomly select two incorrect answers to remove
      const shuffledIncorrect = incorrectAnswerIds.sort(() => Math.random() - 0.5);
      const incorrectToRemove = shuffledIncorrect.slice(0, 2);

      // Create an object of options to show (set to true if should be shown)
      const optionsToShow: FiftyFiftyOption = {};
      currentTriviaItem.options.forEach(option => {
        optionsToShow[option.id] = !incorrectToRemove.includes(option.id);
      });

      setFiftyFiftyOptions(optionsToShow);
      setAiMessage("Your knowledge of history has helped you eliminate two wrong answers!");
    } else if (powerUpId === 'shield') {
      setAiMessage("Rizal's wisdom protects you from losing a heart this round!");
    } else if (powerUpId === 'double-points') {
      setAiMessage("The revolutionary spirit doubles your score for this answer!");
    } else if (powerUpId === 'heal') {
      if (session.hearts < 3) {
        setSession(prev => ({
          ...prev,
          hearts: Math.min(prev.hearts + 1, 3)
        }));
        setAiMessage("You restored a heart! ❤️");
      } else {
        setAiMessage("You already have maximum hearts!");
        // Return the power-up since it wasn't used
        setAvailablePowerUps(prev => [...prev, powerUpId]);
        setActivePowerUp(null);
      }
    } else if (powerUpId === 'shuffle') {
      // Get all questions from current row
      const currentRowQuestions = triviaData.filter(q => q.row === session.currentRow);
      const unansweredQuestions = currentRowQuestions.filter(q =>
        !q.completed && q.id !== triviaData[currentQuestion]?.id
      );

      if (unansweredQuestions.length > 0) {
        // Go to a random unanswered question in current row
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const nextQuestionIndex = triviaData.findIndex(q => q.id === unansweredQuestions[randomIndex].id);

        setCurrentQuestion(nextQuestionIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFiftyFiftyOptions(null);
        setAiMessage("Question shuffled! Let's try a different one.");

        // No need to manually restart timer - setting gameState to 'playing' will do that
        setGameState('playing');
      } else {
        setAiMessage("No more questions to shuffle to in this row!");
        // Return the power-up since it wasn't used
        setAvailablePowerUps(prev => [...prev, powerUpId]);
        setActivePowerUp(null);
      }
    } else if (powerUpId === 'shuffle') {
      // Get all questions from current row
      const currentRowQuestions = triviaData.filter(q => q.row === session.currentRow);
      const unansweredQuestions = currentRowQuestions.filter(q =>
        !q.completed && q.id !== triviaData[currentQuestion]?.id
      );

      if (unansweredQuestions.length > 0) {
        // Go to a random unanswered question in current row
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const nextQuestionIndex = triviaData.findIndex(q => q.id === unansweredQuestions[randomIndex].id);

        setCurrentQuestion(nextQuestionIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFiftyFiftyOptions(null);
        setAiMessage("Question shuffled! Let's try a different one.");
        setGameState('playing');

        // Restart timer for new question
      } else {
        setAiMessage("No more questions to shuffle to in this row!");
        // Return the power-up since it wasn't used
        setAvailablePowerUps(prev => [...prev, powerUpId]);
        setActivePowerUp(null);
      }
    }
  };

  // ClueButton component
  const ClueButton = ({ level, cost }: { level: number, cost: number }) => {
    const clue = availableClues.find(c => c.level === level);
    const isUsed = clue?.used || false;
    const canAfford = session.score >= cost || cost === 0;

    return (
      <button
        onClick={() => getClue(level)}
        disabled={isUsed || !canAfford || isAnswered}
        className={`px-3 py-1 rounded-md text-sm ${
          isUsed
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
            : !canAfford
              ? 'bg-red-300 text-red-800 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/80'
        }`}
      >
        {isUsed ? 'Used' : `Clue ${level} ${cost > 0 ? `(-${cost})` : '(Free)'}`}
      </button>
    );
  };

  // Render hearts UI
  const renderHearts = (): React.ReactElement => {
    return (
      <div className="trivia-hearts">
        {[...Array(session.gameMode === 'normal' ? 3 : 1)].map((_, i) => (
          <span key={i} className="text-2xl">
            {i < session.hearts ? '❤️' : '🖤'}
          </span>
        ))}
      </div>
    );
  };

  // Power-ups map for UI rendering
  const powerUpsMap: {[key: string]: {name: string, icon: string, description: string}} = {
    'shuffle': { name: 'Shuffle', icon: '🔄', description: 'Changes the current question card' },
    'shield': { name: 'Shield', icon: '🛡️', description: 'Protects you from losing a heart' },
    'fifty-fifty': { name: '50/50', icon: '50/50', description: 'Removes two incorrect answers' },
    'double-points': { name: 'Double Points', icon: '2x', description: 'Doubles points for one question' },
    'heal': { name: 'Heal', icon: '❤️', description: 'Restores one heart' }
  };

  // Render power-ups UI
  const renderPowerUps = (): React.ReactElement => {
    return (
      <div className="flex space-x-2 mb-4">
        {availablePowerUps.map((powerUpId, index) => {
          const powerUp = powerUpsMap[powerUpId as keyof typeof powerUpsMap];
          if (!powerUp) return null;

          return (
            <button
              key={`${powerUpId}-${index}`}
              onClick={() => usePowerUp(powerUpId)}
              className="trivia-powerup"
              title={powerUp.description}
            >
              <span className="trivia-powerup-icon">{powerUp.icon}</span>
              <span>{powerUp.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Render AI assistant
  const renderAI = (): React.ReactElement => {
    let moodEmoji = '😊'; // default happy
    if (aiMood === 'excited') moodEmoji = '🤩';
    if (aiMood === 'sad') moodEmoji = '😢';
    if (aiMood === 'worried') moodEmoji = '😟';

    // Safety check for current question
    if (!triviaData || !triviaData[currentQuestion]) {
      return (
        <div className="trivia-ai">
          <div className="trivia-ai-avatar">
            {moodEmoji}
          </div>
          <div className="trivia-ai-message">
            <p>{aiMessage || "Loading game..."}</p>
          </div>
        </div>
      );
    }

    // Get current question's clue data if available
    const currentQuestionClues = cluesData
      .find(c => c && typeof c === 'object' && c.question_id === triviaData[currentQuestion]?.id)
      ?.clues;

    const currentClue = currentQuestionClues
      ?.find(c => c && typeof c === 'object' && c.level === currentClueLevel);

    return (
      <div className="trivia-ai">
        <div className="trivia-ai-avatar">
          {moodEmoji}
        </div>
        <div className="trivia-ai-message">
          <p>{aiMessage}</p>
          {clueUsed && currentClue && (
            <div className="mt-2 text-sm">
              <span className="text-accent font-medium">Hint Level {currentClueLevel}</span>
              {currentClue.cost > 0 && <span className="text-yellow-400 ml-2">(-{currentClue.cost} points)</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render row status
  const renderRowStatus = (): React.ReactElement => {
    return (
      <div className="trivia-level-rows-grid">
        <div className={`trivia-level-row ${rowStatus.row1Completed ? 'bg-green-600' : session.currentRow === 1 ? 'bg-primary' : 'bg-secondary'}`}>
          1 {rowStatus.row1Completed && '✓'}
        </div>
        <div className={`trivia-level-row ${rowStatus.row2Completed ? 'bg-green-600' : session.currentRow === 2 ? 'bg-primary' : 'bg-secondary'}`}>
          2 {rowStatus.row2Completed && '✓'}
        </div>
        <div className={`trivia-level-row ${rowStatus.row3Completed ? 'bg-green-600' : session.currentRow === 3 ? 'bg-primary' : 'bg-secondary'}`}>
          3 {rowStatus.row3Completed && '✓'}
        </div>
      </div>
    );
  };

  // Render timer
  const renderTimer = (): React.ReactElement => {
    // Calculate percentage for the progress bar
    const maxTime = session.gameMode === 'normal' ? 20 : 15;
    const percentage = (timerValue / maxTime) * 100;

    // Determine color based on time remaining
    let timerColor = 'bg-green-500';
    if (timerValue <= 5) timerColor = 'bg-red-500';
    else if (timerValue <= 10) timerColor = 'bg-yellow-500';

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Time Remaining</span>
          <span className={timerValue <= 5 ? 'text-red-500 font-bold' : ''}>{timerValue}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${timerColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {showTimerWarning && timerValue <= 5 && timerValue > 0 && (
          <div className="text-red-500 text-sm mt-1 animate-pulse">Hurry up!</div>
        )}
      </div>
    );
  };

  // Render collectible modal
  const renderCollectibleModal = (): React.ReactElement | null => {
    if (!showCollectibleModal || !currentCollectible) return null;

    return (
      <div className="trivia-modal">
        <div className="trivia-modal-content">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-primary">New Collectible!</h3>
            <button
              onClick={() => setShowCollectibleModal(false)}
              className="text-accent hover:text-accent-foreground"
            >
              ✕
            </button>
          </div>

          <div className="trivia-collectible">
            <div className="trivia-collectible-image">
              <span>🏆</span>
            </div>

            <h4 className="trivia-collectible-title">{currentCollectible.name}</h4>

            <div className={`trivia-collectible-rarity ${currentCollectible.rarity.replace(' ', '-')}`}>
              {currentCollectible.rarity}
            </div>

            <p className="trivia-collectible-description">
              {triviaData[currentQuestion]?.revealText || "An interesting piece of Philippine history!"}
            </p>

            {currentCollectible.bonus && (
              <div className="trivia-collectible-bonus">
                <p>{currentCollectible.bonus}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowCollectibleModal(false)}
              className="trivia-button"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="StudyQuest - Loading..." />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Loading StudyQuest...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="StudyQuest - Error" />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Error Loading Game</h2>
            <p className="mb-4">{loadError}</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Level complete screen
  if (gameState === 'levelComplete') {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`StudyQuest - Level ${session.level} Complete`} />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card shadow-xl rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-3xl font-bold text-accent mb-4">Level {session.level} Complete!</h2>
                <p className="text-xl mb-4">You've completed all rows of questions!</p>
                <p className="text-lg mb-8">Current Score: <span className="font-bold text-primary">{session.score}</span> points</p>

                <div className="bg-muted p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Level {session.level} Stats</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-card p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Collectibles Earned</p>
                      <p className="text-2xl font-bold">{collectedItems.length}</p>
                    </div>
                    <div className="bg-card p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold">{session.streak}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNextLevel}
                    className="trivia-button bg-primary"
                  >
                    Advance to Level {session.level + 1}
                  </button>
                  <button
                    onClick={() => handleRestartGame(session.gameMode)}
                    className="trivia-button bg-secondary"
                  >
                    Restart Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Game over screen
  if (gameState === 'gameOver') {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="StudyQuest - Game Over" />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card shadow-xl rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-3xl font-bold text-accent mb-4">Game Over!</h2>
                <p className="text-xl mb-8">You scored <span className="font-bold text-primary">{session.score}</span> points</p>

                <div className="bg-muted p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Collectibles Earned</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {collectedItems.length > 0 ? (
                      collectedItems.map((item, index) => (
                        <div key={index} className="bg-card p-3 rounded-lg">
                          <div className="trivia-collectible-image" style={{width: "4rem", height: "4rem", margin: "0 auto 0.5rem"}}>
                            <span className="text-3xl">🏆</span>
                          </div>
                          <p className="text-sm font-medium text-center">{item.name}</p>
                          <p className="text-xs text-center text-accent">{item.rarity}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 p-4">
                        <p className="text-muted-foreground">No collectibles earned this game.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leaderboard preview */}
                {gameData.leaderboard && gameData.leaderboard.length > 0 && (
                  <div className="bg-muted p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Rank</th>
                            <th className="text-left py-2 px-4">Player</th>
                            <th className="text-right py-2 px-4">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameData.leaderboard.slice(0, 5).map((entry, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">{index + 1}</td>
                              <td className="py-2 px-4">{entry.user}</td>
                              <td className="py-2 px-4 text-right">{entry.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-right">
                      <a href="/leaderboard" className="text-accent hover:underline">View full leaderboard</a>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 justify-center">

                  {session.gameMode === 'normal' ? (
                  <a href="#" onClick={() => window.location.reload()} className="trivia-button bg-secondary">
                 Play Again
                </a>
                  ) : (
                    <button
                      onClick={() => switchGameMode('normal')}
                      className="trivia-button bg-secondary"
                    >
                      Return to Normal Mode
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Safety check if currentTriviaItem is undefined for main game screen
  const currentTriviaItem = triviaData[currentQuestion];
  if (!currentTriviaItem) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`StudyQuest - Level ${session.level}`} />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No question available</h2>
            <p className="mb-4">There seems to be an issue loading the current question.</p>
            <Button onClick={() => handleRestartGame(session.gameMode)}>
              Restart Game
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Main game screen
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`StudyQuest - Level ${session.level}`} />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="trivia-level">
              <span className="trivia-level-title">Level {session.level}</span>
              <div className="trivia-level-rows">
                <span className="trivia-level-rows-label">Row:</span>
                {renderRowStatus()}
              </div>
            </div>

            <div className="trivia-stats">
              <div className="trivia-stats-item">
                <div className="trivia-stats-label">Score</div>
                <div className="trivia-stats-value">{session.score}</div>
              </div>

              <div className="trivia-stats-item">
                <div className="trivia-stats-label">Streak</div>
                <div className="trivia-stats-value">{session.streak}</div>
              </div>

              <button
                onClick={() => setShowAiAssistant(prev => !prev)}
                className="px-3 py-1 text-sm rounded-full bg-secondary text-white"
              >
                {showAiAssistant ? 'Hide AI' : 'Show AI'}
              </button>

              <div>
                {renderHearts()}
              </div>
            </div>
          </div>

          {showAiAssistant && renderAI()}

          {showAiAssistant && cluesData.length > 0 && (
            <div className="flex items-center justify-between mb-4 bg-secondary/20 p-2 rounded-lg">
              <span className="text-sm font-medium">Need help?</span>
              <div className="flex space-x-2">
                {cluesData
                  .filter(c => c && typeof c === 'object' && c.question_id === currentTriviaItem.id)
                  .flatMap(c => Array.isArray(c.clues) ? c.clues : [])
                  .map(clue => clue && typeof clue === 'object' ? (
                    <ClueButton
                      key={clue.level}
                      level={clue.level}
                      cost={clue.cost}
                    />
                  ) : null)
                }
              </div>
            </div>
          )}

          {availablePowerUps.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium mb-2 block">Power-ups:</span>
              {renderPowerUps()}
            </div>
          )}

          {renderTimer()}

          <div className="trivia-question-card">
            <div className="flex items-center justify-between mb-4">
            <span className={`trivia-category-badge ${currentTriviaItem?.rarity?.replace(' ', '-') ?? 'normal'}`}>
                    {currentTriviaItem?.category ?? 'Unknown'} • {currentTriviaItem?.rarity ?? 'Normal'}
                 </span>

              <span className="text-muted-foreground text-sm">
                Row {session.currentRow}
              </span>
            </div>

            <h3 className="trivia-question">{currentTriviaItem.question}</h3>

            <div className="grid grid-cols-1 gap-3">
              {currentTriviaItem.options.map(option => {
                // Check if this option should be hidden (for 50/50 powerup)
                if (fiftyFiftyOptions && !fiftyFiftyOptions[option.id]) {
                  return null;
                }

                let optionClasses = "trivia-option";

                if (isAnswered) {
                  if (option.id === currentTriviaItem.correctAnswer) {
                    optionClasses += " trivia-option-correct";
                  } else if (option.id === selectedAnswer) {
                    optionClasses += " trivia-option-incorrect";
                  } else {
                    optionClasses += " trivia-option-disabled";
                  }
                } else if (option.id === selectedAnswer) {
                  optionClasses += " trivia-option-selected";
                }

                return (
                  <div
                    key={option.id}
                    className={optionClasses}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <span className="trivia-option-circle">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="trivia-option-text">{option.text}</span>
                  </div>
                );
              })}
            </div>

            {gameState === 'revealed' && (
              <div className="trivia-reveal">
                <p className="trivia-reveal-collectible">
                    {currentTriviaItem?.collectible?.rarity === 'LEGENDARY'
                        ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                        : currentTriviaItem?.collectible?.rarity === 'VERY RARE'
                        ? '✨✨ You discovered a VERY RARE collectible!'
                        : currentTriviaItem?.collectible?.rarity === 'RARE'
                            ? '✨ You found a RARE collectible!'
                            : currentTriviaItem?.collectible?.rarity === 'COMMON'
                            ? '✓ You found a COMMON collectible!'
                            : '✓ No collectible found for this question.'}
                    </p>

                <p className="trivia-reveal-text">{currentTriviaItem.revealText}</p>

                <button
                  onClick={handleNextQuestion}
                  className="trivia-button"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderCollectibleModal()}
    </AppLayout>
  );
}
