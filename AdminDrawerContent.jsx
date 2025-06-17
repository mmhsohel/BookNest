
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { logoutUser } from "./redux/slices/authSlice";
import { useSelector } from "react-redux";

const AdminDrawerContent = ({ navigation }) => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => dispatch(logoutUser()) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=5" }}
          style={styles.avatar}
        />
        <Text style={styles.headerText}> {user?.name}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Section 1 --- */}
         <Section title="Section 1">
          <DrawerItem
            label="Dashboard"
            icon="dashboard"
            onPress={() =>
              navigation.navigate("Admin", {
                screen: "admin",
              })
            }
          />
       
          <DrawerItem
            label="User Management"
            icon="dashboard"
            onPress={() =>
              navigation.navigate("Admin", {
                screen: "user",
              })
            }
          />
          <DrawerItem
            label="Card Management"
            icon="dashboard"
            onPress={() =>
              navigation.navigate("Admin", {
               screen: "card"
              })
            }
          />
            <DrawerItem
            label="Carousel Management"
            icon="dashboard"
            onPress={() =>
              navigation.navigate("Admin", {
               screen: "carousel"
              })
            }
          />
        </Section>

       
      </DrawerContentScrollView>

      {/* Footer (Logout) */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.footerButton}>
          <MaterialIcons
            name="logout"
            size={22}
            color="red"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.footerText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Section component
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.separator} />
    {children}
  </View>
);

// Drawer item
const DrawerItem = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <MaterialIcons name={icon} size={22} color="#fff" style={styles.icon} />
    <Text style={styles.menuItem}>{label}</Text>
  </TouchableOpacity>
);

export default AdminDrawerContent;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2e2e2e",
    backgroundColor: "#2c3e50",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#444",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1abc9c",
    marginBottom: 6,
    paddingLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#2e2e2e",
    marginBottom: 10,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  icon: {
    marginRight: 16,
  },
  menuItem: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1f1f1f",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
