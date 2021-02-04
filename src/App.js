import React, {useEffect, useState} from 'react';
import './App.css';
import Post from './components/Post';
import {auth, db} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload.js';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in
        console.log(authUser)
        setUser(authUser);
        setUsername(authUser.displayName)
      } else {
        //user has logged out
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  },[user, username]);

  useEffect(() => {
   db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
     setPosts(snapshot.docs.map(doc => ({
       id: doc.id,
       post: doc.data(),
     })))
   })
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch(err => alert(err.message))

    setEmail('');
    setPassword('');
    setUsername('');
  }

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
      .catch(err => alert(err.message))
    setOpenSignIn(false)
    setEmail("");
    setPassword("");
  }
  
  
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>

          <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>
      
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </center>

          <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="instagram logo"
        />

      {user ? (
        <div>
          <h1>Welcome back {username}</h1>
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        </div>
      ) : (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}
      </div>
      <div className="app__posts">
        {
          posts.map(({post, id}) => (
            <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption}/>
          ))
        }
      </div>
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
          ) : (
        <h3>Log in to upload</h3>
      )}
    </div>
  );
}

export default App;
