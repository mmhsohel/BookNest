import { useState } from "react";
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInput } from "react-native-gesture-handler";
import { logoutUser } from "../redux/slices/authSlice";



const CustomHeader = ({navigation, title}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveChanges = () => {
    // Add real validation and update logic here (API or context update)


    // Close both modals after saving
    setEditModalVisible(false);
    setModalVisible(false);

    alert('Profile updated!');
  };
  return (
    <View style={styles.header}>
      {/* Left: Menu Icon */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={32} color="#fff" marginTop={20} />
      </TouchableOpacity>

      {/* Center: Title */}
      <View style={styles.headerCenter}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right: Avatar */}
      <TouchableOpacity onPress={() => alert('Profile pressed')}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {user ? (
            <Text style={styles.usernameText}>{user?.name}</Text>
          ) : (
            <Image
              source={{uri: 'https://i.pravatar.cc/300'}}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>

        {/* First Modal - Options */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Hello, {user?.name}</Text>

              <Button
                title="Update Profile"
                onPress={() => {
                  setEditModalVisible(true);
                }}
              />

              <View style={{marginTop: 10}}>
                <Button
                  title="Logout"
                  color="red"
                  onPress={() => {
                    dispatch(logoutUser());
                    setModalVisible(false);
                  }}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Second Modal - Edit Profile */}
        <Modal
          animationType="slide"
          transparent
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TextInput
                placeholder="New Username"
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
              />

              <TextInput
                placeholder="New Password"
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Button title="Save Changes" onPress={handleSaveChanges} />

              <View style={{marginTop: 10}}>
                <Button
                  title="Cancel"
                  color="gray"
                  onPress={() => setEditModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 100,
    backgroundColor: '#00b377', //'#1abc9c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginTop: 20,
  },
  usernameText: {
    color: '#fff',
    marginTop: 20,
    marginRight: 10,
    fontWeight: '700',
    fontSize: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
