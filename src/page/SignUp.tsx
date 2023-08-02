import React, { useRef } from "react";
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';

interface signUp {
  email: string;
  password: string;
};

export default function SignUp() {
  const auth = getAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);
  
  // signup
  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(emailRef.current!.value);
    console.log(passwdRef.current!.value);

    let data: signUp = {
        email: emailRef.current!.value,
        password: passwdRef.current!.value,
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
        <div>
          
          <form onSubmit={addUser}>
            <label htmlFor="email">email:</label>
            <input type="text" id="email" name="email" ref={emailRef}/><br/>
            <label htmlFor="passwd">password:</label>
            <input type="text" id="passwd" name="passwd" ref={passwdRef}/><br/>
            <input type="submit" value="Submit"/>
          </form>

        </div>
      </div>
    </div>
  );
}
