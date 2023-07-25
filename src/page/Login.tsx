import React, { useRef } from "react";
import { dbs } from '../firebase.js';
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp } from "@firebase/firestore";
import 'firebase/firestore';
import 'firebase/storage';

interface Todo {
  id?: string;
  title: string;
  isDone: boolean;
}

interface signUp {
  email: string;
  password: string;
};

export default function Login() {
  const auth = getAuth();
  const [data, setData] = React.useState<Todo[]>([]);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  console.log(data)

  const check = () => {
    setIsChecked(!isChecked)
    fetchSweets();
  }
  let noteDate = Timestamp.fromDate(new Date());

  // signin
  const emailRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);
  const ref = collection(dbs, "todos");

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(emailRef.current!.value);
    console.log(passwdRef.current!.value);

    let data: signUp = {
        // firstName: firstRef.current!.value,
        // lastName: lastRef.current!.value,
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

  const dbService = getFirestore();
  const lama: Object[] = [];

  const todoRef = doc(collection(dbs, 'todos'), 'todo1');
  console.log(todoRef)

  async function fetchSweets() {
    const db = await getDocs(collection(dbService, "todos")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data());
        const todoData = doc.data() as Partial<Todo>;

        lama.push({
          id: doc.id,
          title: todoData.title ?? '',
          isDone: todoData.isDone ?? false,
        });

        // lama.push({...doc.data()});
        // setData(lama)
        console.log(lama);
        console.log(doc.data());
      });
    });
  }

  return (
    <div className="wrapper">
      <div className="container">
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
