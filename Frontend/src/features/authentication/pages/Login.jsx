import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/auth.js";
import { useAuthHandle } from "../hooks/useAuthForm.jsx";
import { Link } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import InlineLoader from "@/components/ui/InlineLoader.jsx";

const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const { onSubmit, loading } = useAuthHandle({ type: "login", reset });

    return (
        <AuthWrapper>
            <div className='flex-1 flex items-center justify-center px-6'>
                <div className='w-full max-w-md rounded-xl border border-zinc-200  bg-white  p-8'>
                    {/* Header */}
                    <div className='mb-6'>
                        <h1 className='text-2xl font-semibold tracking-tight'>
                            Welcome back
                        </h1>
                        <p className='text-sm text-zinc-500 mt-1'>
                            Sign in to manage your store and orders
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className='space-y-4'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Email */}
                        <Input
                            label={"Email"}
                            error={errors.email?.message}
                            {...register("email")}
                            type='email'
                            placeholder='you@example.com'
                        />

                        {/* Password */}
                        <Input
                            label={"Password"}
                            error={errors.password?.message}
                            {...register("password")}
                            type='password'
                            placeholder='••••••••'
                        />

                        {/* Remember / Forgot */}
                        <div className='flex items-center justify-between text-sm text-zinc-600 '>
                            <label className='flex items-center gap-2'>
                                <input
                                    type='checkbox'
                                    className='rounded border-zinc-300 '
                                />
                                Remember me
                            </label>
                            <Link to='#' className=' '>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Button */}
                        <Button size={"lg"} className={"w-full"} type='submit'>
                            {loading ? (
                                <InlineLoader content='Logging in...' />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className='text-sm text-center text-zinc-500  mt-6'>
                        Don’t have an account?
                        <Link
                            to='/user/signup'
                            className='ml-1 text-zinc-900  hover:underline'
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </AuthWrapper>
    );
};

export default Login;
