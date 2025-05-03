import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guide',
        href: '/guide',
    },
];

export default function Guide() {
    const [activeTab, setActiveTab] = useState('gameplay');

    const tabContent = {
        gameplay: (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Game Basics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">How to Play</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 font-semibold mr-2">1</span>
                                <span>Answer Philippine history trivia questions from different categories</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 font-semibold mr-2">2</span>
                                <span>Start with 3 hearts - each wrong answer costs a heart</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 font-semibold mr-2">3</span>
                                <span>Build a streak of correct answers to earn power-ups</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 font-semibold mr-2">4</span>
                                <span>Collect historical items of different rarities</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">Question Categories</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-yellow-50 rounded-md">
                                <p className="font-medium text-yellow-700">Lugar (Place)</p>
                                <p className="text-sm text-gray-600">Historical locations</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-md">
                                <p className="font-medium text-blue-700">Pangyayari (Event)</p>
                                <p className="text-sm text-gray-600">Historical events</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-md">
                                <p className="font-medium text-green-700">Bayani (Hero)</p>
                                <p className="text-sm text-gray-600">Historical figures</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md">
                                <p className="font-medium text-purple-700">Petsa (Date)</p>
                                <p className="text-sm text-gray-600">Important dates</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-md col-span-2">
                                <p className="font-medium text-red-700">Dokumento (Document)</p>
                                <p className="text-sm text-gray-600">Historical documents</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Game Flow</h4>
                    <ol className="relative border-l border-gray-200 ml-3 pl-6 space-y-6">
                        <li className="mb-6">
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Start Game</h5>
                            <p className="text-gray-700">Begin with 3 hearts and choose from question cards arranged in 3 rows of 10 questions each</p>
                        </li>
                        <li className="mb-6">
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Answer Questions</h5>
                            <p className="text-gray-700">Answer correctly to increase your score and build your streak</p>
                        </li>
                        <li className="mb-6">
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Use Power-Ups</h5>
                            <p className="text-gray-700">Strategically use power-ups to advance further</p>
                        </li>
                        <li>
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Level Up</h5>
                            <p className="text-gray-700">Complete all three rows to advance to the next level with harder questions</p>
                        </li>
                    </ol>
                </div>
            </div>
        ),
        powerups: (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Power-Ups</h3>
                <p className="text-gray-700">Power-ups are special abilities that help you progress in the game. You have approximately a 30% chance to earn a power-up for every 3 correct answers.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-blue-700 text-xl">🔄</span>
                            </div>
                            <h4 className="text-lg font-semibold">Shuffle</h4>
                        </div>
                        <p className="text-gray-700">Changes the current question card if you're not confident about the answer</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span className="text-green-700 text-xl">🛡️</span>
                            </div>
                            <h4 className="text-lg font-semibold">Shield</h4>
                        </div>
                        <p className="text-gray-700">Protects you from losing a heart for one incorrect answer</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                <span className="text-purple-700 text-xl">50/50</span>
                            </div>
                            <h4 className="text-lg font-semibold">50/50</h4>
                        </div>
                        <p className="text-gray-700">Removes two incorrect answers, making it easier to choose the right one</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                <span className="text-yellow-700 text-xl">2x</span>
                            </div>
                            <h4 className="text-lg font-semibold">Double Points</h4>
                        </div>
                        <p className="text-gray-700">Doubles the points earned for one question (can be stacked for even more points)</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                <span className="text-red-700 text-xl">❤️</span>
                            </div>
                            <h4 className="text-lg font-semibold">Heal</h4>
                        </div>
                        <p className="text-gray-700">Restores one heart if you don't already have the maximum</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Power-Up Tips</h4>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Save your Shield power-up for harder questions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Use 2x power-ups on questions you're confident about</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Power-ups are reset when advancing to the next level, so use them before completing all rows</span>
                        </li>
                    </ul>
                </div>
            </div>
        ),
        collectibles: (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Collectibles</h3>
                <p className="text-gray-700">Earn collectibles by answering questions correctly. Each item represents a piece of Philippine history.</p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Normal</h4>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">45%</span>
                        </div>
                        <p className="text-sm text-gray-600">10 items including Katipunan Seal, Jose Rizal's Quill, and more</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-green-800">Common</h4>
                            <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-700">35%</span>
                        </div>
                        <p className="text-sm text-gray-600">5 items including Old Katipunero Mask, Baybayin Tablet, and more</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800">Rare</h4>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">25%</span>
                        </div>
                        <p className="text-sm text-gray-600">3 items including Andres Bonifacio's Red Scarf and Bolo Knife</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-purple-800">Very Rare</h4>
                            <span className="text-xs bg-purple-100 px-2 py-1 rounded-full text-purple-700">15%</span>
                        </div>
                        <p className="text-sm text-gray-600">2 items: Luna's War Medallion and Actual Katipunan Oath Paper</p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-yellow-800">Legendary</h4>
                            <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full text-yellow-700">5%</span>
                        </div>
                        <p className="text-sm text-gray-600">1 item: Rizal's Phantom Journal</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mt-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Collection Benefits</h4>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Track your collection progress in the Collectibles tab</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Mark your favorite collectibles to display them prominently</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Learn fascinating Philippine history facts with each collectible</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Complete your collection to unlock special profile customizations</span>
                        </li>
                    </ul>
                </div>
            </div>
        ),
        modes: (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Game Modes</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-blue-700 text-2xl">🏫</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800">Normal Mode</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Start with 3 hearts</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Standard timer for each question</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Progress through levels with increasing difficulty</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Complete 10 runs to unlock Sudden Death Mode</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                <span className="text-red-700 text-2xl">💀</span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800">Sudden Death Mode</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Start with only 1 heart</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Faster timer for each question</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>Higher score multipliers</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 mr-2">•</span>
                                <span>For experienced players looking for a challenge</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Level Progression</h4>
                    <ol className="relative border-l border-gray-200 ml-3 pl-6 space-y-4">
                        <li className="mb-4">
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Row Completion</h5>
                            <p className="text-gray-700">A green check mark appears when you complete a row of questions</p>
                        </li>
                        <li className="mb-4">
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Level Advancement</h5>
                            <p className="text-gray-700">Complete all three rows to advance to the next level</p>
                        </li>
                        <li>
                            <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-2"></div>
                            <h5 className="text-lg font-semibold text-gray-900">Power-Up Reset</h5>
                            <p className="text-gray-700">Power-ups are reset between levels, but your streak is maintained</p>
                        </li>
                    </ol>
                </div>
            </div>
        ),
        ai: (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">AI Assistant Feature</h3>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                            <span className="text-purple-700 text-2xl">🤖</span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800">Meet Your AI Guide</h4>
                    </div>
                    <p className="text-gray-700 mb-4">Our friendly AI assistant will help you navigate the game and learn more about Philippine history.</p>

                    <h5 className="font-semibold text-gray-800 mb-2">AI Assistant Features:</h5>
                    <ul className="space-y-2 text-gray-700 mb-6">
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Provides trivia prompts with interesting historical facts</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Guides new players through the tutorial</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Offers clues when you're stuck on a question</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span>Changes facial expressions to react to your gameplay</span>
                        </li>
                    </ul>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-2">AI Assistant Settings</h5>
                        <p className="text-gray-700">You can toggle the AI assistant on or off in the settings menu. The assistant is enabled by default to help guide new players.</p>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guide" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-900">Game Guide</h2>
                                <div className="flex items-center space-x-2">
                                    <button className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 active:bg-red-700 transition ease-in-out duration-150">
                                        Watch Tutorial
                                    </button>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 mb-6">
                                <nav className="flex space-x-8" aria-label="Tabs">
                                    <button
                                        className={`${
                                            activeTab === 'gameplay'
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('gameplay')}
                                    >
                                        Gameplay Basics
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === 'powerups'
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('powerups')}
                                    >
                                        Power-Ups
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === 'collectibles'
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('collectibles')}
                                    >
                                        Collectibles
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === 'modes'
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('modes')}
                                    >
                                        Game Modes
                                    </button>
                                    <button
                                        className={`${
                                            activeTab === 'ai'
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('ai')}
                                    >
                                        AI Assistant
                                    </button>
                                </nav>
                            </div>

                            {tabContent[activeTab]}

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Pro Tip</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>For the best experience, complete the tutorial before diving into gameplay. This will help you understand all game mechanics and maximize your score!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
