import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthHandle } from '../hooks/useAuthForm.jsx';
import { signupSchema } from '../validations/auth.js';
import { Link } from 'react-router-dom';
import AuthWrapper from '../components/AuthWrapper.jsx';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';

const Signup = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const { onSubmit } = useAuthHandle({ type: 'signup', reset });

    return (
        <AuthWrapper>
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Get started with managing your store and orders
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Full Name */}
                        <Input
                            label={'Full name'}
                            error={errors.name?.message}
                            {...register('name')}
                            type="text"
                            placeholder="John Doe"
                        />

                        {/* Email */}
                        <Input
                            label={'Email'}
                            error={errors.email?.message}
                            {...register('email')}
                            type="email"
                            placeholder="you@example.com"
                        />

                        {/* Password */}
                        <Input
                            label={'Password'}
                            error={errors.password?.message}
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                        />

                        {/* Submit */}
                        <Button size="lg" className={'w-full'} type="submit">
                            Create account
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-sm text-center text-zinc-500 mt-6">
                        Already have an account?
                        <Link
                            to="/user/login"
                            className="ml-1 text-zinc-900 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthWrapper>
    );
};

export default Signup;
