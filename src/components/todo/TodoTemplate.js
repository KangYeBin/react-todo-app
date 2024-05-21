import React, { useEffect, useState } from 'react';
import '../../scss/TodoTemplate.scss';
import TodoMain from './TodoMain';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import { useNavigate } from 'react-router-dom';

const TodoTemplate = () => {
  const redirection = useNavigate();

  // 백엔드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 한다.
  const API_BASE_URL = 'http://localhost:8181/api/todos';

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  // 로딩 상태값 관리

  // 로그인 인증 토큰 가져오기
  const token = localStorage.getItem('ACCESS_TOKEN');

  // fetch 요청을 보낼 때 사용할 요청 헤더 설정
  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + token,
  };

  // TodoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는 일반적인 props 사용 불가
  // 부모 컴포넌트에서 함수(매개변수)를 선언
  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    };

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify(newTodo),
    });

    const json = await res.json();
    setTodos(json.todos);

    // fetch(API_BASE_URL, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify(newTodo),
    // })
    //   .then((res) => {
    //     if (res.status === 200) return res.json();
    //     else console.log('error occured');
    //     // status 코드에 따라 에러 처리를 다르게 진행
    //   })
    //   .then((data) => setTodos(data.todos));
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: requestHeader,
    })
      .then((res) => res.json())
      .then((data) => setTodos(data.todos))
      .catch((err) => {
        console.log('err: ', err);
        alert('잘못된 삭제 요청입니다!');
      });
  };

  // 할 일 체크 처리함수
  const checkTodo = (id, done) => {
    fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: requestHeader,
      body: JSON.stringify({
        id,
        done: !done,
      }),
    })
      .then((res) => res.json())
      .then((json) => setTodos(json.todos));
  };

  // 체크가 안 된 할 일의 개수를 카운트 하기
  const countRestTodo = () =>
    todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) {
          alert('로그인이 필요한 서비스입니다');
          redirection('/login');
        } else {
          alert('관리자에게 문의하세요');
        }
      })
      .then((json) => {
        console.log(json);

        // fetch를 통해 받아온 데이터를 상태 변수에 할당
        if (json) setTodos(json.todos);
      });
  }, []);

  return (
    <div className="TodoTemplate">
      <TodoHeader count={countRestTodo} />{' '}
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />{' '}
      <TodoInput addTodo={addTodo} />{' '}
    </div>
  );
};

export default TodoTemplate;
