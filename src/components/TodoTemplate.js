import React from 'react';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import '../scss/TodoTemplate.scss';
import TodoMain from './TodoMain';

const TodoTemplate = () => {
  return (
    <div className="TodoTemplate">
      <TodoHeader />
      <TodoMain />
      <TodoInput />
    </div>
  );
};

export default TodoTemplate;
