import React, { useRef, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';

interface signUp {
  email: string;
  password: string;
}

export default function SignUp() {
  const auth = getAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  
  // signup
  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(emailValue);
    console.log(passwordValue);

    const data: signUp = {
        email: emailValue,
        password: passwordValue,
    };

    try {
      createUserWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        console.log(userCredential,'userCredential')
      })
    } catch (err) {
      console.log(err);
    }
  }
  // 

  return (
    <div className="center-screen">
      <div>
        <div className="askSignUp">You must sign up to join</div>
        <div>

          <form className="loginForm" onSubmit={addUser}>
            <div className="inputLogFrom">
              <label className="logLabel" htmlFor="email">E-Mail:</label>
              <input className="logInput" type="email" id="email" name="email" onChange={(e) => setEmailValue(e.target.value)}/>
            </div>
            <div className="inputLogFrom">
              <label className="logLabel" htmlFor="passwd">Password:</label>
              <input className="logInput" type="password" id="passwd" name="passwd" onChange={(e) => setPasswordValue(e.target.value)}/>
            </div>
            <input className="loginBtn" type="submit" value="Sign up"/>
          </form>

          <div className="signUpTypo">
            <p>
              Don`t have an account?
              <mark className="signUpMark">
                Sign up
              </mark>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
