import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Inertia } from '@inertiajs/inertia';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing: userProcessing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [processing, setProcessing] = useState(false);

  // Admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = '123456';

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setProcessing(true);

    if (role === 'admin') {
      // Admin login logic
      if (data.email === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
        Inertia.visit('/admin');
      } else {
        alert('Invalid admin credentials.');
        setProcessing(false);
      }
    } else {
      // User login logic (Laravel backend)
      post(route('login'), {
        onFinish: () => {
          reset('password');
          setProcessing(false);
        },
      });
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Head title="Log in" />

      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Username / Email</Label>
            <Input
              id="email"
              type="text"
              required
              autoFocus
              tabIndex={1}
              autoComplete="off"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder={role === 'admin' ? 'Admin username' : 'email@example.com'}
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              required
              tabIndex={2}
              autoComplete="off"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Password"
            />
            <InputError message={errors.password} />
          </div>

          {/* Role toggle */}
          <div className="flex flex-col gap-2">
            <Label>Log in as:</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />
                User
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                Admin
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              onClick={() => setData('remember', !data.remember)}
              tabIndex={3}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={processing || userProcessing}
          >
            {(processing || userProcessing) && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
            Log in
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-2">
            You are currently logging in as: <strong>{role.toUpperCase()}</strong>
          </p>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          Don't have an account?{' '}
          <TextLink href={route('register')} tabIndex={5}>
            Sign up
          </TextLink>
        </div>
      </form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}
