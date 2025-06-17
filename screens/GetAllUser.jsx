import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Switch,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllUser, updateUser } from '../services/api2';

const GetAllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  // For Date Picker
  const [openPickerForUser, setOpenPickerForUser] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUser();
        setUsers(result?.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = async (userId) => {
    const updatedData = editingUser[userId];
    if (!updatedData) return;

    try {
    
      await updateUser(userId, updatedData);
      Alert.alert('✅ Success', 'User updated successfully');
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to update user');
      console.error('Update failed', error);
    }
  };

  const handleChange = (userId, field, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
    );

    filtered.sort((a, b) => {
      const valA = sortKey === 'date' ? new Date(a.createdAt) : (a[sortKey] || '');
      const valB = sortKey === 'date' ? new Date(b.createdAt) : (b[sortKey] || '');

      return sortOrderAsc
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });

    return filtered;
  }, [users, searchQuery, sortKey, sortOrderAsc]);

  const renderUser = ({ item }) => {
    const currentEdits = editingUser[item._id] || {};

    return (
      <View style={styles.userCard}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userInfo}>📞 {item.phone || 'N/A'}</Text>
        <Text style={styles.userInfo}>✉️ {item.email || 'N/A'}</Text>
        <Text style={styles.userInfo}>📅 {new Date(item.createdAt).toDateString()}</Text>

        <Text style={styles.label}>🧩 Role</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={currentEdits.role || item.role}
            onValueChange={(value) => handleChange(item._id, 'role', value)}
            style={styles.picker}>
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Editor" value="editor" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>🚫 Blocked</Text>
          <Switch
            value={currentEdits.isBlocked ?? item.isBlocked}
            onValueChange={(value) =>
              handleChange(item._id, 'isBlocked', value)
            }
          />
        </View>

        <Text style={styles.label}>🔓 Access Level</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={currentEdits.accessLevel || item.accessLevel}
            onValueChange={(value) =>
              handleChange(item._id, 'accessLevel', value)
            }
            style={styles.picker}>
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Limited" value="limited" />
            <Picker.Item label="Time Limited" value="time-limited" />
          </Picker>
        </View>

        {(currentEdits.accessLevel === 'time-limited' ||
          item.accessLevel === 'time-limited') && (
          <>
            <Text style={styles.label}>⏳ Access Expiry</Text>
            <TouchableOpacity
              onPress={() => {
                setTempDate(
                  currentEdits.accessExpiresAt
                    ? new Date(currentEdits.accessExpiresAt)
                    : item.accessExpiresAt
                      ? new Date(item.accessExpiresAt)
                      : new Date()
                );
                setOpenPickerForUser(item._id);
              }}
              style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {new Date(
                  currentEdits.accessExpiresAt ||
                  item.accessExpiresAt ||
                  new Date()
                ).toDateString()}
              </Text>
            </TouchableOpacity>

            {openPickerForUser === item._id && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (event.type === 'set') {
                    handleChange(item._id, 'accessExpiresAt', selectedDate);
                  }
                  setOpenPickerForUser(null);
                }}
              />
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => handleUpdate(item._id)}
          style={styles.updateButton}>
          <Text style={styles.updateButtonText}>💾 Update User</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F62FE" />
        <Text style={{ marginTop: 8, color: '#555' }}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Manage Users</Text>
      <Text style={styles.totalText}>
        Total Users: {filteredAndSortedUsers.length}
      </Text>
      <Text style={styles.label}>🔍 Search</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or phone"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#aaa"
      />

      <View style={styles.sortRow}>
        <View style={styles.sortPicker}>
          <Picker
            selectedValue={sortKey}
            onValueChange={(value) => setSortKey(value)}>
            <Picker.Item label="Sort by Name" value="name" />
            <Picker.Item label="Sort by Phone" value="phone" />
            <Picker.Item label="Sort by Date" value="date" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => setSortOrderAsc(!sortOrderAsc)}
          style={styles.sortButton}>
          <Text style={{ color: '#fff' }}>
            {sortOrderAsc ? '⬆️ Asc' : '⬇️ Desc'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default GetAllUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  userInfo: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    marginBottom: 10,
  },
  picker: {
    height: 54,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  updateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortPicker: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  sortButton: {
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 10,
  },
  datePickerText: {
    color: '#111827',
    fontSize: 16,
  },
});
