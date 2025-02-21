import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get('window');

export default function ItemModal({ visible, onClose, initialData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const database = useSQLiteContext();
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height * 0.2) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }

    if (initialData?.id) {
      setEditMode(true);
      loadData(initialData.id);
    }
  }, [visible, initialData]);

  const loadData = async (id) => {
    const result = await database.getFirstAsync<{
      id: number;
      name: string;
      email: string;
    }>(`SELECT * FROM users WHERE id = ?`, [id]);
    setName(result?.name!);
    setEmail(result?.email!);
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSave = async () => {
    try {
      const response = await database.runAsync(
        `INSERT INTO users (name, email, image) VALUES (?, ?, ?)`,
        [name, email, ""]
      );
      console.log("Item saved successfully:", response?.changes!);
      handleClose();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, initialData.id]
      );
      console.log("Item updated successfully:", response?.changes!);
      handleClose();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        <View style={styles.content}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            style={styles.textInput}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.button, { backgroundColor: "#ff4444" }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={editMode ? handleUpdate : handleSave}
              style={[styles.button, { backgroundColor: "#4444ff" }]}
            >
              <Text style={styles.buttonText}>{editMode ? "Update" : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  content: {
    gap: 20,
  },
  textInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: "600",
    color: "white",
    fontSize: 16,
  },
});
