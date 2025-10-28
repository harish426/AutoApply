const apiUrl = import.meta.env.VITE_API_URL;

export const post = async (endpoint, data, token) => {
  try {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const text = await res.text(); // read raw text
    let json = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      console.warn("Response is not JSON:", text);
    }

    if (!res.ok) {
      throw new Error(
        (json && json.message) || `API request failed with status ${res.status}`
      );
    }

    return json;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

export const saveResume = async (resumeData, email) => {
  try {
    const res = await fetch(`${apiUrl}/resume/${email}`, {
      method: "POST", // Use PUT if updating existing resume
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to save resume");
    }

    return await res.json(); // Return server response (e.g., success message)
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// api.js
export const getResume = async (userEmail) => {
  try {
    const res = await fetch(`${apiUrl}/resume/${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch resume");
    }

    const data = await res.json();
    return data.resume; // ✅ Only return the resume field
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// api.js
export const saveProfile = async (profileData) => {
  try {
    const res = await fetch(`${apiUrl}/profile/${profileData.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to save profile");
    }

    const data = await res.json();

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

// ✅ Fetch profile by email
export const getProfile = async (email) => {
  try {
    const res = await fetch(`${apiUrl}/profile/${email}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch profile");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};
