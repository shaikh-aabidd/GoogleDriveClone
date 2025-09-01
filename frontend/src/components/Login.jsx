// src/pages/Login.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../features/api/user.api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, logout} from '../features/auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [serverError, setServerError] = useState('');
  const location = useLocation();
  console.log("Login page `from` state:", location.state);

  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    setServerError(''); // Clear previous errors
    try {
      const response = await login(data).unwrap();
      const user = response.data.user;
      dispatch(setCredentials(user));
      
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err?.data?.message || 'Login failed. Please check your credentials.');
      dispatch(logout()); // Ensure user is logged out on failed login
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
        <h2 className="text-4xl font-display font-bold text-center mb-8 text-gray-800">
          Welcome Back to <span className="text-primary">SnapSkill</span>
        </h2>

        {serverError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-xl flex-shrink-0" />
            <p className="text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-800"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-800"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary-light text-white font-semibold py-3 px-4 rounded-lg shadow-md
                       hover:from-primary-dark hover:to-primary transition-all duration-300
                       flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-dark hover:underline transition-colors duration-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;