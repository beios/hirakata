import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import '../styles/Auth.css';

function Auth({ user }) {
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('로그인 에러:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    return (
        <div className="auth-container">
            {user ? (
                <div className="user-info">
                    <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                    <span className="user-name">{user.displayName}</span>
                    <button onClick={handleLogout} className="auth-button logout">
                        로그아웃
                    </button>
                </div>
            ) : (
                <button onClick={handleGoogleLogin} className="auth-button login">
                    구글로 로그인
                </button>
            )}
        </div>
    );
}

export default Auth; 