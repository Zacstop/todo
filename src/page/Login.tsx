import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import 'firebase/firestore';
import 'firebase/storage';

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
    signInWithPopup(auth, provider).then((result) => {
      setValue(result.user.email)
      localStorage.setItem('email', result.user?.email!)
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
      <div>
        
          <div>
            
            <form onSubmit={loginUser}>
              <label htmlFor="email">email:</label>
              <input type="email" id="email" name="email" onChange={(e) => setEmailValue(e.target.value)}/><br/>
              <label htmlFor="passwd">password:</label>
              <input type="password" id="passwd" name="passwd" onChange={(e) => setPasswordValue(e.target.value)}/><br/>
              <input type="submit" value="Submit"/>
            </form>

            <div>
              <button style={{width: '100%', height: 50, color: "#fff", background: "coral", marginTop: 10}} onClick={googleLogin}>google login</button>
            </div>

            <div>
              <Link to={'/signup'}>
                <button style={{width: '100%', height: 50, color: "#fff", background: "pink", marginTop: 10}}>sign up</button>
              </Link>
            </div>

          </div>
        
      </div>
    </div>
  );
}
