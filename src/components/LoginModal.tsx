"use client";

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loginStep, setLoginStep] = useState<'options' | 'phoneForm' | 'otpForm' | 'emailForm'>('options');
  
  // Yeh ek naya state add kiya hai jo handle karega ke form Login ka hai ya Sign Up ka
  const [isSignUpMode, setIsSignUpMode] = useState(false); 
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setLoginStep('options');
        setIsSignUpMode(false); // Modal band hone par reset ho jaye
        setPhoneNumber('');
        setPhoneError('');
        setEmail('');
        setPassword('');
        setEmailError('');
        setVerifyError('');
        setOtp(['', '', '', '', '', '']);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackClick = () => {
    if (loginStep === 'phoneForm' || loginStep === 'emailForm') {
      setLoginStep('options');
      setIsSignUpMode(false); // Back aane par default options show hon
      setPhoneNumber('');
      setPhoneError('');
      setEmail('');
      setPassword('');
      setEmailError('');
    } else if (loginStep === 'otpForm') {
      setLoginStep('phoneForm');
      setOtp(['', '', '', '', '', '']);
      setVerifyError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.startsWith('0')) val = val.substring(1);
    if (val.length > 10) val = val.substring(0, 10);
    setPhoneNumber(val);
    if (phoneError) setPhoneError(''); 
  };

  const handlePhoneNext = async () => {
    if (phoneNumber.length < 10) {
      setPhoneError('Number incomplete! Please enter exactly 10 digits.');
      return;
    }

    setIsLoading(true);
    setPhoneError('');

    const fullPhone = `92${phoneNumber}`; 

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    if (error) {
      setPhoneError(error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setLoginStep('otpForm');
      if(phoneNumber === '3121225404') {
         alert("Test Number use ho raha hai! OTP code 123456 daalein");
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (verifyError) setVerifyError('');

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setVerifyError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    const fullPhone = `92${phoneNumber}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otpCode,
      type: 'sms',
    });

    if (error) {
      setVerifyError(error.message);
      setIsVerifying(false);
    } else {
      alert("Login Successful! 🎉");
      onClose(); 
    }
  };

  // ===================== EMAIL LOGIN & SIGNUP LOGIC =====================
  const handleEmailAuth = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setEmailError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setEmailError('');

    if (isSignUpMode) {
      // Naya account bananay ka code
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setEmailError(error.message);
      } else {
        alert("Account Created successfully! 🎉");
        onClose(); 
      }
    } else {
      // Purane account mein login hone ka code
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setEmailError(error.message);
      } else {
        alert("Login Successful! 🎉");
        onClose(); 
      }
    }
    
    setIsLoading(false);
  };

  // ===================== SOCIAL LOGIN LOGIC =====================
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) {
      console.error("Google Login Error:", error.message);
      alert(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    
    if (error) {
      console.error("Facebook Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: '#fff', width: '90%', maxWidth: '420px', 
        borderRadius: '12px', padding: '40px 30px', position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center',
        animation: 'fadeIn 0.3s ease-in-out', minHeight: '450px' 
      }}>
        
        {loginStep !== 'options' && (
          <button onClick={handleBackClick} style={{ position: 'absolute', top: '15px', left: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#002f34', padding: '5px', lineHeight: 1 }}>←</button>
        )}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#002f34', padding: '5px', lineHeight: 1 }}>×</button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/blx-logo.png" alt="BLX" style={{ height: '70px', marginBottom: '15px' }} />
        
        {loginStep === 'options' && (
          <>
            <h2 style={{ fontSize: '22px', color: '#002f34', margin: '0 0 10px 0', fontWeight: 'bold' }}>Welcome to BLX</h2>
            <p style={{ fontSize: '14px', color: '#5c7a7d', margin: '0 0 30px 0' }}>The trusted community of buyers and sellers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* --- GOOGLE BUTTON --- */}
              <button 
                onClick={handleGoogleLogin}
                style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '12px 15px', borderRadius: '6px', border: '2px solid #ebeeef', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', color: '#002f34', transition: '0.2s' }}>
                <svg width="24" height="24" viewBox="0 0 48 48" style={{ marginRight: '10px' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span style={{flex: 1, textAlign: 'center', paddingRight: '34px'}}>Continue with Google</span>
              </button>

              {/* --- EMAIL LOGIN BUTTON --- */}
              <button 
                onClick={() => {
                  setIsSignUpMode(false); // Isay dabane par Login form khulega
                  setLoginStep('emailForm');
                }}
                style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '12px 15px', borderRadius: '6px', border: '2px solid #ebeeef', backgroundColor: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', color: '#002f34', transition: '0.2s' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#002f34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M2 4l10 8 10-8"></path>
                </svg>
                <span style={{flex: 1, textAlign: 'center', paddingRight: '34px'}}>Continue with Email</span>
              </button>
            </div>

            <div style={{ marginTop: '30px', fontSize: '14px', color: '#5c7a7d' }}>
              New to BLX?{' '}
              <span 
                onClick={() => {
                  setIsSignUpMode(true); // Isay dabane par Sign Up form khulega
                  setLoginStep('emailForm');
                }}
                style={{ fontWeight: 'bold', color: '#002f34', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign Up
              </span>
            </div>
          </>
        )}

        {/* ... PHONE Aur OTP Form bilkul waise hi hain ... */}
        {loginStep === 'phoneForm' && (
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '22px', color: '#002f34', margin: '0 0 10px 0', fontWeight: 'bold', textAlign: 'center' }}>Enter your phone number</h2>
            <p style={{ fontSize: '14px', color: '#5c7a7d', margin: '0 0 25px 0', textAlign: 'center' }}>We will send a confirmation code to your phone.</p>
            <label style={{ display: 'block', fontSize: '14px', color: '#002f34', marginBottom: '8px', fontWeight: 'bold' }}>Phone Number</label>
            <div style={{ display: 'flex', marginBottom: '25px' }}>
              <div style={{ padding: '14px 15px', border: '2px solid #ebeeef', borderRight: 'none', borderRadius: '6px 0 0 6px', backgroundColor: '#f2f4f5', color: '#002f34', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🇵🇰</span><span>+92</span>
              </div>
              <input type="tel" placeholder="3001234567" value={phoneNumber} onChange={handlePhoneChange} maxLength={10} style={{ flex: 1, padding: '14px 15px', borderRadius: '0 6px 6px 0', border: '2px solid #ebeeef', boxSizing: 'border-box', outline: 'none', fontSize: '16px', color: '#002f34' }} />
            </div>
            {phoneError && <p style={{ color: '#e74c3c', fontSize: '13px', marginTop: '-15px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{phoneError}</p>}
            <button onClick={handlePhoneNext} disabled={isLoading} style={{ width: '100%', padding: '14px', borderRadius: '6px', backgroundColor: isLoading ? '#5c7a7d' : '#002f34', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? 'Sending Code...' : 'Next'}
            </button>
          </div>
        )}

        {loginStep === 'otpForm' && (
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '22px', color: '#002f34', margin: '0 0 10px 0', fontWeight: 'bold', textAlign: 'center' }}>Enter Verification Code</h2>
            <p style={{ fontSize: '14px', color: '#5c7a7d', margin: '0 0 30px 0', textAlign: 'center', lineHeight: '1.5' }}>
              We sent a 6-digit code to <br/><strong style={{color: '#002f34', letterSpacing: '1px'}}>+92 {phoneNumber}</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {otp.map((digit, index) => (
                <input 
                  key={index} 
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text" 
                  maxLength={1} 
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  placeholder="•"
                  style={{ width: '45px', height: '55px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', border: '2px solid #ebeeef', borderRadius: '8px', color: '#002f34', outline: 'none' }} 
                />
              ))}
            </div>
            {verifyError && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{verifyError}</p>}
            <button 
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.join('').length < 6}
              style={{ width: '100%', padding: '14px', borderRadius: '6px', backgroundColor: (isVerifying || otp.join('').length < 6) ? '#5c7a7d' : '#002f34', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: (isVerifying || otp.join('').length < 6) ? 'not-allowed' : 'pointer', marginBottom: '20px' }} 
            >
              {isVerifying ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        )}

        {/* --- DYNAMIC EMAIL / SIGN UP FORM --- */}
        {loginStep === 'emailForm' && (
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '22px', color: '#002f34', margin: '0 0 10px 0', fontWeight: 'bold', textAlign: 'center' }}>
              {isSignUpMode ? 'Create a New Account' : 'Login with Email'}
            </h2>
            <p style={{ fontSize: '14px', color: '#5c7a7d', margin: '0 0 25px 0', textAlign: 'center' }}>
              {isSignUpMode ? 'Enter email and password to sign up.' : 'Enter your email and password to continue.'}
            </p>
            
            <label style={{ display: 'block', fontSize: '14px', color: '#002f34', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} 
              style={{ width: '100%', padding: '14px 15px', borderRadius: '6px', border: '2px solid #ebeeef', boxSizing: 'border-box', outline: 'none', fontSize: '16px', color: '#002f34', marginBottom: '15px' }} 
            />

            <label style={{ display: 'block', fontSize: '14px', color: '#002f34', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setEmailError(''); }} 
              style={{ width: '100%', padding: '14px 15px', borderRadius: '6px', border: '2px solid #ebeeef', boxSizing: 'border-box', outline: 'none', fontSize: '16px', color: '#002f34', marginBottom: '25px' }} 
            />

            {emailError && <p style={{ color: '#e74c3c', fontSize: '13px', marginTop: '-15px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{emailError}</p>}
            
            <button onClick={handleEmailAuth} disabled={isLoading} style={{ width: '100%', padding: '14px', borderRadius: '6px', backgroundColor: isLoading ? '#5c7a7d' : '#002f34', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? 'Please wait...' : (isSignUpMode ? 'Sign Up' : 'Login')}
            </button>
            
            {/* Chota sa toggle switch form ke neechay */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#5c7a7d' }}>
              {isSignUpMode ? "Already have an account? " : "Don't have an account? "}
              <span 
                onClick={() => { setIsSignUpMode(!isSignUpMode); setEmailError(''); }}
                style={{ fontWeight: 'bold', color: '#002f34', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isSignUpMode ? "Login" : "Sign Up"}
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}