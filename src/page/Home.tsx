import React, { useEffect, useState, useRef } from "react";
import { signOut, onAuthStateChanged  } from "firebase/auth";
import { doc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { Timestamp, updateDoc } from '@firebase/firestore';
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import modIcon from '../assets/images/icons/pencil.png';
import delIcon from '../assets/images/icons/trash-can.png';
import optionIcon from '../assets/images/icons/option.png';
import Header from "components/Header";

interface Todo {
  id: string;
  title: string;
  isDone: boolean;
}

interface TodoData {
  title: string;
  isDone: boolean;
  date: string | firebase.firestore.Timestamp;
  userId: string | undefined;
}

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  tenantId?: string;
  _redirectEventId?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: any;
  stsTokenManager: any;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [data, setData] = useState<Todo[]>([]);
  const [change, setChange] = useState('');
  const [isChange, setIsChange] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEmpty = !data || data.length === 0
  console.log(data, 'outData')
  console.log(editingId, 'editingId')
  
  const messageRef = useRef<HTMLInputElement>(null);
  const noteDate = Timestamp.fromDate(new Date());
  const ref = collection(db, "todos");

  // get
  const getData = async () => {
    try {
      const datas = await getDocs(ref);
      const filteredData = datas.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];

      setData(filteredData);
    } catch (err) {
      console.log(err);
    }
  };
  // 

  // add
  const addTodo = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(messageRef.current!.value);

    const data: TodoData = {
      title: messageRef.current!.value,
      isDone: false,
      date: noteDate,
      userId: auth?.currentUser?.uid
    };
    console.log(data)

    try {
      await addDoc(ref, data);
      messageRef.current!.value = "";
      getData();
    } catch (err) {
      console.log(err);
    }
  }
  //

  // put
  const modTodo = async (todo: Todo) => {
    if(window.confirm("Are you sure you want to change this title?")) {
      if(change === '') {
        alert("Please enter a new title.");  // change 값이 비어있을 경우 사용자에게 알림
        return;  
      }
      try {
        await updateDoc(doc(db, "todos", todo.id), {title: change});
        setChange('');
        setEditingId(null);
        getData();
      } catch (err) {
        console.log(err);
      }
    }
  };
  //

  // delete
  const deleteTodo = async (id: string) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "todos", id));
        getData();
      } catch (err) {
        console.log(err);
      }
    } else {
      return false;
    }
  };
  //

  // logout
  const logOut = (e: React.FormEvent) => {
    e.preventDefault();
    
    signOut(auth).then(() => {
      console.log('log out')
      navigate('/login')
    }).catch((error) => {
      console.log(error,'error')
    });
  }
  //
  
  // checkbox check
  const isClear = async(todo: Todo) => {
    console.log('Check!')
    try {
      await updateDoc(doc(db, "todos", todo.id), {isDone: !todo.isDone});
      getData();
    } catch (err) {
      console.log(err);
    }
  }
  // 
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigate('/login')
        }
        console.log(user?.toJSON(),'user')
        const userObj: User = user?.toJSON() as User;
        setUser(userObj)
      }
    );
    // Clean up subscription on unmount
    unsubscribe();
    getData();
  }, []);

  console.log(doc(db, "todos", "id"), 'doc')

  return (
    <div>
      <div className="container">
        <div>
          <Header/>
          <div style={{maxWidth: 700, width: "100%", height: "100vh", margin: "0 auto"}}>
            <div>
              {user ?
                <div>Logged in as {user.email}</div>
                :
                <div>Not logged in</div>
              }
              <div style={{fontSize: 30}}>Home Page</div>
              <button onClick={logOut}>log out</button>
            </div>

            <div>
              {isEmpty ? 
                <div>loading...</div>
                :
                <>
                  {data.map((todo) => (
                    <div key={todo.id} className="todo-container">
                      <input id={todo.id} type="checkbox" checked={todo.isDone} onChange={() => isClear(todo)} style={{}}/>
                      <label className="labela" htmlFor={todo.id} id={todo.id}></label>
                      {editingId === todo.id ? (
                        <>
                          <input className="todo" type="text" defaultValue={todo.title} onChange={(e) => setChange(e.target.value)}/>
                          <button onClick={() => modTodo(todo)}>
                            <img src={modIcon} alt="modi" style={{width: "auto", height: 20}}/>
                          </button>
                        </>
                        ) : (
                          <>
                            <span className="todo">{todo.title}</span>
                            <button onClick={() => {editingId === null ? setEditingId(todo.id) : setEditingId(null)}}>
                              <img src={modIcon} alt="modi" style={{width: "auto", height: 20}}/>
                            </button>
                          </>
                        )
                      }
                      <button onClick={() => deleteTodo(todo.id)}>
                        <img src={delIcon} alt="del" style={{width: "auto", height: 20}}/>
                      </button>
                      {/* <input type="text" placeholder="변경명" onChange={(e) => setChange(e.target.value)}></input>
                      <button onClick={() => modTodo(todo)}>수정</button> */}
                    </div>
                  ))}
                </>
              }

              <input ref={messageRef} type="text"/>
              <button onClick={addTodo}>Add Todo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
