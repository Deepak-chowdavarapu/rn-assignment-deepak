import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskItem = ({ item, onToggle, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.textContainer} 
        onPress={() => onToggle(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checked]} />
        <Text style={[styles.text, item.completed && styles.strikethrough]}>
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 5,
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#4A90E2',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    paddingHorizontal: 10,
  },
  deleteText: {
    color: '#FF5C5C',
    fontWeight: 'bold',
  },
});

export default TaskItem;