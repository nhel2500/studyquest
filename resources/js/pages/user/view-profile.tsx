import { usePage, Link, Head } from '@inertiajs/react';
import type { SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';

export default function ViewProfile() {
    const { auth } = usePage<SharedData>().props;

    if (!auth?.user) return <div className="text-center p-8">No profile found.</div>;

    return (
        <AppLayout breadcrumbs={[{ title: 'View Profile', href: '/view-profile' }]}>
            <Head title="View Profile" />

            <div className="bg-background rounded-xl shadow-sm overflow-hidden">
                {/* Cover Photo */}
                <div className="h-64 bg-gray-800 relative">
                    {auth.user.cover_photo_url ? (
                        <img
                            src={auth.user.cover_photo_url}
                            alt="Cover"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-lg font-semibold">
                            No cover photo uploaded
                        </div>
                    )}

                    {/* Profile Picture */}
                    <div className="absolute left-6 -bottom-20">
                        {auth.user.profile_photo_url ? (
                            <img
                                src={auth.user.profile_photo_url}
                                alt="Profile"
                                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-gray-400 flex items-center justify-center text-white text-3xl">
                                {auth.user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                </div>

                {/* User Info */}
                <div className="mt-20 px-6 pb-10">
                <div className="mt-20 px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left: Name and Bio */}
                    <div className="max-w-4xl flex-1">
                        <h1 className="text-2xl font-bold text-white mb-5 mt-5">{auth.user.name}</h1>
                        {auth.user.bio && (
                            <p className="text-gray-300 text-sm leading-relaxed text-justify whitespace-pre-wrap">
                                {auth.user.bio}
                            </p>
                        )}
                    </div>

                    {/* Right: Edit Profile Button */}
                    <div className="flex-shrink-0 min-w-[130px] md:mt-0 text-end">
                        <Link
                            href={route('profile.edit')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition inline-block"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>




                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-lg shadow-sm">
                            <p className="text-xs text-muted-foreground">Email Address</p>
                            <p className="text-sm font-medium text-foreground">{auth.user.email}</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg shadow-sm">
                            <p className="text-xs text-muted-foreground">Unique ID</p>
                            <p className="text-sm font-medium text-foreground">#{auth.user.id}</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg shadow-sm">
                            <p className="text-xs text-muted-foreground">Join Date</p>
                            <p className="text-sm font-medium text-foreground">
                            {new Date(auth.user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
