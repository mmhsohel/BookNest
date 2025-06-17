// api.js
import axios from 'axios';

const BASE_URL = 'https://booknest-1-vowm.onrender.com/api'; // for Android emulatorc
const USER_URL = 'https://booknest-1-vowm.onrender.com/user'; 

export const createBtptBook = async (modelName, className, subName, bookUpdateData) => {

  const response = await axios.post(`${BASE_URL}/${modelName}/${className}/${subName}/add`, bookUpdateData);
  return response.data;
};

export const createClass = async (modelName, classUpdateData) => {
 
  const response = await axios.post(`${BASE_URL}/${modelName}`, classUpdateData);
  return response.data;
};

export const editClass = async (modelName, className, classChangeData) => {
 
  const response = await axios.patch(`${BASE_URL}/${modelName}/${className}`, classChangeData);
  return response.data;
};


export const deleteClass = async (modelName, className) => {
 
  const response = await axios.delete(`${BASE_URL}/${modelName}/${className}`);
  return response.data;
};


export const editCardAndCarousel = async (card, cardId, cardUpdateData) => {

const response = await axios.patch(`${BASE_URL}/cardandcarousel/${card}/${cardId}`, cardUpdateData)
return response.data
}

export const deleteCardAndCarousel = async (card, cardId) => {

const response = await axios.delete(`${BASE_URL}/cardandcarousel/${card}/${cardId}`)
return response.data
}

export const getAllUser  = async ()=> {
const response = await axios.get(`${USER_URL}/admin`)
return response.data
}

export const updateUser = async (userId, updatedData)=> {
 
  const response = await axios.patch(`${USER_URL}/admin/${userId}`, updatedData)
  return response.data
}

export const getBtptBooks = async () => {
  const response = await axios.get(`${BASE_URL}/btptbooks`);
  return response.data;
};

// ✅ FIXED: include both className and bookId in the route
export const updateBtptBook = async (modelName, className, subName, bookId, updatedBook) => {
  const response = await axios.patch(`${BASE_URL}/${modelName}/${className}/${subName}/${bookId}`, updatedBook);
   return response.data;
};

// ✅ FIXED: include both className and bookId in the route
export const deleteBtptBook = async (className, bookId) => {
   const response = await axios.delete(`${BASE_URL}/btptbooks/${className}/books/${bookId}`);
  return response.data;
};
