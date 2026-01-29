/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos, getUser } from './api';
import { User } from './types/User';
import { ModalProvaid } from './components/ModalContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todoForSelectUser, setTodoForSelectUser] = useState<Todo | null>(null);
  const [optionFilter, setOptionFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(newData => setTodos(newData))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOptionFilter(event.target.value);
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  const handleClearSearch = () => setSearchFilter('');

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    switch (optionFilter) {
      case 'completed':
        result = result.filter(todo => todo.completed);
        break;
      case 'active':
        result = result.filter(todo => !todo.completed);
        break;
      default:
        break;
    }

    if (searchFilter.trim()) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }

    return result;
  }, [optionFilter, todos, searchFilter]);

  const handleOpenModal = (userId: number, todo: Todo) => {
    getUser(userId).then(userData => setUser({ ...userData }));
    setTodoForSelectUser(todo);
  };

  const handleCloseModal = () => {
    setTodoForSelectUser(null);
    setUser(null);
  };

  return (
    <ModalProvaid>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                handleSelectOption={handleSelectOption}
                handleChangeInput={handleChangeInput}
                handleClearSearch={handleClearSearch}
                valueInput={searchFilter}
              />
            </div>

            <div className="block">
              {isLoading && <Loader />}
              <TodoList todos={filteredTodos} openModal={handleOpenModal} />
            </div>
          </div>
        </div>
      </div>

      {todoForSelectUser && (
        <TodoModal
          user={user}
          todo={todoForSelectUser}
          closeModal={handleCloseModal}
        />
      )}
    </ModalProvaid>
  );
};
