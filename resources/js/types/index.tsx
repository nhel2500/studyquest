// resources/js/types/index.tsx

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    avatar?: string;
    description?: string;
    bio?: string;
    profile_photo_url?: string;
    cover_photo_url?: string;
    created_at: string;
  }



  export interface PageProps {
    user: User;
    errors: Record<string, string[]>;
    // Add any other global props needed
  }

  // Trivia Game Types
  export interface Option {
    id: string;
    text: string;
  }

  export interface Collectible {
    name: string;
    rarity: 'NORMAL' | 'COMMON' | 'RARE' | 'VERY RARE' | 'LEGENDARY';
    image: string;
    bonus?: string;
    description?: string;
  }

  export interface TriviaItem {
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

  export interface PowerUp {
    id: string;
    name: string;
    icon: string;
    description: string;
  }

  export interface FiftyFiftyOption {
    [key: string]: boolean;
  }

  export interface Clue {
    level: number;
    text: string;
    cost: number;
  }

  export interface CluesData {
    question_id: number;
    category: string;
    clues: Clue[];
  }

  // Row completion tracking
  export interface RowStatus {
    row1Completed: boolean;
    row2Completed: boolean;
    row3Completed: boolean;
  }

  // Game session state
  export interface GameSession {
    id: number;
    level: number;
    currentRow: number;
    score: number;
    streak: number;
    hearts: number;
    gameMode: 'normal' | 'suddenDeath';
  }

  // Full game data from the API
  export interface GameData {
    session: GameSession;
    triviaData: TriviaItem[];
    cluesData: CluesData[];
    powerUps: string[];
    collectedItems: Collectible[];
    rowStatus: RowStatus;
    completedQuestions: number[];
    leaderboard: LeaderboardEntry[];
  }

  // Leaderboard entry
  export interface LeaderboardEntry {
    user: string;
    score: number;
    level: number;
    streak: number;
    collectibles: number;
    date?: string;
  }

  // Answer submission response
  export interface AnswerResponse {
    success: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    collectibleAwarded: Collectible | null;
    gameState: 'playing' | 'revealed' | 'gameOver' | 'levelComplete';
    session: GameSession;
  }

  // Clue response
  export interface ClueResponse {
    success: boolean;
    clue: Clue;
    updatedScore: number;
    message?: string;
  }

  // User rank in leaderboard
  export interface UserRank {
    rank: number | null;
    score: number | null;
    total: number;
  }

  export interface SharedData {
    auth: {
      user: User;
    };
    [key: string]: any; // ✅ allow other props to pass through (required by Inertia)
  }

    export interface BreadcrumbItem {
        title: string;
        href: string;
    }
