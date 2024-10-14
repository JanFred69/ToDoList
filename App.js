import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Button, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LightTheme = {
  background: '#fff',
  text: '#333',
  taskBackground: '#f9f9f9',
};

const DarkTheme = {
  background: '#121212',
  text: '#fff',
  taskBackground: '#1f1f1f',
};

const ThemeContext = React.createContext();

const TaskItem = ({ task, onComplete, onDelete, onEdit }) => {
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? DarkTheme : LightTheme;

  return (
    <View style={[styles.taskContainer, { backgroundColor: theme.taskBackground }]}>
      <TouchableOpacity onPress={onComplete}>
        <Icon name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={theme.text} />
      </TouchableOpacity>
      <Text style={[styles.taskText, { color: theme.text }, task.completed && styles.completed]}>
        {task.title}
      </Text>

      {/* Edit Button */}
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Icon name="create-outline" size={24} color={theme.text} />
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Icon name="trash-bin" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const TaskList = ({ tasks, onComplete, onDelete, onEdit }) => {
  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onComplete={() => onComplete(item.id)}
          onDelete={() => onDelete(item.id)}
          onEdit={() => onEdit(item.id, item.title)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const AddTaskModal = ({ visible, taskToEdit, onAddTask, onClose, isEdit }) => {
  const [taskTitle, setTaskTitle] = useState(taskToEdit ? taskToEdit.title : '');

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(taskTitle);
      setTaskTitle('');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <Button title={isEdit ? "Edit Task" : "Add Task"} onPress={handleAddTask} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

// HomeScreen Component
const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); 
  const [isEdit, setIsEdit] = useState(false); 
  const { darkMode, setDarkMode } = useContext(ThemeContext); 

  const addTask = (taskTitle) => {
    if (isEdit && taskToEdit) {
      setTasks(tasks.map(task => task.id === taskToEdit.id ? { ...task, title: taskTitle } : task));
      setIsEdit(false);
      setTaskToEdit(null);
    } else {
      setTasks([...tasks, { id: Date.now(), title: taskTitle, completed: false }]);
    }
    setShowModal(false);
  };

  const completeTask = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, taskTitle) => {
    setTaskToEdit({ id: taskId, title: taskTitle });
    setIsEdit(true);
    setShowModal(true);
  };

  const theme = darkMode ? DarkTheme : LightTheme; 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.text }]}>My Tasks</Text>
        <Switch
          value={darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
          thumbColor={darkMode ? "#fff" : "#333"}
        />
      </View>

      <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} onEdit={editTask} />
      <Button title="Add Task" onPress={() => { setShowModal(true); setIsEdit(false); setTaskToEdit(null); }} />
      <AddTaskModal
        visible={showModal}
        onAddTask={addTask}
        onClose={() => setShowModal(false)}
        taskToEdit={taskToEdit}
        isEdit={isEdit}
      />
    </View>
  );
};

// Main App Component
const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <HomeScreen />
    </ThemeContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  taskText: {
    marginLeft: 15,
    fontSize: 18,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    marginLeft: 10,
  },
  editButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 5,
    fontSize: 18,
  },
});

export default App;
