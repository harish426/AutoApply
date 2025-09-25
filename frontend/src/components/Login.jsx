import { Button, Paper, Title, Text } from "@mantine/core";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user); // send user to App state
      navigate("/home"); // force redirect
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{
          width: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Title order={2} ta="center" mt="md" mb={50} c="white">
          Welcome to AutoApply
        </Title>
        <Text ta="center" mt="md" mb={20} c="white">
          Sign in to continue
        </Text>
        <Button
          fullWidth
          mt="xl"
          onClick={handleGoogleLogin}
          leftSection={<FcGoogle size={24} />}
        >
          Sign in with Google
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
