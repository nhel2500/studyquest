import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import useSoundEffects from '@/hooks/useSoundEffects';

import {
  GameData,
  TriviaItem,
  Collectible,
  GameSession,
  RowStatus,
  FiftyFiftyOption,
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

// Define sound triggers
const SOUND = {
    correct: '/sounds/correct-answer.mp3',
    wrong: '/sounds/wrong-answer.mp3',
    click: '/sounds/button-click.mp3',
    start: '/sounds/game-start.mp3',
    gameOver: '/sounds/game-over.mp3'
  };


// Breadcrumbs
const breadcrumbs = [
  {
    title: 'play',
    href: '/play',
  },
];

// Main component
export default function TriviaGame(props: TriviaGameProps) {

    const { play, enabled, toggle } = useSoundEffects();
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

      if (!gameData.triviaData || !Array.isArray(gameData.triviaData) || gameData.triviaData.length === 0) {
        setLoadError("Trivia questions are missing");
        setIsLoading(false);
        return;
      }

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

      // ✅ Add this line only after successful loading
      play('start');

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

  useEffect(() => {
    if (gameState === 'gameOver' || gameState === 'levelComplete') {
      saveScore(session.score); // ✅ This makes sure score gets saved
    }
  }, [gameState]);

  // FIXED TIMER FUNCTIONALITY: Use a React effect to manage the timer based on game state
  useEffect(() => {
      // Only run timer when game state is 'playing' and question isn't answered
      if (gameState === 'playing' && !isAnswered) {
        console.log("Starting timer - game state is 'playing' and question is not answered");
  
        // Set initial timer value based on game mode
        const initialTime = session.gameMode === 'normal' ? 20 : 15;
        setTimerValue(initialTime);
        setShowTimerWarning(false);
  
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
  
        // Start new timer
        timerRef.current = setInterval(() => {
          setTimerValue(prev => {
            // Show warning when time is running low
            if (prev <= 5 && prev > 0) {
              setShowTimerWarning(true);
            }
  
            // Time's up!
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
        // Clean up timer when not in playing state or question is answered
        if (timerRef.current) {
          console.log("Clearing timer - game state is not 'playing' or question is answered");
          clearInterval(timerRef.current);
        }
      }
  
      return () => {
        // Clean up timer when component unmounts or gameState changes
        if (timerRef.current) {
          console.log("Cleaning up timer in effect cleanup");
          clearInterval(timerRef.current);
        }
      };
    }, [gameState, isAnswered, session.gameMode]);

    

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
              <span className={`trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}`}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
              </span>
              <span className="text-muted-foreground text-sm">
                Row {session.currentRow}
              </span>
            </div>

            <h3 className="trivia-question">{currentTriviaItem.question}</h3>

            <div className="grid grid-cols-1 gap-3">
              {currentTriviaItem.options.map((option: Option) => {
                // Check if this option should be hidden (for 50/50 powerup)
                if (fiftyFiftyOptions && !fiftyFiftyOptions[option.id]) {
                  return null;
                }

                let optionClasses: string = "trivia-option";

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
                }
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
                  {currentTriviaItem.collectible?.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible?.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible?.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible?.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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
        <Head title={StudyQuest - Level ${session.level} Complete} />
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
                    disabled={isRestarting}
                  >
                    Advance to Level {session.level + 1}
                  </button>
                  <button
                    onClick={() => handleRestartGame(session.gameMode)}
                    className="trivia-button bg-secondary"
                    disabled={isRestarting}
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
                  <Button
                    onClick={() => handleRestartGame('normal')}
                    className="trivia-button"
                    disabled={isRestarting}
                  >
                    {isRestarting ? 'Restarting...' : 'Play Again'}
                  </Button>

                  {session.gameMode === 'normal' ? (
                    <Button
                      onClick={() => switchGameMode('suddenDeath')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Try Sudden Death Mode'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => switchGameMode('normal')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Return to Normal Mode'}
                    </Button>
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
        <Head title={StudyQuest - Level ${session.level}} />
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
      <Head title={StudyQuest - Level ${session.level}} />

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

              <button
                    onClick={toggle}
                    className="px-3 py-1 text-sm rounded-full bg-muted text-primary"
                >
                    {enabled ? '🔊 Sound: On' : '🔇 Sound: Off'}
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
              <span className={trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
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
                  {currentTriviaItem.collectible.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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
        <Head title={StudyQuest - Level ${session.level} Complete} />
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
                    disabled={isRestarting}
                  >
                    Advance to Level {session.level + 1}
                  </button>
                  <button
                    onClick={() => handleRestartGame(session.gameMode)}
                    className="trivia-button bg-secondary"
                    disabled={isRestarting}
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
                  <Button
                    onClick={() => handleRestartGame('normal')}
                    className="trivia-button"
                    disabled={isRestarting}
                  >
                    {isRestarting ? 'Restarting...' : 'Play Again'}
                  </Button>

                  {session.gameMode === 'normal' ? (
                    <Button
                      onClick={() => switchGameMode('suddenDeath')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Try Sudden Death Mode'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => switchGameMode('normal')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Return to Normal Mode'}
                    </Button>
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
        <Head title={StudyQuest - Level ${session.level}} />
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
      <Head title={StudyQuest - Level ${session.level}} />

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
              <span className={`trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}`}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
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
                  {currentTriviaItem.collectible.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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
        <Head title={StudyQuest - Level ${session.level} Complete} />
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
                    disabled={isRestarting}
                  >
                    Advance to Level {session.level + 1}
                  </button>
                  <button
                    onClick={() => handleRestartGame(session.gameMode)}
                    className="trivia-button bg-secondary"
                    disabled={isRestarting}
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
                  <Button
                    onClick={() => handleRestartGame('normal')}
                    className="trivia-button"
                    disabled={isRestarting}
                  >
                    {isRestarting ? 'Restarting...' : 'Play Again'}
                  </Button>

                  {session.gameMode === 'normal' ? (
                    <Button
                      onClick={() => switchGameMode('suddenDeath')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Try Sudden Death Mode'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => switchGameMode('normal')}
                      className="trivia-button bg-secondary"
                      disabled={isRestarting}
                    >
                      {isRestarting ? 'Switching Mode...' : 'Return to Normal Mode'}
                    </Button>
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
        <Head title={StudyQuest - Level ${session.level}} />
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
      <Head title={StudyQuest - Level ${session.level}} />

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
              <span className={`trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}`}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
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
                  {currentTriviaItem.collectible.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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
        <Head title={StudyQuest - Level ${session.level} Complete} />
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
                    disabled={isRestarting}
                  >
                    Advance to Level {session.level + 1}
                  </button>
                  <button
                    onClick={() => handleRestartGame(session.gameMode)}
                    className="trivia-button bg-secondary"
                    disabled={isRestarting}
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
        <Head title={StudyQuest - Level ${session.level}} />
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
      <Head title={StudyQuest - Level ${session.level}} />

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
              <span className={`trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}`}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
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
                  {currentTriviaItem.collectible.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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
        <Head title={StudyQuest - Level ${session.level} Complete} />
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
        <Head title={StudyQuest - Level ${session.level}} />
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
      <Head title={StudyQuest - Level ${session.level}} />

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

              <button
                    onClick={toggle}
                    className="px-3 py-1 text-sm rounded-full bg-muted text-primary"
                >
                    {enabled ? '🔊 Sound: On' : '🔇 Sound: Off'}
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
              <span className={trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
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
                  {currentTriviaItem.collectible.rarity === 'LEGENDARY'
                    ? '🌟 LEGENDARY COLLECTIBLE UNLOCKED!'
                    : currentTriviaItem.collectible.rarity === 'VERY RARE'
                      ? '✨✨ You discovered a VERY RARE collectible!'
                      : currentTriviaItem.collectible.rarity === 'RARE'
                        ? '✨ You found a RARE collectible!'
                        : currentTriviaItem.collectible.rarity === 'COMMON'
                          ? '✓ You found a COMMON collectible!'
                          : '✓ You found a NORMAL collectible!'}
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


