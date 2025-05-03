// resources/js/pages/Leaderboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { LeaderboardEntry, UserRank } from '@/types/';
import { Link } from '@inertiajs/react';

// Breadcrumbs
const breadcrumbs = [
  {
    title: 'Leaderboard',
    href: '/leaderboard',
  },
];

// Props interface
interface LeaderboardProps {
  normalLeaderboard?: LeaderboardEntry[];
  suddenDeathLeaderboard?: LeaderboardEntry[];
  userRankNormal?: UserRank;
  userRankSuddenDeath?: UserRank;
  activeMode?: 'normal' | 'suddenDeath';
  allUsers: LeaderboardEntry[];
}

export default function Leaderboard({
  normalLeaderboard = [],
  suddenDeathLeaderboard = [],
  userRankNormal = { rank: null, score: null, total: 0 },
  userRankSuddenDeath = { rank: null, score: null, total: 0 },
  activeMode = 'normal',
  allUsers = [],
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<string>(activeMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Validate data on component mount


  // Get current user rank data based on active tab
  function mergeAllUsersWithScores(entries: LeaderboardEntry[], users: LeaderboardEntry[]) {
    const userMap = new Map<string, LeaderboardEntry>();

    for (const user of users) {
      userMap.set(user.user, {
        user: user.user,
        score: 0,
        level: 1,
        streak: 0,
        collectibles: 0,
        date: user.date ?? 'N/A',
      });
    }

    for (const entry of entries) {
      userMap.set(entry.user, entry); // If score exists, override it
    }

    return Array.from(userMap.values()).sort((a, b) => b.score - a.score);
  }


// 🛠 New merged leaderboards (replacing filteredNormalLeaderboard and filteredSuddenDeathLeaderboard)
const mergedNormalLeaderboard = useMemo(() => {
    return mergeAllUsersWithScores(normalLeaderboard, allUsers);
  }, [normalLeaderboard, allUsers]);

  const mergedSuddenDeathLeaderboard = useMemo(() => {
    return mergeAllUsersWithScores(suddenDeathLeaderboard, allUsers);
  }, [suddenDeathLeaderboard, allUsers]);

  // 🛠 Function to find user's rank dynamically
  function findUserRank(entries: LeaderboardEntry[], username: string) {
    const sorted = [...entries].sort((a, b) => b.score - a.score);
    const index = sorted.findIndex((entry) => entry.user === username);
    return index !== -1 ? index + 1 : null;
  }




  // Render leaderboard table
  const renderLeaderboardTable = (entries: LeaderboardEntry[]) => {
    if (hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">Failed to load leaderboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 animate-pulse bg-muted rounded"></div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-right">Score</th>
              <th className="p-3 text-right hidden md:table-cell">Level</th>
              <th className="p-3 text-right hidden md:table-cell">Streak</th>
              <th className="p-3 text-right hidden md:table-cell">Collectibles</th>
              <th className="p-3 text-right hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <tr key={index} className="border-b border-muted hover:bg-muted/40">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{entry.user}</td>
                  <td className="p-3 text-right font-bold">{entry.score.toLocaleString()}</td>
                  <td className="p-3 text-right hidden md:table-cell">{entry.level}</td>
                  <td className="p-3 text-right hidden md:table-cell">{entry.streak}</td>
                  <td className="p-3 text-right hidden md:table-cell">{entry.collectibles}</td>
                  <td className="p-3 text-right hidden md:table-cell">{entry.date || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                  No leaderboard entries found. Be the first to play and set a high score!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render mobile leaderboard view
  const renderMobileLeaderboard = (entries: LeaderboardEntry[]) => {
    if (hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">Failed to load leaderboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-4 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse bg-muted rounded"></div>
          ))}
        </div>
      );
    }

    return (
      <div className="md:hidden space-y-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={index} className="bg-card p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">#{index + 1} {entry.user}</div>
                <div className="text-right font-bold">{entry.score.toLocaleString()} pts</div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>Level {entry.level}</div>
                <div>Streak: {entry.streak}</div>
                <div>Items: {entry.collectibles}</div>
              </div>
              {entry.date && (
                <div className="text-right text-xs text-muted-foreground mt-2">
                  {entry.date}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No leaderboard entries found. Be the first to play!
          </div>
        )}
      </div>
    );
  };

  // Get current user rank data based on active tab

  // 🛠 New renderUserRank to fix YOUR RANK section
const renderUserRank = () => {
    const entries = activeTab === 'normal' ? mergedNormalLeaderboard : mergedSuddenDeathLeaderboard;
    const currentUser = entries.find(entry => entry.user === authUser); // You must get current user
    const rank = findUserRank(entries, authUser);

    if (hasError) {
      return (
        <div className="p-4 text-center text-red-500">
          Unable to load your rank data.
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="p-4 flex justify-center items-center gap-6">
          <div className="h-16 w-24 animate-pulse bg-muted rounded"></div>
          <div className="h-16 w-24 animate-pulse bg-muted rounded"></div>
        </div>
      );
    }

    if (!rank) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          You don't have a rank yet. Play a game to get on the leaderboard!
        </div>
      );
    }

    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <h3 className="text-sm uppercase font-medium text-muted-foreground mb-2">
          Your Rank
        </h3>
        <div className="flex justify-center items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Rank</div>
            <div className="text-2xl font-bold">#{rank}</div>
            <div className="text-xs text-muted-foreground">of {entries.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Score</div>
            <div className="text-2xl font-bold">{currentUser?.score?.toLocaleString() || 0}</div>
          </div>
        </div>
      </div>
    );
  };


  // Get user rank display

  // Custom tab implementation
  const TabView = () => {
    return (
      <div className="mb-6">
        <div className="flex border-b border-muted mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'normal'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('normal')}
          >
            Normal Mode
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'suddenDeath'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('suddenDeath')}
          >
            Sudden Death
          </button>

          <div className="ml-auto text-sm text-muted-foreground self-center pr-2">
            Updated in real-time
          </div>
        </div>

        <div className="bg-card shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b border-muted">
            <h2 className="text-xl font-bold">
              {activeTab === 'normal' ? 'Normal Mode' : 'Sudden Death Mode'} Leaderboard
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'normal'
                ? 'Players with highest scores in standard gameplay'
                : 'Master players who survived with only one heart'}
            </p>
          </div>

          <div className="p-4">
            {renderUserRank()}

            <div className="mt-6">
            {activeTab === 'normal' && (
                <>
                    {renderLeaderboardTable(filteredNormalLeaderboard)}
                    {renderMobileLeaderboard(filteredNormalLeaderboard)}
                </>
                )}

                {activeTab === 'suddenDeath' && (
                <>
                    {renderLeaderboardTable(filteredSuddenDeathLeaderboard)}
                    {renderMobileLeaderboard(filteredSuddenDeathLeaderboard)}
                </>
                )}

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="StudyQuest - Leaderboard" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">See how you stack up against other history scholars!</p>
          </div>

          <TabView />

          <div className="mt-8 bg-muted rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">How to climb the leaderboard</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Answer questions correctly to earn points and increase your streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Rarer questions give higher streak bonuses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Use powerups strategically - Double Points can really boost your score!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Complete higher levels for bigger challenges and rewards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Try Sudden Death mode if you're feeling confident!</span>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
                <Link
                    href="/play"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                    Play Now
                </Link>
                </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
