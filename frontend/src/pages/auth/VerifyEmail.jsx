import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation, useResendOTPMutation } from '../../store/api/authApi';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (data) => {
    try {
      await verifyEmail(data).unwrap();
      toast.success('Email verified successfully! You can now sign in.');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error.data?.message || 'Verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email }).unwrap();
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to your email address
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...register('otp', {
              required: 'Verification code is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'Please enter a 6-digit code',
              },
            })}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/auth/login')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
