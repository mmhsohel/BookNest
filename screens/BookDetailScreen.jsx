import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import {updateBtptBook, deleteBtptBook, createBtptBook} from '../services/api2';

const BookDetailScreen = ({route, navigation}) => {
  const {className, book, setAllbook, bookData, version} = route.params || {};
  const isEditing = !!book;
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [serial, setSerial] = useState("")
  const [category, setCategory] = useState('');
  const [filename, setFilename] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [optionalPdfUrlId, setOptionalPdfUrlId] = useState('');
  const [optionalImageUrlId, setOptionalImageUrlId] = useState('');
  const [loading, setLoading] = useState(false);

  
  const subName = version === 'bangla' ? 'subs' : 'envSubs';
 
  useEffect(() => {
    if (isEditing) {
      setId(book?.id || '');
      setTitle(book.title || '');
      setCategory(book.category || '');
      setUrl(book.url || '');
      setFilename(book.filename || '');
      setImageUrl(book.imageUrl || '');
      setImageFile(book.imageFile || '');
      setSerial(book?.serial || '')
    }
  }, [book]);

  const handleSave = async () => {
    if (!title || !category) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    setLoading(true);


    function convertGoogleDriveLinkToDownload(url) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
      if (!match) return url; // return original if not matched

      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    const convertedUrl = convertGoogleDriveLinkToDownload(url);



  function convertGoogleDriveImageLinkToDownload(imageUrl) {
      const match = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
      if (!match) return imageUrl; // return original if not matched

      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    const convertedImageUrl = convertGoogleDriveImageLinkToDownload(imageUrl);


    try {
      const bookUpdateData = {
        id,
        title,
        serial,
        category,
        filename,
        imageFile,
        imageUrl : optionalImageUrlId ? `https://drive.google.com/uc?export=view&id=${optionalImageUrlId}` :  convertedImageUrl,
        url: optionalPdfUrlId ? `https://drive.google.com/uc?export=download&id=${optionalPdfUrlId}` : convertedUrl,
      };
  
      if (isEditing) {
        const updatedBook = await updateBtptBook(
          bookData,
          className,
          subName,
          book._id,
          {
            ...book,
            ...bookUpdateData,
          },
        );

        // 🔁 Immediately update frontend
        setAllbook(prevBooks => {
          return prevBooks.map(item => {
            if (item.class === className || item.envClass === className) {
              const updatedSubs = (item.subs || item.envSubs || []).map(b =>
                b._id === book._id ? updatedBook.book : b,
              );

              return {
                ...item,
                subs: item.subs ? updatedSubs : item.subs,
                envSubs: item.envSubs ? updatedSubs : item.envSubs,
              };
            }
            return item;
          });
        });
      } else {

        const createData = await createBtptBook(
          bookData,
          className,
          subName,
          bookUpdateData,
        );
        setAllbook(prevBooks => {
          return prevBooks.map(item => {
            if (item.class === className || item.envClass === className) {
              const isSubs = Array.isArray(item.subs);
              const targetArray = isSubs ? item.subs : item.envSubs;

              const updatedArray = [...targetArray, bookUpdateData];

              return {
                ...item,
                subs: isSubs ? updatedArray : item.subs,
                envSubs: !isSubs ? updatedArray : item.envSubs,
              };
            }
            return item;
          });
        });

    
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.', error.message);
    } finally {
      setLoading(false);
    }
  };

  const modernInputStyle = {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 40}}>
      <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
        {isEditing ? '✏️ Edit Book' : '➕ Add New Book'}
      </Text>

      <TextInput
        placeholder="Book ID"
        value={id}
        onChangeText={setId}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
        style={modernInputStyle}
      />
      <TextInput
        placeholder="Serial"
        value={serial}
        onChangeText={setSerial}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="File URL (Google Drive"
        value={url}
        onChangeText={setUrl}
        style={modernInputStyle}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Filename"
        value={filename}
        onChangeText={setFilename}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Image URL (Google Drive or Other)"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Image Filename"
        value={imageFile}
        onChangeText={setImageFile}
        style={modernInputStyle}
      />

        <TextInput
        placeholder="Only Google Drive PDF ID (optional)"
        value={optionalPdfUrlId}
        onChangeText={setOptionalPdfUrlId}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Only Google Drive IMAGE ID (optional)"
        value={optionalImageUrlId}
        onChangeText={setOptionalImageUrlId}
        style={modernInputStyle}
      />

      <Button
        title={
          loading
            ? isEditing
              ? 'Updating...'
              : 'Saving...'
            : isEditing
            ? '✅ Update Book'
            : '💾 Add Book'
        }
        onPress={handleSave}
        disabled={
          loading ||
          !title.trim() ||
          !imageFile.trim() ||
          !imageUrl.trim() ||
          !filename.trim() ||
          !category.trim() ||
          !url
        } 
      />
    </ScrollView>
  );
};

export default BookDetailScreen;
