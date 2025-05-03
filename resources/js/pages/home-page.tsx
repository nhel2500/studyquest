import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';


export default function HomePage() {

    const { auth } = usePage<SharedData>().props;

    const userName = auth?.user?.name || 'Scholar';
     const userInitials = userName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

    const headImage = '/img/home-img1.webp';
    const education = '/img/education-img.jpg';
    const history = '/img/history-img.avif';
    const games = '/img/games-img.avif';
  return (
    <AppLayout>
      <Head title="Home - StudyQuest" />

      <div className="min-h-screen bg-[#0D0221] text-white py-10 px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
            {/* Left: User Badge */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold shadow">
                {userInitials}
                </div>
                <span className="text-sm font-medium"> Welcome, {userName}!</span>
            </div>

            {/* Right: Play Now Button */}
            <Link
                href="/play"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition"
            >
                Play Now
            </Link>
            </div>


        {/* Hero Section */}
        {/* Hero Section - Side-by-side format */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16">
            {/* Image Left */}
            <div className="w-full md:w-1/2">
                <img
                src={headImage}
                alt={headImage}
                className="rounded-lg shadow-lg w-full max-w-full"
                />
            </div>

            {/* Text Right */}
            <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">
                Having difficulty learning Philippine history?
                </h2>
                <p className="text-muted-foreground text-sm">
                Introducing <span className="font-semibold text-primary">StudyQuest</span>, an interactive gamified environment for learning Philippine history.
                </p>
            </div>
            </div>


        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#1E003B] border border-purple-500 p-4 rounded-lg shadow-lg text-center">
                <img src={education} alt="Tech" className="mx-auto h-32 mb-3" />
                <h3 className="font-bold text-lg mb-2 text-white">Using Technology with Education</h3>
                <p className="text-sm text-gray-300">We integrate gamification and web technology to make learning engaging and interactive for every learner.</p>
            </div>

            <div className="bg-[#1E003B] border border-purple-500 p-4 rounded-lg shadow-lg text-center">
                <img src={history} alt="Future" className="mx-auto h-32 mb-3" />
                <h3 className="font-bold text-lg mb-2 text-white">Moving thru the Future</h3>
                <p className="text-sm text-gray-300">Gamified platforms empower students to take control of their own pace and enjoy meaningful learning experiences.</p>
            </div>

            <div className="bg-[#1E003B] border border-purple-500 p-4 rounded-lg shadow-lg text-center">
                <img src={games} alt="Gaming" className="mx-auto h-32 mb-3" />
                <h3 className="font-bold text-lg mb-2 text-white">Using Games as Stepping Stone</h3>
                <p className="text-sm text-gray-300">By combining learning objectives with game mechanics, students are more motivated and engaged.</p>
            </div>
        </div>



        {/* Objectives Section */}
        <div className="bg-[#1E003B] border border-purple-500 p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center text-white">Objectives</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm">
                <li>To develop a web application that has a gamified learning process in order to aid students in a gamified learning domain.</li>
                <li>To introduce fresh resources and methods for learning more about Philippine History to BSGS students of St. Clare College of Caloocan.</li>
                <li>To provide insight into the differences between traditional and gamified learning.</li>
                <li>To apply a set strategy for gamified learning that incorporates gaming components.</li>
            </ul>
            </div>
        </div>
    </AppLayout>
  );
}
