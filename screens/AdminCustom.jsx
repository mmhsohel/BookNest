import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logoutUser } from "../redux/slices/authSlice";
import { useNavigation } from "@react-navigation/native";

const AdminCustom = ({ title }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Get navigation from context
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [newName, setNewName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveChanges = () => {
    // In production: validate & update user data via API
   

    setEditModalVisible(false);
    setModalVisible(false);
    alert("Profile updated!");
  };

  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.header}>
      {/* Left: Back or Menu Icon */}
      {canGoBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Center: Title */}
      <View style={styles.headerCenter}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right: Profile/Username */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {user ? (
          <Text style={styles.usernameText}>{user?.name}</Text>
        ) : (
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        )}
      </TouchableOpacity>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> {user?.name}</Text>

            <Button
              title="Update Profile"
              onPress={() => {
                setEditModalVisible(true);
              }}
            />

            <View style={{ marginTop: 10 }}>
              <Button
                title="Logout"
                color="red"
                onPress={() => {
                  dispatch(logoutUser());
                  setModalVisible(false);
                }}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
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

            <View style={{ marginTop: 10 }}>
              <Button
                title="Cancel"
                color="gray"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminCustom;

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: "#00b377",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 30,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  usernameText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
