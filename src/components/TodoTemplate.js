import React, { useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import '../scss/TodoTemplate.scss';
import TodoMain from './TodoMain';

const TodoTemplate = () => {
  // 백엔드 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 한다.

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: '아침 산책하기',
      done: true,
    },
    {
      id: 2,
      title: '오늘 주간 신문 읽기',
      done: true,
    },
    {
      id: 3,
      title: '샌드위치 사먹기',
      done: false,
    },
    {
      id: 4,
      title: '리액트 복습하기',
      done: false,
    },
  ]);

  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1;
  };

  // TodoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는 일반적인 props 사용 불가
  // 부모 컴포넌트에서 함수(매개변수)를 선언2
  const addTodo = (todoText) => {
    const newTodo = {
      id: makeNewId(),
      title: todoText,
      done: false,
    };

    // react의 상태 변수는 불변성을 가지기 때문에
    // 기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경
    setTodos([...todos, newTodo]);
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할 일 체크 처리함수
  const checkTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  // 체크가 안 된 할 일의 개수 카운트
  const countRestTodo = () =>
    todos.filter((todo) => !todo.done).length;

  return (
    <div className="TodoTemplate">
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
