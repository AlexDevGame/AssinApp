import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null); 

  const loadTasks = async () => {
    try {
      const storedTasks = await SecureStore.getItemAsync('tasks');
      if (storedTasks !== null) {
        setTaskList(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addTask = async () => {
    if (task.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite uma tarefa válida.');
      return;
    }
    try {
      const newTaskList = [...taskList, task];
      setTaskList(newTaskList);
      await SecureStore.setItemAsync('tasks', JSON.stringify(newTaskList));
      setTask(''); 
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (index) => {
    try {
      const newTaskList = taskList.filter((_, i) => i !== index);
      setTaskList(newTaskList);
      await SecureStore.setItemAsync('tasks', JSON.stringify(newTaskList));
    } catch (e) {
      console.error(e);
    }
  };

  const editTask = (index) => {
    const selectedTask = taskList[index];
    setTask(selectedTask); 
    setIsEditing(true); 
    setCurrentTaskIndex(index); 
  };

  const updateTask = async () => {
    if (task.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite uma tarefa válida.');
      return;
    }
    try {
      const updatedTaskList = taskList.map((item, index) => {
        if (index === currentTaskIndex) {
          return task; 
        }
        return item;
      });

      setTaskList(updatedTaskList);
      await SecureStore.setItemAsync('tasks', JSON.stringify(updatedTaskList));
      setTask(''); 
      setIsEditing(false); 
      setCurrentTaskIndex(null); 
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite a tarefa"
        value={task}
        onChangeText={setTask}
      />
      
      <Button
        title={isEditing ? "Atualizar Tarefa" : "Adicionar Tarefa"}
        onPress={isEditing ? updateTask : addTask}
      />

      <FlatList
        data={taskList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editTask(index)}
              >
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(index)}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#00c853',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
  },
});

export default App;