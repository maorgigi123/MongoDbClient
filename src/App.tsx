import { useEffect, useState } from 'react';
import ImageComponent from './components/ImageComponent';
import Modal from './components/Modal'; // Import the Modal component
import SortOptions from './components/SortOptions';
import styled from 'styled-components';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for the toast notifications

// Styled Components
const Container = styled.div`
  width: 100vw;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopBar = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ContainerImages = styled.div`
  width: 100%;
  height: 840px; // Height of the image + margins between them
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

interface ImageData {
  id: number;
  [key: string]: any;
}

function App() {
  // States for search input, sort criteria, and modal
  const [category, setCategory] = useState<string>('sport');
  const [search, setSearch] = useState<string>(category);
  const [sortCriteria, setSortCriteria] = useState<string>('id');
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null); // State for modal image
  const [loading, setLoading] = useState<boolean>(true);
  const [finishAllPhotos, setFinishAllPhotos] = useState<boolean>(false); // To show a message when no more images
  const [page, setPage] = useState<number>(1);
  const [dataByCategory, setDataByCategory] = useState<Record<string, any>>({});
  console.log(dataByCategory)
  useEffect(() => {
    const fetchData = async () => {
      // Check if data already exists for the current category and page
      const dataExists = dataByCategory[category]?.[page];
      if (dataExists) {
        // If data exists, don't send a new request
        setLoading(false);
        setFinishAllPhotos(false);
        return;
      }

      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_APP_API_URL; // Access the API URL from the environment variable
        console.log(apiUrl, category, page);
        const response = await axios.get(`${apiUrl}/images?category=${category}&page=${page}`);
        const result = response.data;
        if (result.length <= 0) {
          setFinishAllPhotos(true);
        } else {
          setFinishAllPhotos(false);
        }

        setDataByCategory((prevData) => ({
          ...prevData,
          [category]: {
            ...prevData[category],
            [page]: result,
          },
        }));
        setLoading(false);
      } catch (e: any) {
        // Handling error responses (404, 500, etc.)
        if (e.response) {
          // Server responded with an error status code
          if (e.response.status === 404) {
            toast.error(e.response.data.error,{
              autoClose: 700, 
            }); // Display toast on 404 error
          } else {
            toast.error('An error occurred while fetching data.'); // Display general error message
          }
        } else {
          // No response from server (network error)
          toast.error('Network error. Please try again later.'); // Display network error message
        }
        setFinishAllPhotos(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [category, page]);

  // Pagination handlers to navigate between pages
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1); // Go to the previous page
    }
  };

  const handleNext = () => {
    setPage(page + 1); // Go to the next page
  };

  // Debounced category change handler to update category
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Clear previous timeout if it exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to delay the category change action
    setTypingTimeout(
      setTimeout(() => {
        setLoading(true);
        setCategory(value);
        setPage(1); // Reset to page 1 when category changes
      }, 500) // .5-second delay for better performance
    );
  };

  // Sort change handler to update sort criteria
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortCriteria(event.target.value); // Update sorting option
  };

  // Open the modal with the selected image
  const openModal = (imageData: ImageData) => {
    setSelectedImage(imageData);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  const sortedData = [...(dataByCategory[category]?.[page] || [])].sort((a, b) => {
    try {
      // Ensure the sortCriteria is a valid key in the data
      const aValue = a[sortCriteria];
      const bValue = b[sortCriteria];
  
      // Check if both values are numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue; // Sorting in descending order
      }
  
      // Check if both values are strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return bValue.localeCompare(aValue); // Sorting alphabetically in descending order
      }
  
      // Check if both values are dates (Date)
      if (aValue instanceof Date && bValue instanceof Date) {
        return bValue.getTime() - aValue.getTime(); // Sorting from old to new (descending order)
      }
    } catch (e) {
      console.error('Error during sorting:', e);  // Error during sorting
    }
  
    return 0;  // If types don't match, no change
  });

  return (
    <Container>
      <TopBar>
        {/* Pagination buttons */}
        <Button onClick={handlePrev} disabled={page <= 1}>
          Prev
        </Button>
        {/* Search input */}
        <Input
          type="text"
          value={search}
          onChange={handleCategoryChange}
          placeholder="Enter category"
          style={{ width: 500 }}
        />
        <Button onClick={handleNext} disabled={sortedData.length < 9}>
          Next
        </Button>
      </TopBar>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ClipLoader size={80} color="#3498db" loading={loading} />
        </div>
      ) : (
        <div style={{ display: 'flex', width: '80vw' }}>
          <SortOptions sortCriteria={sortCriteria} handleSortChange={handleSortChange} />

          <ContainerImages>
            {finishAllPhotos ? (
              <h1>No more images</h1> // Message when there are no more images
            ) : (
              sortedData.map((img: ImageData) => (
                <ImageComponent key={img.id} data={img} openModal={openModal} />
              ))
            )}
          </ContainerImages>
        </div>
      )}

      {/* Render the Modal if an image is selected */}
      {selectedImage && <Modal imageData={selectedImage} closeModal={closeModal} />}
      
      {/* Toast notifications container */}
      <ToastContainer />
    </Container>
  );
}

export default App;
