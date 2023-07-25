import React, { useRef } from "react";
import { dbs } from '../firebase.js';
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { Timestamp } from "@firebase/firestore";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

interface Todo {
  id?: string;
  title: string;
  isDone: boolean;
}

interface TodoData {
  title: string;
  isDone: boolean;
  date: string | firebase.firestore.Timestamp;
};

export default function Test() {
  const [data, setData] = React.useState<Todo[]>([]);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  console.log(data)

  const check = () => {
    setIsChecked(!isChecked)
    fetchSweets();
  }
  let noteDate = Timestamp.fromDate(new Date());

  // add
  const messageRef = useRef<HTMLInputElement>(null);
  const ref = collection(dbs, "todos");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(messageRef.current!.value);

    let data: TodoData = {
        title: messageRef.current!.value,
        isDone: false,
        date: noteDate,
    };

    try {
      addDoc(ref, data);
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
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch1" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch1" htmlFor="ch1">CheckBox1</label>
          </div>
          
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch2" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch2" htmlFor="ch2">CheckBox2</label>
          </div>
          
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch3" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch3" htmlFor="ch3">CheckBox3</label>
          </div>

          <input className="lama" ref={messageRef} type="text"/>
          <button onClick={addTodo}>Add Todo</button>
        </div>
      </div>
    </div>
  );
}
