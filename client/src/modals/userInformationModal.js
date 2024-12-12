// import React, { useState } from 'react';
// import "../styles/userInformationModal.css"; // Assuming you have modal-specific styles here

// const Modal = ({ isOpen, onClose, title, onSubmit }) => {
//   // Declare all hooks first, before any conditional logic
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   // If the modal is not open, don't render it (early return)
//   if (!isOpen) return null;

//   const handleClose = () => {
//     onClose(); // Close the modal when the close button is clicked
//     setError(''); // Clear error message
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate that name, email, and password are filled
//     if (!userName || !email || !password) {
//       setError('Name, email, and password are required.');
//       return; // Don't submit if any of the fields are empty
//     }

//     if (onSubmit) {
//       onSubmit({ userName, email, password }); // Trigger the onSubmit function passed in as a prop
//     }

//     // Clear the fields after successful submission
//     setUserName('');
//     setEmail('');
//     setPassword('');
//     setError('');
//     onClose(); // Close the modal after submission
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>{title}</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Name Input */}
//           <div className="modal-input">
//             <label htmlFor="userName">Name:</label>
//             <input
//               type="text"
//               id="userName"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Email Input */}
//           <div className="modal-input">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div className="modal-input">
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <p className="error-message">{error}</p>} {/* Display error message */}

//           <div className="modal-buttons">
//             <button type="submit">Submit</button>
//             <button type="button" onClick={handleClose}>Close</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Modal;
