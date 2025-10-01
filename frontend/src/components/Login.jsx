// import { Button, Paper, Title, Text } from "@mantine/core";
// import { FcGoogle } from "react-icons/fc";
// import { auth, provider, signInWithPopup } from "../firebase";
// import { useNavigate } from "react-router-dom";

// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const token = await user.getIdToken(); // if you need it
//       const userData = {
//         name: user.displayName,
//         email: user.email,
//         photo: user.photoURL,
//         token: token,
//       };
//     // // Call API 1 → authentication & user profile
//     // const res1 = await fetch("http://localhost:5000/api/auth/google", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     //   body: JSON.stringify({
//     //     email: user.email,
//     //     token,
//     //   }),
//     // });

//     // if (!res1.ok) throw new Error("Auth API failed");
//     // const profile = await res1.json();

//     // // Store user data
//     // localStorage.setItem("profile", JSON.stringify(profile));

//     // // Call API 2 → maybe jobs, preferences, or custom user data
//     // const res2 = await fetch("http://localhost:5000/api/user/preferences", {
//     //   method: "GET",
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });

//     // if (!res2.ok) throw new Error("Preferences API failed");
//     // const resume = await res2.json();

//     // // Store resume separately
//     // localStorage.setItem("resume", JSON.stringify(resume));

//       localStorage.setItem("user", JSON.stringify(userData));
//       onLogin(user); // send user to App state
//       navigate("/home"); // force redirect
//     } catch (error) {
//       console.error("Google login error:", error);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//       }}
//     >
//       <Paper
//         withBorder
//         shadow="md"
//         p={30}
//         mt={30}
//         radius="md"
//         style={{
//           width: "400px",
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <Title order={2} ta="center" mt="md" mb={50} c="white">
//           Welcome to AutoApply
//         </Title>
//         <Text ta="center" mt="md" mb={20} c="white">
//           Sign in to continue
//         </Text>
//         <Button
//           fullWidth
//           mt="xl"
//           onClick={handleGoogleLogin}
//           leftSection={<FcGoogle size={24} />}
//         >
//           Sign in with Google
//         </Button>
//       </Paper>
//     </div>
//   );
// };

// export default Login;
import { Button, Paper, Title, Text } from "@mantine/core";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";
import { post } from "../api/api"; // import API helper

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        token,
      };

      // 1️⃣ Save locally
      localStorage.setItem("user", JSON.stringify(userData));

      // 2️⃣ Update App state
      onLogin(userData);

      // 3️⃣ Save to backend
      await post(
        "/login",
        { name: user.displayName, email: user.email },
        token
      );

      // 4️⃣ Redirect
      navigate("/home");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Please try again.");
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
