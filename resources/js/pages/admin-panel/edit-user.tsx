import React from 'react';
import { useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: User;
}

export default function EditUser({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                alert('User updated successfully!');
            },
        });
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>

                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
