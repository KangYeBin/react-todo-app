import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, USER } from '../../config/host-config';

const Join = () => {
  // 상태 변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태 변수 관리
  // 입력값과 메세지는 따로 상태 관리 (메세지는 백엔드로 보내줄 필요 없음)
  // 메세지 영역은 각 입력창마다 존재하기 때문에 객체 형태로 한 번에 관리
  const [message, setMessage] = useState({
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증 완료 체크에 대한 상태 변수 관리
  // 각각의 입력창마다 유효성 검증 상태를 관리해야 하기 때문에 객체로 선언
  // 상태를 유지하려는 이유 -> 스타일, 마지막에 회원가입 버튼을 누를 때까지 검증 상태를 유지해야하므로
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태 변수에 저장하는 함수
  const saveInputState = ({ key, inputValue, flag, msg }) => {
    // 패스워드 입력값은 굳이 userValue로 관리할 필요 X
    // 임의의 문자열 'pass'를 넘기고 있다 -> pass가 넘어오면 setUserValue()를 실행하지 않음
    // 입력값 세팅
    setUserValue((oldVal) => {
      return { ...oldVal, [key]: inputValue };
    });

    // 메세지 세팅
    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg };
    });

    // 입력값 검증 상태 세팅
    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/;
    const inputValue = e.target.value;

    //입력값 검증
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력값 검증 여부 체크 변수

    if (!inputValue) msg = '유저 이름은 필수입니다';
    else if (!nameRegex.test(inputValue))
      msg = '2~5글자 사이의 한글로 작성하세요';
    else {
      msg = '사용 가능한 이름입니다';
      flag = true;
    }

    // 이 핸들러에서 처리한 여러 값을 객체로 한 번에 넘기기
    saveInputState({
      key: 'userName',
      inputValue,
      msg,
      flag,
    });
  };

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = (email) => {
    let msg = '';
    let flag = false;

    fetch(`${API_BASE_URL}${USER}/check?email=${email}`)
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          msg = '이메일이 중복되었습니다';
        } else {
          msg = '사용 가능한 이메일입니다';
          flag = true;
        }

        // 중복 확인 후 상태값 변경
        saveInputState({
          key: 'email',
          inputValue: email,
          msg,
          flag,
        });
      });
  };

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = (e) => {
    const inputValue = e.target.value;
    const emailRegex =
      /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수값 입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
    }

    // 중복 확인 후에만 상태 변경을 하는 것이 아니다
    // 입력창이 비거나, 정규 표현식 위반 시에도 상태는 변경되어야 한다
    saveInputState({
      key: 'email',
      inputValue,
      msg,
      flag,
    });
  };

  // 패스워드 입력창 체인지 이벤트 핸들러
  const passwordHandler = (e) => {
    // 패스워드가 변경되면 패스워드 확인란 초기화
    document.getElementById('password-check').value = '';

    setMessage({
      ...message,
      passwordCheck: '',
    });
    setCorrect({
      ...correct,
      passwordCheck: false,
    });

    const inputValue = e.target.value;
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

    let msg;
    let flag = false;

    if (!inputValue) msg = '비밀번호는 필수입니다';
    else if (!pwRegex.test(inputValue))
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해주세요';
    else {
      msg = '사용 가능한 비밀번호입니다';
      flag = true;
    }

    saveInputState({
      key: 'password',
      inputValue,
      msg,
      flag,
    });
  };

  // 비밀번호 확인란 체인지 이벤트 핸들러
  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;

    if (!e.target.value) msg = '비밀번호 확인란은 필수입니다';
    else if (userValue.password !== e.target.value)
      msg = '비밀번호가 일치하지 않습니다';
    else {
      msg = '비밀번호가 일치합니다';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck',
      inputValue: e.target.value,
      msg,
      flag,
    });
  };

  // 4개의 입력창이 모두 검증에 통과했는지 여부 검사
  const isValid = () => {
    for (let key in correct) {
      const flag = correct[key];
      if (!flag) return false;
    }
    return true;
  };

  const fetchSignUpPost = () => {
    fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(
          `${data.userName} (${data.email})님 회원가입에 성공했습니다`,
        );
      })
      .catch((err) => {
        console.log('error : ', err);
        alert(
          '서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.',
        );
      });
  };

  // 회원 가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해주세요');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              계정 생성
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="fname"
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="유저 이름"
              autoFocus
              onChange={nameHandler}
            />
            <span
              style={
                correct.userName
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.userName}
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              onChange={emailHandler}
            />
            <span
              style={
                correct.email ? { color: 'green' } : { color: 'red' }
              }
            >
              {message.email}
            </span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="패스워드"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={passwordHandler}
            />
            <span
              style={
                correct.password
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.password}
            </span>
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password-check"
              label="패스워드 확인"
              type="password"
              id="password-check"
              autoComplete="check-password"
              onChange={pwCheckHandler}
            />
            <span
              id="check-span"
              style={
                correct.passwordCheck
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.passwordCheck}
            </span>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler}
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;