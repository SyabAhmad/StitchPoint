import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { COLOR_PALETTES } from '../../data/ConstantValues';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLOR_PALETTES.black }}
    >
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login onSwitchToSignup={() => setIsLogin(false)} onLoginSuccess={onLoginSuccess} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLogin(true)} onSignupSuccess={onLoginSuccess} />
        )}
      </div>
    </div>
  );
}
