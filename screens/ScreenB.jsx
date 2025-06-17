import {Alert, Button, StyleSheet, Text, View, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {editClass, createClass} from '../services/api2';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
const ScreenB = ({navigation, route}) => {
  const { item, books, bookData, version, itemClass, setItemClass, isEdit } =
    route.params || {};

  const isEditing = !!item;

  const [banglaClassName, setBanglaClassName] = useState('');
  const [envClass, setEnvClass] = useState('');
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && item) {
      setSerial(item?.serial || '');
      if (version === 'bangla') setBanglaClassName(item.id || '');
      else setEnvClass(item.id || '');
    }
  }, [isEditing, item, version]);

  const handleSave = async () => {
    const newClassName =
      version === 'bangla' ? banglaClassName.trim() : envClass.trim();

    if (!newClassName) {
      Alert.alert('❗ Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await editClass(bookData, item?.id, {
          class: banglaClassName,
          envClass: envClass,
          version,
          serial: serial?.trim(),
        });

        // ✅ Update local itemClass
        setItemClass(prev =>
          prev.map(c =>
            c.id === item.id
              ? {
                  ...c,
                  id: version === 'bangla' ? banglaClassName : envClass,
                  serial: serial?.trim(),
                }
              : c
          )
        );
      } else {
        await createClass(bookData, {
          class: banglaClassName,
          envClass: envClass,
          version,
          serial: serial?.trim(),
        });

        // ✅ Add to local itemClass only if doesn't already exist
        setItemClass(prev => {
          const id = version === 'bangla' ? banglaClassName : envClass;
          const exists = prev.some(item => item.id === id);
          if (exists) return prev;
          return [...prev, { id, serial: serial?.trim() }];
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('🚨 Error', 'Something went wrong: ' + error.message);
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

      {version === 'bangla' ? (
        <>
          <TextInput
            placeholder="Bangla Class Name"
            value={banglaClassName}
            onChangeText={setBanglaClassName}
            style={modernInputStyle}
          />
          <TextInput
            placeholder="Serial"
            value={serial}
            onChangeText={setSerial}
            style={modernInputStyle}
            keyboardType="numeric"
          />
        </>
      ) : (
        <>
          <TextInput
            placeholder="English Class Name"
            value={envClass}
            onChangeText={setEnvClass}
            style={modernInputStyle}
          />
          <TextInput
            placeholder="Serial"
            value={serial}
            onChangeText={setSerial}
            style={modernInputStyle}
            keyboardType="numeric"
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
            ? '✅ Update Class'
            : '💾 Add Class'
        }
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default ScreenB;

const styles = StyleSheet.create({});
