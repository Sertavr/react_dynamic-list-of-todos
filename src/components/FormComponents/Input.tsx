import React from 'react';

type Props = {
  value: string;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<Props> = ({ value, handleChangeInput }) => {
  return (
    <input
      data-cy="searchInput"
      type="text"
      className="input"
      placeholder="Search..."
      value={value}
      onChange={handleChangeInput}
    />
  );
};
