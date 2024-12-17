import React from 'react';
import styled from 'styled-components';
/**
 * Container for the sort options.
 */
const SortOptionsContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

/**
 * Style for the label of each sort option.
 */
const SortLabel = styled.label`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

/**
 * Hidden radio input field, as it is replaced by CustomRadio.
 */
const RadioInput = styled.input`
  display: none;
`;

/**
 * Custom radio button component.
 * Dynamically adjusts the style based on the "checked" prop.
 */
const CustomRadio = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #007BFF;
  background-color: ${(props) => (props.checked ? '#007BFF' : 'white')};
  transition: background-color 0.3s, border-color 0.3s;
  position: relative;
  cursor: pointer;
  margin-right: 8px;
  
  &:hover {
    border-color: #0056b3;
  }

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => (props.checked ? 'white' : 'transparent')};
    transition: background-color 0.3s;
  }
`;

/**
 * Interface for the SortOptions component props
 */
interface SortOptionsProps {
  sortCriteria: string;
  handleSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;  // Event type for radio button
}

/**
 * SortOptions component renders a list of radio buttons
 * to allow users to sort content based on various criteria.
 * 
 * @param {Object} props - React props
 * @param {string} props.sortCriteria - The current sorting criteria
 * @param {function} props.handleSortChange - Handler function for sorting changes
 */
const SortOptions: React.FC<SortOptionsProps> = ({ sortCriteria, handleSortChange }) => {
  // Array of sort options to be displayed
  const sortOptions = [
    { value: 'id', label: 'Sort by ID' },
    { value: 'collections', label: 'Sort by Collections' },
    { value: 'comments', label: 'Sort by Comments' },
    { value: 'downloads', label: 'Sort by Downloads' },
    { value: 'likes', label: 'Sort by Likes' },
    { value: 'imageHeight', label: 'Sort by Image Height' },
    { value: 'imageSize', label: 'Sort by Image Size' },
    { value: 'imageWidth', label: 'Sort by Image Width' },
    { value: 'previewHeight', label: 'Sort by Preview Height' },
    { value: 'previewWidth', label: 'Sort by Preview Width' },
    { value: 'user_id', label: 'Sort by User ID' },
    { value: 'views', label: 'Sort by Views' },
    { value: 'webformatWidth', label: 'Sort by Web Format Width' },
  ];

  // Error handling for invalid sort criteria or missing handler function
  if (!sortCriteria || !handleSortChange) {
    console.error('Invalid sortCriteria or handleSortChange function');
    return <p style={{color:'red' ,}}>*Something went wrong with the sorting option, please try again</p>
  }

  /**
   * Renders the list of radio buttons based on the provided sortOptions.
   */
  return (
    <SortOptionsContainer>
      {sortOptions.map((option) => (
        <SortLabel key={option.value}>
          <RadioInput
            type="radio"
            name="sortOption"
            value={option.value}
            checked={sortCriteria === option.value}
            onChange={handleSortChange}
            id={option.value}
            aria-label={option.label} // For accessibility
          />
          <CustomRadio checked={sortCriteria === option.value} />
          {option.label}
        </SortLabel>
      ))}
    </SortOptionsContainer>
  );
};

export default SortOptions;
