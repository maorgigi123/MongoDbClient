import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for the toast notifications

// Define the types for the Modal component props
interface ModalProps {
  imageData: any | null;
  closeModal: () => void;
}

// Modal Background: Creates a dark overlay that covers the whole screen.
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

// Modal Container: The content area of the modal, with a max size and scrollable area.
const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 70vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Modal Image: Displays the image inside the modal with a fixed size and shadow.
const ModalImage = styled.img`
  width: 600px;
  height: 600px;
  margin: 0 auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

// Close Button: A circular red button at the top-right of the modal.
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  outline: none;
`;

/**
 * Modal component to display an image along with additional data.
 * Provides focus management for accessibility and allows closing the modal.
 * 
 * @param {ModalProps} props - The component's props.
 * @returns {JSX.Element|null} - Returns the modal UI or null if no image data is provided.
 */
const Modal: React.FC<ModalProps> = ({ imageData, closeModal }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  /**
   * Traps focus inside the modal, ensuring that keyboard navigation stays within the modal.
   */
  useEffect(() => {
    const handleTab = (event: KeyboardEvent) => {
      const focusableElements = modalRef.current?.querySelectorAll('button');
      if (!focusableElements) return;

      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Handle Shift + Tab for backward navigation
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            event.preventDefault();
          }
        } else {
          // Handle Tab for forward navigation
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    // Add keydown listener to the modal for trapping focus
    if (modalRef.current) {
      modalRef.current.addEventListener('keydown', handleTab);
    }

    return () => {
      // Clean up the event listener on component unmount
      if (modalRef.current) {
        modalRef.current.removeEventListener('keydown', handleTab);
      }
    };
  }, []);

  // If no image data is provided, do not render the modal.
  if (!imageData) return toast.error('An error occurred while load image.'); // Display general error message]

  return (
    <>
    <ModalBackground>
      <ModalContainer ref={modalRef} tabIndex={-1}>
        {/* The Close Button is now focusable */}
        <CloseButton onClick={closeModal} tabIndex={0}>
          X
        </CloseButton>
        {/* Image is non-focusable */}
        <ModalImage
          src={imageData.previewURL}
          alt="Large Image"
          tabIndex={-1}
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.src = './none.jpg'; // Fallback image if the source fails
          }}
        />
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <p style={{color:'black',fontWeight:'bold'}}><strong>Views:</strong> {imageData.views}</p>
          <p style={{color:'black',fontWeight:'bold'}}><strong>Downloads:</strong> {imageData.downloads}</p>
          <p style={{color:'black',fontWeight:'bold'}}> <strong>Collections:</strong> {imageData.collections || 'N/A'}</p>
        </div>
      </ModalContainer>
    </ModalBackground>
      <ToastContainer /> {/* ToastContainer to show notifications */}
    </>
  );
};

export default Modal;
