import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    // value return isi data | isvalid return boolen
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    // state untuk mendapatkan value terakhir yang disimpan
    return { value: state.value, isValid: state.value.includes('@') };
  }

  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.length >= 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.length >= 6 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  // reducer
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // jadi useeffect ini diajalankan awal sebelum ngerender data
  //  ketika ada state yang diisi /  didefinisikan di object [], maka useeffect ini akan jalan kalo ada perubahan pada objet yang diisi
  // useEffect(() => {
  //   console.log('effectrunning');
  // }, [enteredPassword]);

  // membuat variabel const dengan alias
  // agar jika data sudah tervalidasi, maka fungsi validasi tidak akan dijalankan lagi
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // useEffect menjalankan function ketika state diubah
  // menjalankan validasi jika setingan email dan password berubah
  useEffect(() => {
    // divalidasi setelah 500 ms setelah input email dan password
    const identifier = setTimeout(() => {
      console.log('chevking form Validity!');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    // clear jika pindah inputan
    return () => {
      console.log('cleanup!');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  //   console.log('effect running');
  //   return () => {
  //     console.log('cleanup!');
  //   };
  // }, []);

  const emailChangeHandler = (event) => {
    // berhubungan dengan fungsi emailreducer
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      authCtx.onLogin(emailState.isValid, passwordState.value);
    } else if (!emailIsValid) {
      // focusfunction function ada di parent input component
      emailInputRef.current.focusfunction();
    } else {
      passwordInputRef.current.focusfunction();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input ref={emailInputRef} id="email" label="E-mail" type="email" isValid={emailIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} />
        <Input ref={passwordInputRef} id="password" label="Password" type="password" isValid={passwordIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} />
        <div className={classes.actions}>
          <Button type="submit" classN ame={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
