import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Welcome() {
  const { auth } = usePage<Partial<SharedData>>().props; // ✅ use Partial here

  const logo = '/official_logo.png';
  const bannerPath = '/img/banner 2.webp';
  const bannerPath2 = '/img/banner 3.webp';


    return (
        <>

            <Head title="Rogue-Lite Philippine History Trivia Game">
                <style>{`
                    :root {
                        --primary-color: #7e20dc;
                        --secondary-color: #9d4edd;
                        --background-dark: #1a0b2e;
                        --background-darker: #13091f;
                        --text-light: #ffffff;
                        --text-dim: #b8c1ec;
                    }

                    body {
                        font-family: 'Poppins', sans-serif;
                        background-color: var(--background-dark);
                        color: var(--text-light);
                    }

                    .glow-text {
                        text-shadow: 0 0 10px rgba(126, 32, 220, 0.7), 0 0 20px rgba(126, 32, 220, 0.5);
                    }

                    .floating {
                        animation: float 4s ease-in-out infinite;
                    }

                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }

                    /* Custom scroll bar */
                    ::-webkit-scrollbar {
                        width: 10px;
                    }

                    ::-webkit-scrollbar-track {
                        background: var(--background-darker);
                    }

                    ::-webkit-scrollbar-thumb {
                        background: var(--primary-color);
                        border-radius: 5px;
                    }

                    ::-webkit-scrollbar-thumb:hover {
                        background: var(--secondary-color);
                    }

                    /* Button glow effect */
                    .btn-glow {
                        box-shadow: 0 0 15px rgba(126, 32, 220, 0.5);
                        transition: all 0.3s ease;
                    }

                    .btn-glow:hover {
                        box-shadow: 0 0 20px rgba(126, 32, 220, 0.8);
                        transform: translateY(-2px);
                    }

                    /* Card hover effects */
                    .feature-card {
                        transition: all 0.3s ease;
                        border: 1px solid rgba(126, 32, 220, 0.3);
                    }

                    .feature-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 10px 25px rgba(126, 32, 220, 0.5);
                        border: 1px solid rgba(126, 32, 220, 0.6);
                    }

                    html {
                        scroll-behavior:smooth;
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-[#1a0b2e] text-white">
                {/* Header/Navbar */}
                <header className="fixed w-full bg-[#13091f] bg-opacity-90 z-50 shadow-lg">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex justify-between items-center">
                        <img  src={logo} alt="GameVerse Logo" className="h-14 w-auto sm:h-10 md:h-12 object-contain mr-2 transition-all duration-300" />
                            <nav className="hidden md:flex space-x-8">
                                <a href="#home" className="text-white hover:text-purple-300 transition">Home</a>
                                <a href="#features" className="text-white hover:text-purple-300 transition">Features</a>
                                <a href="#community" className="text-white hover:text-purple-300 transition">Community</a>
                            </nav>

                            <div className="flex space-x-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 rounded-lg bg-transparent border border-[#7e20dc] text-white hover:bg-[#7e20dc] transition"
                                >
                                    Dashboard
                                </Link>
                                ) : (
                                <>
                                    <Link
                                    href={route('login')}
                                    className="px-4 py-2 rounded-lg bg-transparent border border-[#7e20dc] text-white hover:bg-[#7e20dc] transition"
                                    >
                                    Log in
                                    </Link>
                                    <Link
                                    href={route('register')}
                                    className="px-4 py-2 rounded-lg bg-[#7e20dc] text-white hover:bg-purple-700 transition btn-glow"
                                    >
                                    Register
                                    </Link>
                                </>
                                )}


                            </div>

                            <div className="md:hidden">
                                <button className="text-white">
                                    <i className="fas fa-bars"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="pt-24 min-h-screen flex items-center" id="home">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 mb-8 md:mb-0">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 glow-text">Rogue-Lite Philippine History Trivia Game</h1>
                                    <p className="text-xl text-gray-300 mb-6">Rogue-Lite Philippine History Trivia Game</p>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="text-center">
                                        <img src={bannerPath}  alt={bannerPath}  className="mx-auto floating rounded-xl shadow-2xl" style={{ boxShadow: '0 0 30px rgba(126, 32, 220, 0.5)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16 bg-[#13091f]" id="features">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-3 glow-text">Featured Games</h2>
                                <p className="text-xl text-gray-300 max-w-2xl mx-auto">Experience gaming like never before with our state-of-the-art platform</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Feature Card 1 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
                                    <p className="text-gray-300">Create your gaming profile directly or sign in with your Google account for a seamless experience.</p>
                                </div>

                                {/* Feature Card 2 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-trophy"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Leaderboards</h3>
                                    <p className="text-gray-300">Compete with players worldwide and see your name climb the rankings on our dynamic leaderboards.</p>
                                </div>

                                {/* Feature Card 3 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-robot"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                                    <p className="text-gray-300">Meet your in-game companion that offers trivia, guides you through tutorials, and provides helpful clues.</p>
                                </div>

                                {/* Feature Card 4 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-lightbulb"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Interactive Trivia</h3>
                                    <p className="text-gray-300">Learn fascinating historical facts while playing with our AI-powered trivia prompts throughout your game.</p>
                                </div>

                                {/* Feature Card 5 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-smile"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Expressive Mascot</h3>
                                    <p className="text-gray-300">Our AI assistant mascot displays a range of emotions to enhance your gaming experience with personality.</p>
                                </div>

                                {/* Feature Card 6 */}
                                <div className="feature-card bg-[#1a0b2e] rounded-xl p-6 hover:shadow-lg">
                                    <div className="text-[#7e20dc] text-3xl mb-4">
                                        <i className="fas fa-toggle-on"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Customizable Experience</h3>
                                    <p className="text-gray-300">Toggle the AI assistant on or off based on your preferences for a personalized gaming experience.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Community Section */}
                    <section className="py-16" id="community">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-3 glow-text">Join Our Community</h2>
                                <p className="text-xl text-gray-300 max-w-2xl mx-auto">Connect with players and enhance your gaming experience</p>
                            </div>
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="md:w-1/2 mb-8 md:mb-0">
                                    <img src={bannerPath2}  alt={bannerPath2}   className="rounded-xl shadow-2xl" style={{ boxShadow: '0 0 30px rgba(126, 32, 220, 0.3)' }} />
                                </div>
                                <div className="md:w-1/2 md:pl-12">
                                    <h3 className="text-2xl font-semibold mb-6 text-[#9d4edd]">Community Features</h3>

                                    <div className="flex mb-6">
                                        <div className="mr-4 text-[#7e20dc] text-2xl">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-semibold mb-1">Player Connections</h5>
                                            <p className="text-gray-300">Compare scores with friends and invite them to join your gaming sessions.</p>
                                        </div>
                                    </div>

                                    <div className="flex mb-6">
                                        <div className="mr-4 text-[#7e20dc] text-2xl">
                                            <i className="fas fa-ranking-star"></i>
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-semibold mb-1">Global Rankings</h5>
                                            <p className="text-gray-300">Track your progress against players worldwide with real-time leaderboard updates.</p>
                                        </div>
                                    </div>

                                    <div className="flex mb-6">
                                        <div className="mr-4 text-[#7e20dc] text-2xl">
                                            <i className="fas fa-share-alt"></i>
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-semibold mb-1">Share Your Achievements</h5>
                                            <p className="text-gray-300">Show off your gaming milestones on social media with one-click sharing.</p>
                                        </div>
                                    </div>

                                    <button className="px-6 py-3 rounded-lg bg-[#7e20dc] text-white hover:bg-purple-700 transition btn-glow">Join Now</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-[#13091f] py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">GameVerse</h3>
                                <p className="text-gray-300 mb-4">An intelligent gaming platform with personalized AI assistance. Create an account, compete on leaderboards, and enjoy an enhanced gaming experience.</p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-white hover:text-[#7e20dc] transition"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="text-white hover:text-[#7e20dc] transition"><i className="fab fa-twitter"></i></a>
                                    <a href="#" className="text-white hover:text-[#7e20dc] transition"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                                <div className="flex flex-col space-y-2">
                                    <a href="#home" className="text-gray-300 hover:text-white transition">Home</a>
                                    <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
                                    <a href="#community" className="text-gray-300 hover:text-white transition">Community</a>
                                    <Link href={route('login')} className="text-gray-300 hover:text-white transition">Login</Link>
                                    <Link href={route('register')} className="text-gray-300 hover:text-white transition">Sign Up</Link>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-lg font-semibold mb-4">Support</h5>
                                <div className="flex flex-col space-y-2">
                                    <a href="#" className="text-gray-300 hover:text-white transition">Help Center</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">FAQ</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">Contact Us</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-lg font-semibold mb-4">Connect</h5>
                                <div className="flex flex-col space-y-2">
                                    <a href="#" className="text-gray-300 hover:text-white transition">Leaderboards</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">AI Assistant</a>
                                    <a href="#" className="text-gray-300 hover:text-white transition">Share Scores</a>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                            <p className="text-gray-400">© 2025 GameVerse. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
