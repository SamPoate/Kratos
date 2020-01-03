import React from 'react';
import Downshift from 'downshift';

const WorkoutSearch = ({ type = 'text', name, value, onChange, onBlur }) => {
  const items = ['bench', 'squat', 'deadlift'];

  const itemToString = item => {
    return item ? item : '';
  };

  return (
    <Downshift itemToString={item => itemToString(item)}>
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue }) => (
        <div className='form__input__dropdown'>
          <input
            {...getInputProps({
              type: type,
              name: name,
              onChange: onChange,
              value: value,
              onBlur: onBlur
            })}
          />
          <ul {...getMenuProps()} className={!isOpen ? 'closed' : ''}>
            {isOpen
              ? items
                  .filter(item => !inputValue || item.includes(inputValue))
                  .map((item, index) => (
                    <li
                      className={item.selected ? 'list-item-selected' : ''}
                      {...getItemProps({
                        key: item,
                        index,
                        item
                      })}
                    >
                      {item}
                    </li>
                  ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default WorkoutSearch;
