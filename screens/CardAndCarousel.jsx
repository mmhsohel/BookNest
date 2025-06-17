import {Alert, Button, StyleSheet, Text, View, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {editClass, createClass, editCardAndCarousel} from '../services/api2';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

const CardAndCarousel = ({navigation, route}) => {
  const {item, cards, setCards, modelName} = route.params || {};




  const isEditing = !!item;


  const [id, setId] = useState('');
  const [serial, setSerial] = useState('')
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [description, setDescription] = useState('');
  const [screen, setScreen] = useState('');
  const [title, setTitle] = useState('');
  const [itemData, setItemData] = useState('');
  const [optionalImageUrlId, setOptionalImageUrlId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setId(item?.id || '');
      setSerial(item?.serial || '');
      setImage(item?.image || '');
      setImageFile(item?.imageFile || '');
      setDescription(item?.description || '');
      setScreen(item?.screen || '');
      setTitle(item?.title || '');
      setItemData(item?.itemData || '');
    }
  }, [isEditing, item]);



  function convertGoogleDriveImageLinkToDownload(image) {
    const match = image.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (!match) return image; // return original if not matched

    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  const convertedImageUrl = convertGoogleDriveImageLinkToDownload(image);



  const handleSave = async () => {
   
    if (!id || !title || !description || screen || !itemData, !imageFile || !image) {
      Alert.alert('❗ Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const cardUpdateData = {
        id,
        serial,
        title,
        description,
        screen,
        itemData,
        imageFile,
        image: optionalImageUrlId
          ? `https://drive.google.com/uc?export=view&id=${optionalImageUrlId}` : convertedImageUrl,
      };


      if (isEditing) {
       const cardId = item?._id
        await editCardAndCarousel(modelName, cardId, cardUpdateData);

        // setItemClass(prev => {
        //   const updated = prev.map(c =>
        //     c === item
        //       ? version === 'bangla'
        //         ? banglaClassName
        //         : envClass
        //       : c,
        //   );
        //   return updated;
        // });


      } else {
  
        await createClass(modelName, cardUpdateData);

        // Update local class list
         setCards(prev => [...prev, cardUpdateData]);
      }
      // Save to backend

      navigation.goBack();
    } catch (error) {
      Alert.alert('🚨 Error', 'Something went wrong: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
//https://drive.google.com/file/d/1Whg2IwUCfLuxZ6IDiAFG2b06CDbz6EBQ/view?usp=drive_link
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
        {isEditing ? '✏️ Edit Card' : '➕ Add New Card'}
      </Text>

      { modelName === 'card' ? (
        <>
        <TextInput
        placeholder="Card Id"
        value={id}
        onChangeText={setId}
        style={modernInputStyle}
      />

       <TextInput
        placeholder="Serial"
        value={serial}
        onChangeText={setSerial}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Card Title"
        value={title}
        onChangeText={setTitle}
        style={modernInputStyle}
      />
      <TextInput
        placeholder="Card Description"
        value={description}
        onChangeText={setDescription}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Google Drive Card Image Link or Any link"
        value={image}
        onChangeText={setImage}
        style={modernInputStyle}
      />

       <TextInput
        placeholder="Only Google Drive Image Link Id"
        value={optionalImageUrlId}
        onChangeText={setOptionalImageUrlId}
        style={modernInputStyle}
      />

       <TextInput
        placeholder="Image File Name"
        value={imageFile}
        onChangeText={setImageFile}
        style={modernInputStyle}
      />


      <TextInput
        placeholder="Data Model Name or Database Name"
        value={itemData}
        onChangeText={setItemData}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Card Screen"
        value={screen}
        onChangeText={setScreen}
        style={modernInputStyle}
      />

        </>
      ) : (
      
      <>
      <TextInput
        placeholder="Carousel Id"
        value={id}
        onChangeText={setId}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Carousel Title"
        value={title}
        onChangeText={setTitle}
        style={modernInputStyle}
      />

      <TextInput
        placeholder="Google Drive Card Image Link or Any link"
        value={image}
        onChangeText={setImage}
        style={modernInputStyle}
      />

       <TextInput
        placeholder="Only Google Drive Image Link Id"
        value={optionalImageUrlId}
        onChangeText={setOptionalImageUrlId}
        style={modernInputStyle}
      />

       <TextInput
        placeholder="Image File Name"
        value={imageFile}
        onChangeText={setImageFile}
        style={modernInputStyle}
      />

      </>
    )}

      <Button
        title={
          loading
            ? isEditing
              ? 'Updating...'
              : 'Saving...'
            : isEditing
            ? '✅ Update Card'
            : '💾 Add Card'
        }
        onPress={handleSave}
        disabled={modelName === 'card' ? (loading || !id || !title || !description || !image || !screen || !itemData || !imageFile) : loading || !id || !title || !image || !imageFile}
      />
    </ScrollView>
  );
};

export default CardAndCarousel;

const styles = StyleSheet.create({});

