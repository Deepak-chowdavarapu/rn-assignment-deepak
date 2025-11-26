import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskItem from '../components/TaskItem';

const STORAGE_KEY = '@todo_list_data';

export default function Home() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  // Helper to get formatted date
  const getTodayDate = () => {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    // e.g., "Wednesday, November 26"
    return now.toLocaleDateString('en-US', options);
  };
  const todayDate = getTodayDate();

  // --- Load/Save Logic (Same as before) ---
  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(taskList);
  }, [taskList]);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks.');
    }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTaskList(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load tasks.');
    }
  };

  // --- Handlers (Same as before) ---
  const handleAddTask = () => {
    if (task.trim().length === 0) return;
    const newTask = { id: Date.now().toString(), text: task, completed: false };
    setTaskList([...taskList, newTask]);
    setTask('');
  };

  const handleDeleteTask = (id) => {
    setTaskList(taskList.filter((item) => item.id !== id));
  };

  const handleToggleTask = (id) => {
    setTaskList(taskList.map((item) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <View style={styles.container}>
      {/* Ensure status bar text is light so it shows on the dark header */}
      <StatusBar barStyle="light-content" />

      {/* NEW HEADER DESIGN */}
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSubtitle}>{todayDate}</Text>
        <View style={styles.taskCounter}>
          <Text style={styles.counterText}>
            {taskList.filter(t => !t.completed).length} remaining
          </Text>
        </View>
      </View>

      {/* Task List Container */}
      <View style={styles.contentContainer}>
        <FlatList
          data={taskList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem 
              item={item} 
              onToggle={handleToggleTask} 
              onDelete={handleDeleteTask} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet. Add one below!</Text>
          }
        />
      </View>

      {/* Input Section */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask} activeOpacity={0.8}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Slightly lighter gray background
  },
  // --- New Header Styles ---
  headerWrapper: {
    backgroundColor: '#4A90E2', // A nice blue brand color
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Extra padding for status bar
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // Adds depth
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1, // Ensure header sits on top
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white
    marginTop: 5,
  },
  taskCounter: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  counterText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14
  },
  // --- Content Styles ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 120, // More space for input
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
  // --- Input Styles (Minor tweaks) ---
  inputWrapper: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    flex: 1, // Take available space
    marginRight: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#4A90E2', // Match header color
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  addText: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
  },
});