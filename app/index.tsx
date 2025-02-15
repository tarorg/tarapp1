import React, { useState, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { init, User } from "@instantdb/react-native";

const APP_ID = "84f087af-f6a5-4a5f-acbc-bc4008e3a725";
const db = init({ appId: APP_ID });

export default function App() {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Uh oh! {error.message}</Text>
      </View>
    );
  }

  if (user) {
    return <Main user={user} />;
  }

  return <Login />;
}

function Main({ user }: { user: User }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {user.email}!</Text>
      <TouchableOpacity style={styles.button} onPress={() => db.auth.signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {!sentEmail ? (
        <EmailStep onSendEmail={setSentEmail} />
      ) : (
        <CodeStep sentEmail={sentEmail} />
      )}
    </View>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onSendEmail(email);
    db.auth.sendMagicCode({ email }).catch((err) => {
      alert("Uh oh :" + err.body?.message);
      onSendEmail("");
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Let's log you in</Text>
      <Text style={styles.description}>
        Enter your email, and we'll send you a verification code. We'll create
        an account for you too if you don't already have one.
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>
    </View>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    db.auth.signInWithMagicCode({ email: sentEmail, code })
      .then(() => {
        router.replace("/space");
      })
      .catch((err) => {
        setCode("");
        alert("Uh oh :" + err.body?.message);
      });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Enter your code</Text>
      <Text style={styles.description}>
        We sent an email to <Text style={styles.bold}>{sentEmail}</Text>. Check your email, and
        paste the code you see.
      </Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="123456..."
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  formContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#666",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444",
  },
  bold: {
    fontWeight: "bold",
  },
});
