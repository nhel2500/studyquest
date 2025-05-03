import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

interface ProfileForm {
  name: string;
  email: string;
  bio: string;
  profile_photo: File | null;
  cover_photo: File | null;
  [key: string]: string | File | null;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, errors, processing } = useForm<ProfileForm>({
    name: auth.user.name ?? '',
    email: auth.user.email ?? '',
    bio: auth.user.bio ?? '',
    profile_photo: null,
    cover_photo: null,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('bio', data.bio);

    if (data.profile_photo) {
      formData.append('profile_photo', data.profile_photo);
    }

    if (data.cover_photo) {
      formData.append('cover_photo', data.cover_photo);
    }

    formData.append('_method', 'PATCH');

    router.post(route('profile.update'), formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Your profile has been updated successfully.',
          confirmButtonColor: '#6366f1',
        });
      },
      onError: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was a problem saving your profile.',
          confirmButtonColor: '#ef4444',
        });
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your profile details below" />

          <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="mt-1 block w-full"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                placeholder="Full name"
              />
              <InputError className="mt-2" message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                placeholder="Email address"
              />
              <InputError className="mt-2" message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="mt-1 block w-full rounded border p-2"
                value={data.bio}
                onChange={(e) => setData('bio', e.target.value)}
                placeholder="Tell something about yourself..."
              />
              <InputError className="mt-2" message={errors.bio} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile_photo">Profile Photo</Label>
              <input
                type="file"
                id="profile_photo"
                accept="image/*"
                onChange={(e) => setData('profile_photo', e.target.files?.[0] ?? null)}
              />
              <InputError className="mt-2" message={errors.profile_photo} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover_photo">Cover Photo</Label>
              <input
                type="file"
                id="cover_photo"
                accept="image/*"
                onChange={(e) => setData('cover_photo', e.target.files?.[0] ?? null)}
              />
              <InputError className="mt-2" message={errors.cover_photo} />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={processing}>Save</Button>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
