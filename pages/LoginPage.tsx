import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AtSign, KeyRound, ClipboardCheck, Facebook, Linkedin, CheckCircle, User as UserIcon } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.654 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691c-1.219 2.44-1.936 5.18-1.936 8.179c0 3.001.717 5.74 1.936 8.179l-5.022 3.91c-2.203-4.32-3.414-9.39-3.414-14.829c0-5.438 1.211-10.509 3.414-14.829L6.306 14.691z" />
      <path fill="#4CAF50" d="M24 48c5.655 0 10.742-1.823 14.829-4.89l-5.022-3.91c-2.44 1.218-5.179 1.935-8.179 1.935c-5.18 0-9.62-3.343-11.303-7.962L2.613 36.87C6.864 43.816 14.792 48 24 48z" />
      <path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l5.022 3.91c4.32-2.202 7.82-6.522 9.25-11.774c.251-1.26.389-2.577.389-3.917z" />
    </svg>
  );

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('evaluator@innomatics.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [registerData, setRegisterData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'evaluator@innomatics.com' && password === 'password123') {
      login({ email });
    } else {
      setError('Invalid credentials. Please use the default values.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
      e.preventDefault();
      if(resetEmail) {
          setIsEmailSent(true);
      }
  }

  const closeForgotPasswordModal = () => {
      setIsForgotPasswordOpen(false);
      setTimeout(() => {
          setResetEmail('');
          setIsEmailSent(false);
      }, 300);
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
      if (registerError) setRegisterError('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setRegisterError('');
      if (registerData.password !== registerData.confirmPassword) {
          setRegisterError("Passwords do not match.");
          return;
      }
      setIsRegistrationComplete(true);
  };

  const closeRegisterModal = () => {
      setIsRegisterOpen(false);
      setTimeout(() => {
          setIsRegistrationComplete(false);
          setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
          setRegisterError('');
      }, 300);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Left Promotional Panel */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-indigo-600 p-12 text-white text-center">
              <h1 className="text-4xl font-bold leading-tight mb-4">Automated OMR Evaluation & Scoring System</h1>
              <p className="text-indigo-100 mb-8">
                  Streamline your examination process with our advanced OMR evaluation technology. Get accurate results instantly.
              </p>
              <ClipboardCheck className="w-40 h-40 text-indigo-300 mb-8"/>
              <p className="font-semibold">Login to access the powerful evaluation tools</p>
          </div>

          {/* Right Login Form Panel */}
          <div className="w-full md:w-1/2 p-8 sm:p-12">
              <div className="w-full max-w-md mx-auto">
                  <h1 className="text-3xl font-bold text-indigo-600">EVALIFY</h1>
                  <p className="text-slate-500 mb-8">Automated OMR Evaluation System</p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                       <div>
                          <label htmlFor="email-address" className="text-sm font-semibold text-slate-700">Username</label>
                          <div className="relative mt-1">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <AtSign className="h-5 w-5 text-slate-400" />
                              </div>
                              <input
                                  id="email-address"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  required
                                  className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Enter your username"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                              />
                          </div>
                      </div>
                       <div>
                          <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                           <div className="relative mt-1">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <KeyRound className="h-5 w-5 text-slate-400" />
                              </div>
                              <input
                                  id="password"
                                  name="password"
                                  type="password"
                                  autoComplete="current-password"
                                  required
                                  className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                              />
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                              <label htmlFor="remember-me" className="ml-2 block text-slate-900">Remember me</label>
                          </div>
                          <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</button>
                      </div>
                      
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      
                      <div>
                          <button
                          type="submit"
                          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                          >
                          Login
                          </button>
                      </div>
                  </form>
                  
                  <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-slate-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-slate-500">Or login with</span>
                      </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Login with Facebook" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-300 text-[#1877F2] hover:bg-slate-50">
                          <Facebook className="w-5 h-5"/>
                      </a>
                      <a href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="Login with Google" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50">
                         <GoogleIcon />
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Login with LinkedIn" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-300 text-[#0A66C2] hover:bg-slate-50">
                          <Linkedin className="w-5 h-5"/>
                      </a>
                  </div>
                  
                  <p className="text-center text-sm text-slate-500 mt-8">
                      Don't have an account? <button type="button" onClick={() => setIsRegisterOpen(true)} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">Register here</button>
                  </p>
              </div>
          </div>
        </div>
      </div>
      
      {isForgotPasswordOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity" 
            aria-labelledby="modal-title" role="dialog" aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all">
            <div className="text-center">
              {!isEmailSent ? (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <KeyRound className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-800" id="modal-title">Forgot Password?</h3>
                  <p className="mt-2 text-slate-500">No problem. Enter your email below and we'll send you a link to reset it.</p>
                  <form onSubmit={handlePasswordReset} className="mt-6 text-left">
                    <div>
                      <label htmlFor="reset-email" className="text-sm font-semibold text-slate-700">Email Address</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AtSign className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="reset-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="you@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Send Reset Link
                      </button>
                      <button
                        type="button"
                        onClick={closeForgotPasswordModal}
                        className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-800">Check your inbox</h3>
                  <div className="mt-4 text-slate-600">
                      <p>We've sent a password reset link to <strong>{resetEmail}</strong>.</p>
                      <p className="mt-2 text-sm text-slate-500 italic">(Please note: This is a demo. No email has actually been sent.)</p>
                  </div>
                  <div className="mt-6">
                      <button
                          type="button"
                          onClick={closeForgotPasswordModal}
                          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                          Close
                      </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isRegisterOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity" 
            aria-labelledby="register-modal-title" role="dialog" aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all">
            <div className="text-center">
              {!isRegistrationComplete ? (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <UserIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-800" id="register-modal-title">Create an Account</h3>
                  <p className="mt-2 text-slate-500">Join Evalify to start evaluating OMR sheets today.</p>
                  <form onSubmit={handleRegisterSubmit} className="mt-6 text-left space-y-4">
                    <div>
                      <label htmlFor="register-name" className="text-sm font-semibold text-slate-700">Full Name</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="register-name" name="name" type="text" required
                          className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="John Doe"
                          value={registerData.name} onChange={handleRegisterChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="register-email" className="text-sm font-semibold text-slate-700">Email Address</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AtSign className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="register-email" name="email" type="email" autoComplete="email" required
                          className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="you@example.com"
                          value={registerData.email} onChange={handleRegisterChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="register-password" className="text-sm font-semibold text-slate-700">Password</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="register-password" name="password" type="password" required
                          className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="••••••••"
                          value={registerData.password} onChange={handleRegisterChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="register-confirm-password" className="text-sm font-semibold text-slate-700">Confirm Password</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="register-confirm-password" name="confirmPassword" type="password" required
                          className="block w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="••••••••"
                          value={registerData.confirmPassword} onChange={handleRegisterChange}
                        />
                      </div>
                    </div>
                    {registerError && <p className="text-sm text-red-600">{registerError}</p>}
                    <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                      <button type="submit" className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Create Account
                      </button>
                      <button type="button" onClick={closeRegisterModal} className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-800">Registration Successful!</h3>
                  <div className="mt-4 text-slate-600">
                      <p>Welcome, <strong>{registerData.name}</strong>! Your account has been created.</p>
                      <p className="mt-2 text-sm text-slate-500 italic">(Please note: This is a demo. No account has actually been created. You can log in with the default credentials.)</p>
                  </div>
                  <div className="mt-6">
                      <button
                          type="button"
                          onClick={closeRegisterModal}
                          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                          Close
                      </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;