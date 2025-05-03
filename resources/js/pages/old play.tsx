import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Types
interface Option {
  id: string;
  text: string;
}

interface Collectible {
  name: string;
  rarity: 'NORMAL' | 'COMMON' | 'RARE' | 'VERY RARE' | 'LEGENDARY';
  image: string;
  bonus?: string;
  description?: string;
}

interface TriviaItem {
  id: number;
  category: string;
  rarity: 'NORMAL' | 'COMMON' | 'RARE' | 'VERY RARE' | 'LEGENDARY';
  question: string;
  options: Option[];
  correctAnswer: string;
  revealText: string;
  streakBonus: number;
  collectible: Collectible;
  row: number; // row 1, 2, or 3
  completed?: boolean;
}

interface PowerUp {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FiftyFiftyOption {
  [key: string]: boolean;
}

interface Clue {
  level: number;
  text: string;
  cost: number;
}

interface CluesData {
  question_id: number;
  category: string;
  clues: Clue[];
}

// Row completion tracking
interface RowStatus {
  row1Completed: boolean;
  row2Completed: boolean;
  row3Completed: boolean;
}

// Breadcrumbs
const breadcrumbs = [
  {
    title: 'Play',
    href: '/play',
  },
];

// Clues data - inline instead of importing
const cluesData: CluesData[] = [
  {
    question_id: 1,
    category: "Bayani (Hero)",
    clues: [
      {
        level: 1,
        text: "Think about how Rizal needed to communicate secretly with his family before his execution.",
        cost: 0
      },
      {
        level: 2,
        text: "This item was purposely chosen because Spanish guards wouldn't think to search inside it.",
        cost: 100
      },
      {
        level: 3,
        text: "The hidden item was a written document, not a physical object or coded message.",
        cost: 200
      }
    ]
  },
  {
    question_id: 2,
    category: "Lugar (Place)",
    clues: [
      {
        level: 1,
        text: "Consider the major European powers of the late 19th century.",
        cost: 0
      },
      {
        level: 2,
        text: "Rizal visited countries in Western and Central Europe, but not Eastern Europe.",
        cost: 100
      },
      {
        level: 3,
        text: "The country in question was ruled by the Tsars during Rizal's time.",
        cost: 200
      }
    ]
  },
  {
    question_id: 3,
    category: "Dokumento (Document)",
    clues: [
      {
        level: 1,
        text: "Rizal wrote two major novels that criticized Spanish colonial rule.",
        cost: 0
      },
      {
        level: 2,
        text: "His second novel had a much darker tone than his first work.",
        cost: 100
      },
      {
        level: 3,
        text: "The title translates to 'The Reign of Greed' in English.",
        cost: 200
      }
    ]
  },
  {
    question_id: 4,
    category: "Pangyayari (Event)",
    clues: [
      {
        level: 1,
        text: "This organization's name comes from the Tagalog word 'Katipun' meaning 'gathering' or 'association'.",
        cost: 0
      },
      {
        level: 2,
        text: "Members of this society used the code name 'Águila Blanca' (White Eagle).",
        cost: 100
      },
      {
        level: 3,
        text: "This group used a secret alphabet and had a blood compact ritual for new members.",
        cost: 200
      }
    ]
  },
  {
    question_id: 5,
    category: "Petsa (Date)",
    clues: [
      {
        level: 1,
        text: "This event happened during the Spanish-American War.",
        cost: 0
      },
      {
        level: 2,
        text: "It occurred in the town of Kawit, Cavite.",
        cost: 100
      },
      {
        level: 3,
        text: "This event happened in June, and is now celebrated as a national holiday.",
        cost: 200
      }
    ]
  },
  {
    question_id: 6,
    category: "Bayani (Hero)",
    clues: [
      {
        level: 1,
        text: "This figure had a physical disability but was known for his brilliant mind.",
        cost: 0
      },
      {
        level: 2,
        text: "He served as the first Prime Minister of the Philippines.",
        cost: 100
      },
      {
        level: 3,
        text: "He wrote 'The True Decalogue', a set of rules for the Philippines' revolutionary government.",
        cost: 200
      }
    ]
  },
  {
    question_id: 7,
    category: "Lugar (Place)",
    clues: [
      {
        level: 1,
        text: "This island is located at the entrance of Manila Bay.",
        cost: 0
      },
      {
        level: 2,
        text: "It was a key defensive position during World War II.",
        cost: 100
      },
      {
        level: 3,
        text: "It's also known as 'The Rock' and was the site of General MacArthur's famous 'I shall return' promise.",
        cost: 200
      }
    ]
  },
  {
    question_id: 8,
    category: "Pangyayari (Event)",
    clues: [
      {
        level: 1,
        text: "This event happened during Ferdinand Marcos' presidency.",
        cost: 0
      },
      {
        level: 2,
        text: "It suspended many civil liberties and allowed for warrantless arrests.",
        cost: 100
      },
      {
        level: 3,
        text: "It was enacted through Proclamation No. 1081 and lasted for 9 years.",
        cost: 200
      }
    ]
  },
  {
    question_id: 9,
    category: "Dokumento (Document)",
    clues: [
      {
        level: 1,
        text: "This agreement was signed to promote peace in Mindanao.",
        cost: 0
      },
      {
        level: 2,
        text: "The signing came after 17 years of negotiations with a Muslim separatist group.",
        cost: 100
      },
      {
        level: 3,
        text: "It led to the creation of the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM).",
        cost: 200
      }
    ]
  }
];

// Power-ups
const powerUps: PowerUp[] = [
  { id: 'shuffle', name: 'Shuffle', icon: '🔄', description: 'Changes the current question card' },
  { id: 'shield', name: 'Shield', icon: '🛡️', description: 'Protects you from losing a heart' },
  { id: 'fifty-fifty', name: '50/50', icon: '50/50', description: 'Removes two incorrect answers' },
  { id: 'double-points', name: 'Double Points', icon: '2x', description: 'Doubles points for one question' },
  { id: 'heal', name: 'Heal', icon: '❤️', description: 'Restores one heart' }
];

// Sample trivia data
const sampleData: TriviaItem[] = [
  // Row 1 Questions
  {
    id: 1,
    category: 'Bayani (Hero)',
    rarity: 'RARE',
    question: 'Before his execution in 1896, José Rizal gave his family a small alcohol burner (lamp). What was secretly hidden inside it?',
    options: [
      { id: 'a', text: 'A map to hidden treasure' },
      { id: 'b', text: 'An unpublished poem' },
      { id: 'c', text: 'A secret letter to his family' },
      { id: 'd', text: 'A coded message to the revolution' }
    ],
    correctAnswer: 'c',
    revealText: 'You found a RARE collectible: "Rizal\'s Hidden Letter"! ✨\n\nThe night before his execution, Rizal secretly hid his final letter (now known as "Mi último adiós" or "My Last Farewell") inside a small alcohol lamp and gave it to his sister. He knew the Spanish authorities wouldn\'t allow him to send messages, so he cleverly smuggled out his final goodbye! This poem is now considered one of the finest patriotic poems ever written in the Philippines.',
    streakBonus: 300,
    collectible: {
      name: 'Rizal\'s Hidden Letter',
      rarity: 'RARE',
      image: '/images/collectibles/rizal-letter.png'
    },
    row: 1
  },
  {
    id: 2,
    category: 'Lugar (Place)',
    rarity: 'VERY RARE',
    question: 'In which European country did José Rizal NOT study or live during his travels abroad?',
    options: [
      { id: 'a', text: 'Germany' },
      { id: 'b', text: 'Russia' },
      { id: 'c', text: 'Spain' },
      { id: 'd', text: 'France' }
    ],
    correctAnswer: 'b',
    revealText: 'You discovered a VERY RARE collectible: "Rizal\'s European Passport"! ✨✨\n\nWhile Rizal was extensively traveled throughout Europe, studying medicine, languages, and the arts, he never set foot in Russia! His European journey took him to Spain, France, Germany, Belgium, Austria, Switzerland, Italy, and England. During these travels, he mastered multiple languages and studied ophthalmology, becoming the first documented Filipino ophthalmologist!',
    streakBonus: 500,
    collectible: {
      name: 'Rizal\'s European Passport',
      rarity: 'VERY RARE',
      image: '/images/collectibles/rizal-passport.png'
    },
    row: 1
  },
  {
    id: 3,
    category: 'Dokumento (Document)',
    rarity: 'LEGENDARY',
    question: 'Which of Rizal\'s novels was considered more revolutionary and led to Spanish authorities labeling him a dangerous rebel?',
    options: [
      { id: 'a', text: 'Noli Me Tángere' },
      { id: 'b', text: 'El Filibusterismo' },
      { id: 'c', text: 'Makamisa' },
      { id: 'd', text: 'Junto Al Pasig' }
    ],
    correctAnswer: 'b',
    revealText: '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "El Fili Original Manuscript Page"! 🌟\n\nEl Filibusterismo (The Reign of Greed), Rizal\'s second novel, was darker and more revolutionary than his first. While Noli Me Tángere exposed colonial abuses, El Fili directly advocated for Philippine independence through more radical means! The Spanish authorities were so threatened by its contents that possessing a copy became evidence of sedition. Hidden within its pages were coded messages that fueled the revolutionary spirit!',
    streakBonus: 1000,
    collectible: {
      name: 'El Fili Original Manuscript Page',
      rarity: 'LEGENDARY',
      image: '/images/collectibles/el-fili-manuscript.png',
      bonus: 'Unlocks "Rizal\'s Phantom Portrait" profile frame'
    },
    row: 1
  },

  // Row 2 Questions
  {
    id: 4,
    category: 'Pangyayari (Event)',
    rarity: 'RARE',
    question: 'What was the name of the Filipino revolutionary society founded by Andres Bonifacio in 1892?',
    options: [
      { id: 'a', text: 'La Liga Filipina' },
      { id: 'b', text: 'Katipunan' },
      { id: 'c', text: 'Propaganda Movement' },
      { id: 'd', text: 'Magdalo' }
    ],
    correctAnswer: 'b',
    revealText: 'You found a RARE collectible: "Katipunan Membership Card"! ✨\n\nThe Katipunan (full name: Kataastaasang, Kagalanggalangang Katipunan ng mga Anak ng Bayan) was a Philippine revolutionary society founded by Andres Bonifacio on July 7, 1892. Its goal was to gain independence from Spain through armed revolt. The Katipunan was initially a secret organization until its discovery by Spanish authorities in 1896, which led to the Philippine Revolution!',
    streakBonus: 300,
    collectible: {
      name: 'Katipunan Membership Card',
      rarity: 'RARE',
      image: '/images/collectibles/katipunan-card.png'
    },
    row: 2
  },
  {
    id: 5,
    category: 'Petsa (Date)',
    rarity: 'VERY RARE',
    question: 'When was Philippine independence officially proclaimed?',
    options: [
      { id: 'a', text: 'June 12, 1898' },
      { id: 'b', text: 'July 4, 1946' },
      { id: 'c', text: 'August 13, 1898' },
      { id: 'd', text: 'January 23, 1899' }
    ],
    correctAnswer: 'a',
    revealText: 'You discovered a VERY RARE collectible: "Philippine Declaration of Independence"! ✨✨\n\nOn June 12, 1898, General Emilio Aguinaldo proclaimed the independence of the Philippines from Spain in Kawit, Cavite. The declaration was written by Ambrosio Rianzares Bautista in Spanish, and the Philippine flag was officially unfurled for the first time. However, Spain did not recognize this declaration and instead ceded the Philippines to the United States in the Treaty of Paris, which led to the Philippine-American War.',
    streakBonus: 500,
    collectible: {
      name: 'Philippine Declaration of Independence',
      rarity: 'VERY RARE',
      image: '/images/collectibles/declaration-independence.png'
    },
    row: 2
  },
  {
    id: 6,
    category: 'Bayani (Hero)',
    rarity: 'COMMON',
    question: 'Who is known as the "Sublime Paralytic" in Philippine history?',
    options: [
      { id: 'a', text: 'Jose Rizal' },
      { id: 'b', text: 'Andres Bonifacio' },
      { id: 'c', text: 'Apolinario Mabini' },
      { id: 'd', text: 'Emilio Aguinaldo' }
    ],
    correctAnswer: 'c',
    revealText: 'You found a COMMON collectible: "Mabini\'s Wheelchair"! ✨\n\nApolinario Mabini was known as the "Sublime Paralytic" because despite being paralyzed from the waist down due to polio, he served as the first Prime Minister of the Philippines and was a highly intellectual revolutionary leader. His brilliant mind helped shape the Philippine government during the revolution against Spain.',
    streakBonus: 200,
    collectible: {
      name: 'Mabini\'s Wheelchair',
      rarity: 'COMMON',
      image: '/images/collectibles/mabini-wheelchair.png'
    },
    row: 2
  },

  // Row 3 Questions
  {
    id: 7,
    category: 'Lugar (Place)',
    rarity: 'NORMAL',
    question: 'Which island in the Philippines was called "The Fortress Island" during World War II?',
    options: [
      { id: 'a', text: 'Corregidor' },
      { id: 'b', text: 'Palawan' },
      { id: 'c', text: 'Mindoro' },
      { id: 'd', text: 'Samar' }
    ],
    correctAnswer: 'a',
    revealText: 'You found a NORMAL collectible: "Corregidor Memorial Badge"! ✨\n\nCorregidor, also known as "The Rock," was called "The Fortress Island" during World War II due to its strategic defensive position at the entrance of Manila Bay. It played a crucial role in the defense of Manila against Japanese forces and was the site of several significant battles.',
    streakBonus: 100,
    collectible: {
      name: 'Corregidor Memorial Badge',
      rarity: 'NORMAL',
      image: '/images/collectibles/corregidor-badge.png'
    },
    row: 3
  },
  {
    id: 8,
    category: 'Pangyayari (Event)',
    rarity: 'RARE',
    question: 'What event on September 21, 1972, changed the course of modern Philippine history?',
    options: [
      { id: 'a', text: 'The Battle of Manila' },
      { id: 'b', text: 'Declaration of Martial Law' },
      { id: 'c', text: 'EDSA Revolution' },
      { id: 'd', text: 'Philippine Independence' }
    ],
    correctAnswer: 'b',
    revealText: 'You found a RARE collectible: "Martial Law Proclamation"! ✨\n\nOn September 21, 1972, President Ferdinand Marcos signed Proclamation No. 1081, declaring martial law throughout the Philippines. This began a 9-year period of authoritarian rule, censorship, and human rights violations that profoundly shaped modern Philippine history and politics.',
    streakBonus: 300,
    collectible: {
      name: 'Martial Law Proclamation',
      rarity: 'RARE',
      image: '/images/collectibles/martial-law-document.png'
    },
    row: 3
  },
  {
    id: 9,
    category: 'Dokumento (Document)',
    rarity: 'NORMAL',
    question: 'What was the name of the peace agreement between the Philippine government and the Moro Islamic Liberation Front in 2014?',
    options: [
      { id: 'a', text: 'Tripoli Agreement' },
      { id: 'b', text: 'Bangsamoro Accord' },
      { id: 'c', text: 'Comprehensive Agreement on the Bangsamoro' },
      { id: 'd', text: 'Mindanao Peace Treaty' }
    ],
    correctAnswer: 'c',
    revealText: 'You found a NORMAL collectible: "Peace Treaty Pen"! ✨\n\nThe Comprehensive Agreement on the Bangsamoro (CAB) was signed on March 27, 2014, after 17 years of negotiations. This peace agreement aimed to end the decades-long conflict in Mindanao and established the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM).',
    streakBonus: 100,
    collectible: {
      name: 'Peace Treaty Pen',
      rarity: 'NORMAL',
      image: '/images/collectibles/peace-treaty-pen.png'
    },
    row: 3
  }
];

// Main component
export default function TriviaGame() {
  // State variables
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(1);
  const [currentRow, setCurrentRow] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [availablePowerUps, setAvailablePowerUps] = useState<string[]>([]);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'gameOver' | 'levelComplete'>('playing');
  const [collectedItems, setCollectedItems] = useState<Collectible[]>([]);
  const [fiftyFiftyOptions, setFiftyFiftyOptions] = useState<FiftyFiftyOption | null>(null);
  const [showCollectibleModal, setShowCollectibleModal] = useState<boolean>(false);
  const [currentCollectible, setCurrentCollectible] = useState<Collectible | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('Welcome to StudyQuest! Answer Philippine history trivia to collect rare items!');
  const [aiMood, setAiMood] = useState<'happy' | 'excited' | 'sad' | 'worried'>('happy');
  const [rowStatus, setRowStatus] = useState<RowStatus>({
    row1Completed: false,
    row2Completed: false,
    row3Completed: false
  });
  const [timerValue, setTimerValue] = useState<number>(20); // 20 seconds per question
  const [gameMode, setGameMode] = useState<'normal' | 'suddenDeath'>('normal');
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimerWarning, setShowTimerWarning] = useState<boolean>(false);

  // Clue system state
  const [currentClueLevel, setCurrentClueLevel] = useState<number>(0);
  const [clueUsed, setClueUsed] = useState<boolean>(false);
  const [availableClues, setAvailableClues] = useState<{level: number, used: boolean}[]>([
    {level: 1, used: false},
    {level: 2, used: false},
    {level: 3, used: false}
  ]);

  // Generate trivia data for each level and row
  const generateTriviaData = (level: number): TriviaItem[] => {
    // This would normally be fetched from an API based on level difficulty
    // For now, we'll just use sample data with row assignments

    // Adjust difficulty based on level
    if (level > 1) {
      // For higher levels, we'd increase difficulty by reducing timer,
      // increasing question complexity, etc.
      return sampleData.map(item => ({
        ...item,
        // Example of making questions harder in higher levels
        streakBonus: item.streakBonus * level // Higher rewards for higher difficulty
      }));
    }

    return sampleData;
  };

  const [triviaData, setTriviaData] = useState<TriviaItem[]>(generateTriviaData(level));

  // Initialize game
  useEffect(() => {
    // Start with one random power-up
    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)].id;
    setAvailablePowerUps([randomPowerUp]);

    // Set up timer for first question
    startTimer();

    return () => {
      // Clear timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Change timer duration based on game mode
  useEffect(() => {
    const baseTime = gameMode === 'normal' ? 20 : 15; // 15 seconds for sudden death
    setTimerValue(baseTime);
  }, [gameMode]);

  // Timer handler
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set initial timer value based on game mode
    const initialTime = gameMode === 'normal' ? 20 : 15;
    setTimerValue(initialTime);
    setShowTimerWarning(false);

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
  };

  // Handle time up
  const handleTimeUp = () => {
    if (gameState !== 'playing') return;

    // Player loses a heart when time runs out
    if (activePowerUp === 'shield') {
      setAiMessage("Shield activated! Your heart is protected from the timer.");
      setActivePowerUp(null);
    } else {
      setHearts(prev => prev - 1);
      setStreak(0);
      setAiMood('sad');
      setAiMessage("Time's up! You lost a heart.");
    }

    setIsAnswered(true);
    setGameState('revealed');
  };

  // Streak handler
  useEffect(() => {
    if (streak === 3) {
      setAiMessage("You're becoming a history scholar! Keep it up!");
      setAiMood('excited');

      // 30% chance to get a power-up at 3 streak
      if (Math.random() < 0.3) {
        addRandomPowerUp();
      }
    } else if (streak === 5) {
      setAiMessage("Impressive knowledge! Rizal would be proud!");
      setAiMood('excited');
      addRandomPowerUp(); // Guaranteed power-up at 5 streak
    } else if (streak === 10) {
      setAiMessage("LEGENDARY STREAK! You're writing your own place in history!");
      setAiMood('excited');
      addRandomPowerUp();
      addRandomPowerUp(); // Two power-ups at 10 streak
    }
  }, [streak]);

  // Add power-up
  const addRandomPowerUp = () => {
    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)].id;
    setAvailablePowerUps(prev => [...prev, randomPowerUp]);
  };

  // Check if a row is completed
  const checkRowCompletion = () => {
    const currentRowQuestions = triviaData.filter(q => q.row === currentRow);
    const completedRowQuestions = currentRowQuestions.filter(q =>
      completedQuestions.includes(q.id)
    );

    // If all questions in the current row are completed
    if (completedRowQuestions.length === currentRowQuestions.length) {
      setRowStatus(prev => {
        const newStatus = { ...prev };
        if (currentRow === 1) newStatus.row1Completed = true;
        if (currentRow === 2) newStatus.row2Completed = true;
        if (currentRow === 3) newStatus.row3Completed = true;
        return newStatus;
      });

      // Move to next row if available
      if (currentRow < 3) {
        setAiMessage(`Great job! You've completed Row ${currentRow}. Moving to Row ${currentRow + 1}.`);
        setAiMood('excited');
        setCurrentRow(currentRow + 1);
      } else {
        // All rows completed, level finished
        setGameState('levelComplete');
        setAiMessage("Amazing! You've completed all rows for this level!");
        setAiMood('excited');
      }
    }
  };

  // Get clue for current question
  const getClue = (level: number): void => {
    // Find clues for current question
    const clueData = cluesData.find(c => c.question_id === triviaData[currentQuestion].id);
    if (!clueData) {
      setAiMessage("Sorry, no hints available for this question.");
      setAiMood('sad');
      return;
    }

    // Find requested clue level
    const clue = clueData.clues.find(c => c.level === level);
    if (!clue) {
      setAiMessage("No more hints available.");
      setAiMood('sad');
      return;
    }

    // Check if player has enough points for paid clues
    if (clue.cost > 0 && score < clue.cost) {
      setAiMessage(`You need ${clue.cost} more points to unlock this clue.`);
      setAiMood('worried');
      return;
    }

    // Deduct points if it's a paid clue
    if (clue.cost > 0) {
      setScore(prev => prev - clue.cost);
    }

    // Mark clue as used
    setAvailableClues(prev =>
      prev.map(c => c.level === level ? {...c, used: true} : c)
    );

    setCurrentClueLevel(level);
    setClueUsed(true);
    setAiMood('excited');
    setAiMessage(`CLUE: ${clue.text}`);
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
  const handleAnswerSelect = (answerId: string) => {
    if (isAnswered || gameState !== 'playing') return;

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSelectedAnswer(answerId);
    setIsAnswered(true);

const currentTriviaItem = triviaData[currentQuestion];

    // Mark question as completed
    setCompletedQuestions(prev => [...prev, currentTriviaItem.id]);

    if (answerId === currentTriviaItem.correctAnswer) {
      // Correct answer
      const pointsToAdd = activePowerUp === 'double-points'
        ? 100 + currentTriviaItem.streakBonus * 2
        : 100 + currentTriviaItem.streakBonus;

      setScore(prev => prev + pointsToAdd);
      setStreak(prev => prev + 1);
      setAiMood('excited');
      setAiMessage(`Correct! ${activePowerUp === 'double-points' ? 'DOUBLE POINTS!' : ''}`);

      // Award collectible based on rarity chance
      const randomValue = Math.random();
      let awardedCollectible = null;

      if (randomValue < 0.05) { // 5% chance for Legendary
        awardedCollectible = currentTriviaItem.collectible;
      } else if (randomValue < 0.15) { // 10% chance for Very Rare
        awardedCollectible = currentTriviaItem.collectible;
      } else if (randomValue < 0.25) { // 10% chance for Rare
        awardedCollectible = currentTriviaItem.collectible;
      } else if (randomValue < 0.35) { // 10% chance for Common
        awardedCollectible = currentTriviaItem.collectible;
      } else if (randomValue < 0.45) { // 10% chance for Normal
        awardedCollectible = currentTriviaItem.collectible;
      }

      if (awardedCollectible) {
        setCurrentCollectible(awardedCollectible);
        setCollectedItems(prev => [...prev, awardedCollectible]);
        setShowCollectibleModal(true);

        // Auto-close modal and go to next question after 3 seconds
        setTimeout(() => {
          setShowCollectibleModal(false);
          handleNextQuestion();
        }, 3000);
      }  else {
        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      }


      // Check row completion
      checkRowCompletion();

    } else {
      // Incorrect answer
      if (activePowerUp === 'shield') {
        setAiMessage("Shield activated! Your heart is protected this round.");
      } else {
        setHearts(prev => prev - 1);
        setStreak(0);
        setAiMood('sad');
        setAiMessage(`That's not correct. The answer was ${getOptionTextById(currentTriviaItem.correctAnswer)}`);
      }
    }

    setGameState('revealed');

    // Reset active power-up after use
    if (activePowerUp) {
      setActivePowerUp(null);
    }

    // Auto-load next question after a 3-second delay
    setTimeout(() => {
    handleNextQuestion();
  }, 3000);

  };

  // Get option text by ID
  const getOptionTextById = (optionId: string): string => {
    const option = triviaData[currentQuestion].options.find(opt => opt.id === optionId);
    return option ? option.text : '';
  };

  // Handle next question
  const handleNextQuestion = () => {
    // Game over check
    if (hearts <= 0) {
      setGameState('gameOver');
      return;
    }

    // Level complete check
    if (rowStatus.row1Completed && rowStatus.row2Completed && rowStatus.row3Completed) {
      setGameState('levelComplete');
      return;
    }

    // Reset power-up state globally just in case
    setFiftyFiftyOptions(null);

    // Reset clue-related states
    resetClues();

    // Find next question in current row
    const currentRowQuestions = triviaData.filter(q => q.row === currentRow);
    const unansweredQuestions = currentRowQuestions.filter(q =>
      !completedQuestions.includes(q.id)
    );

    if (unansweredQuestions.length > 0) {
      // Delay loading the next question to allow short transition/animation (Patch 3)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const nextQuestionIndex = triviaData.findIndex(
          q => q.id === unansweredQuestions[randomIndex].id
        );

        setCurrentQuestion(nextQuestionIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setGameState('playing');
        setAiMessage('What do you know about this piece of Philippine history?');
        setAiMood('happy');
        setShowCollectibleModal(false);

        // Restart timer
        startTimer();
      }, 1000); // 1-second delay for smooth transition
    } else {
      // All questions in current row are answered
      if (currentRow < 3) {
        setTimeout(() => {
          const nextRow = currentRow + 1;
          setCurrentRow(nextRow);

          const nextRowQuestions = triviaData.filter(q => q.row === nextRow);
          const nextQuestionIndex = triviaData.findIndex(
            q => q.id === nextRowQuestions[0].id
          );

          setCurrentQuestion(nextQuestionIndex);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setGameState('playing');
          setAiMessage(`Moving to Row ${nextRow}!`);
          setAiMood('excited');
          setShowCollectibleModal(false);

          // Restart timer
          startTimer();
        }, 1000); // delay for smooth transition
      } else {
        // All rows completed
        setGameState('levelComplete');
      }
    }
  };


  // Handle level completion
  const handleNextLevel = () => {
    // Increase level
    setLevel(prev => prev + 1);

    // Reset row status
    setRowStatus({
      row1Completed: false,
      row2Completed: false,
      row3Completed: false
    });

    // Reset row and question
    setCurrentRow(1);

    // Generate new trivia data for next level
    const newTriviaData = generateTriviaData(level + 1);
    setTriviaData(newTriviaData);

    // Go to first question
    setCurrentQuestion(0);

    // Reset game state
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFiftyFiftyOptions(null);
    setGameState('playing');
    setCompletedQuestions([]);

    // Keep streak but reset power-ups
    setAvailablePowerUps([powerUps[Math.floor(Math.random() * powerUps.length)].id]);
    setActivePowerUp(null);

    // Set AI message
    setAiMessage(`Level ${level + 1} begins! The questions will be more challenging now.`);
    setAiMood('excited');

    // Restart timer
    startTimer();
  };

  // Handle game restart
  const handleRestartGame = () => {
    setLevel(1);
    setCurrentRow(1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setHearts(gameMode === 'normal' ? 3 : 1);
    setAvailablePowerUps([powerUps[Math.floor(Math.random() * powerUps.length)].id]);
    setActivePowerUp(null);
    setGameState('playing');
    setCollectedItems([]);
    setFiftyFiftyOptions(null);
    setShowCollectibleModal(false);
    setAiMessage('Welcome back! Ready for more Philippine history trivia?');
    setAiMood('happy');
    setRowStatus({
      row1Completed: false,
      row2Completed: false,
      row3Completed: false
    });
    setCompletedQuestions([]);
    setTriviaData(generateTriviaData(1));
    resetClues();

    // Restart timer
    startTimer();
  };

  // Switch game mode
  const switchGameMode = (mode: 'normal' | 'suddenDeath') => {
    setGameMode(mode);
    handleRestartGame();

    if (mode === 'suddenDeath') {
      setHearts(1);
      setAiMessage('Sudden Death mode activated! You only have one heart. Good luck!');
      setAiMood('worried');
    }
  };

  // Power-up usage
  const usePowerUp = (powerUpId: string) => {
    if (gameState !== 'playing' || isAnswered) return;

    setActivePowerUp(powerUpId);
    setAvailablePowerUps(prev => prev.filter(id => id !== powerUpId));

    if (powerUpId === 'fifty-fifty') {
      const currentTriviaItem = triviaData[currentQuestion];
      const correctAnswerId = currentTriviaItem.correctAnswer;

      // Get all incorrect answer IDs
      const incorrectAnswerIds = currentTriviaItem.options
        .filter(option => option.id !== correctAnswerId)
        .map(option => option.id);

      // Randomly select two incorrect answers to remove
      const shuffledIncorrect = (incorrectAnswers: string[]): string[] =>
        incorrectAnswers.sort(() => Math.random() - 0.5);
      const incorrectToRemove = shuffledIncorrect([...incorrectAnswerIds]).slice(0, 2);

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
      if (hearts < 3) {
        setHearts(prev => Math.min(prev + 1, 3));
        setAiMessage("You restored a heart! ❤️");
      } else {
        setAiMessage("You already have maximum hearts!");
        // Return the power-up since it wasn't used
        setAvailablePowerUps(prev => [...prev, powerUpId]);
        setActivePowerUp(null);
      }
    } else if (powerUpId === 'shuffle') {
      // Get all questions from current row
      const currentRowQuestions = triviaData.filter(q => q.row === currentRow);
      const unansweredQuestions = currentRowQuestions.filter(q =>
        !completedQuestions.includes(q.id) && q.id !== triviaData[currentQuestion].id
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

        // Restart timer for new question
        startTimer();
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
    const canAfford = score >= cost || cost === 0;

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

  // Render power-ups UI
  const renderPowerUps = (): React.ReactElement => {
    return (
      <div className="flex space-x-2 mb-4">
        {availablePowerUps.map((powerUpId, index) => {
          const powerUp = powerUps.find(p => p.id === powerUpId);
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

  // Render hearts UI
  const renderHearts = (): React.ReactElement => {
    return (
      <div className="trivia-hearts">
        {[...Array(gameMode === 'normal' ? 3 : 1)].map((_, i) => (
          <span key={i} className="text-2xl">
            {i < hearts ? '❤️' : '🖤'}
          </span>
        ))}
      </div>
    );
  };

  // Render AI assistant
  const renderAI = (): React.ReactElement => {
    let moodEmoji = '😊'; // default happy
    if (aiMood === 'excited') moodEmoji = '🤩';
    if (aiMood === 'sad') moodEmoji = '😢';
    if (aiMood === 'worried') moodEmoji = '😟';

    // Get current question's clue data
    const currentQuestionClues = cluesData.find(c => c.question_id === triviaData[currentQuestion].id)?.clues;
    const currentClue = currentQuestionClues?.find(c => c.level === currentClueLevel);

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
        <div className={`trivia-level-row ${rowStatus.row1Completed ? 'bg-green-600' : currentRow === 1 ? 'bg-primary' : 'bg-secondary'}`}>
          1 {rowStatus.row1Completed && '✓'}
        </div>
        <div className={`trivia-level-row ${rowStatus.row2Completed ? 'bg-green-600' : currentRow === 2 ? 'bg-primary' : 'bg-secondary'}`}>
          2 {rowStatus.row2Completed && '✓'}
        </div>
        <div className={`trivia-level-row ${rowStatus.row3Completed ? 'bg-green-600' : currentRow === 3 ? 'bg-primary' : 'bg-secondary'}`}>
          3 {rowStatus.row3Completed && '✓'}
        </div>
      </div>
    );
  };

  // Render timer
  const renderTimer = (): React.ReactElement => {
    // Calculate percentage for the progress bar
    const maxTime = gameMode === 'normal' ? 20 : 15;
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
              {triviaData[currentQuestion].revealText}
            </p>

            {currentCollectible.bonus && (
              <div className="trivia-collectible-bonus">
                <p>{currentCollectible.bonus}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <p className="text-muted-foreground text-sm italic">Loading next question...</p>
            </div>
        </div>
      </div>
    );
  };

  // Level complete screen
  if (gameState === 'levelComplete') {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`StudyQuest - Level ${level} Complete`} />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card shadow-xl rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-3xl font-bold text-accent mb-4">Level {level} Complete!</h2>
                <p className="text-xl mb-4">You've completed all rows of questions!</p>
                <p className="text-lg mb-8">Current Score: <span className="font-bold text-primary">{score}</span> points</p>

                <div className="bg-muted p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Level {level} Stats</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-card p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Collectibles Earned</p>
                      <p className="text-2xl font-bold">{collectedItems.length}</p>
                    </div>
                    <div className="bg-card p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold">{streak}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNextLevel}
                    className="trivia-button bg-primary"
                  >
                    Advance to Level {level + 1}
                  </button>
                  <button
                    onClick={handleRestartGame}
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
                <p className="text-xl mb-8">You scored <span className="font-bold text-primary">{score}</span> points</p>

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

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRestartGame}
                    className="trivia-button"
                  >
                    Play Again
                  </button>
                  {gameMode === 'normal' ? (
                    <button
                      onClick={() => switchGameMode('suddenDeath')}
                      className="trivia-button bg-secondary"
                    >
                      Try Sudden Death Mode
                    </button>
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

  // Main game screen
  const currentTriviaItem = triviaData[currentQuestion];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`StudyQuest - Level ${level}`} />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="trivia-level">
              <span className="trivia-level-title">Level {level}</span>
              <div className="trivia-level-rows">
                <span className="trivia-level-rows-label">Row:</span>
                {renderRowStatus()}
              </div>
            </div>

            <div className="trivia-stats">
              <div className="trivia-stats-item">
                <div className="trivia-stats-label">Score</div>
                <div className="trivia-stats-value">{score}</div>
              </div>

              <div className="trivia-stats-item">
                <div className="trivia-stats-label">Streak</div>
                <div className="trivia-stats-value">{streak}</div>
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

          {showAiAssistant && (
            <div className="flex items-center justify-between mb-4 bg-secondary/20 p-2 rounded-lg">
              <span className="text-sm font-medium">Need help?</span>
              <div className="flex space-x-2">
                {cluesData.find(c => c.question_id === currentTriviaItem.id)?.clues.map(clue => (
                  <ClueButton
                    key={clue.level}
                    level={clue.level}
                    cost={clue.cost}
                  />
                ))}
              </div>
            </div>
          )}

          {renderTimer()}

          {availablePowerUps.length > 0 && renderPowerUps()}

          <div className="trivia-question-card">
            <div className="flex items-center justify-between mb-4">
              <span className={`trivia-category-badge ${currentTriviaItem.rarity.replace(' ', '-')}`}>
                {currentTriviaItem.category} • {currentTriviaItem.rarity}
              </span>

              <span className="text-muted-foreground text-sm">
                Row {currentRow}
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
                          ? '✨ You found a COMMON collectible!'
                          : '✨ You found a NORMAL collectible!'}
                </p>
                <p className="trivia-reveal-text">{currentTriviaItem.revealText}</p>

                <p className="text-sm text-muted-foreground mt-2">Loading next question...</p>

              </div>
            )}
          </div>
        </div>
      </div>

      {renderCollectibleModal()}
    </AppLayout>
  );
}
