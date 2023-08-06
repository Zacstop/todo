import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { UserCredential } from "@firebase/auth"
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import 'firebase/firestore';
import 'firebase/storage';
import googleIcon from "../assets/images/icons/google-sign-button.png"

interface signIn {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  console.log(emailValue,'emailValue')
  console.log(value, 'value')
  
  // signin
  const loginUser = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(emailValue,'emailValue')
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(userCredential,'userCredential')
      setValue(user.email!)
      navigate('/')
    })
    .catch((error) => {
      console.log(error.code)
      console.log(error.message)
      switch (error.code || error.message) {
        case "auth/user-not-found" || "auth/wrong-password" || "INVALID_PASSWORD":
          alert("이메일 혹은 비밀번호가 일치하지 않습니다.")
          break;
        case "auth/too-many-requests":
          alert("너무 많은 요청입니다. 잠시 후에 다시 시도해주세요.")
          break;
        case "auth/network-request-failed":
          alert("네트워크 연결에 실패 하였습니다.")
          break;
        case "auth/invalid-email":
          alert("잘못된 이메일 형식입니다.")
          break;
        case "auth/internal-error":
          alert("잘못된 요청입니다.")
          break;
        default:
          alert("로그인에 실패 하였습니다.")
          break;
      }
    });
  }
  //

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then((result: UserCredential) => {
      if (result.user && result.user.email) {
        setValue(result.user.email)
        localStorage.setItem('email', result.user.email)
        navigate('/')
      }
      console.log(result,'result')
    }).catch((error) => {
      console.log(error,'error')
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => 
      console.log(user,'user')
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="center-screen">
    <div className="askSignUp">You must sign in to join</div>
      <div>
            
          <form className="loginForm" onSubmit={loginUser}>
            <div className="inputLogFrom">
              <label className="logLabel" htmlFor="email">E-Mail:</label>
              <input className="logInput" type="email" id="email" name="email" onChange={(e) => setEmailValue(e.target.value)}/>
            </div>
            <div className="inputLogFrom">
              <label className="logLabel" htmlFor="passwd">Password:</label>
              <input className="logInput" type="password" id="passwd" name="passwd" onChange={(e) => setPasswordValue(e.target.value)}/>
            </div>
            <input className="loginBtn" type="submit" value="Sign in"/>
          </form>

          <div className="googleLoginBtn" onClick={googleLogin}>
            <img src={googleIcon} className="gicon"/>
            <p className="gtext">Sign in with Google</p>
          </div>

          <div className="signUpTypo">
            <p>
              Don`t have an account?
              <mark style={{fontWeight: "700", backgroundColor: "transparent", paddingLeft: 10}}>
                <Link to={'/signup'}>
                  Sign up
                </Link>
              </mark>
            </p>
          </div>
        
      </div>
    </div>
  );
}
