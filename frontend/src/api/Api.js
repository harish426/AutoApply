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
    const payload = {
      ...resumeData,
      certifications: (resumeData.certifications || []).map((item) =>
        typeof item === "string" ? item.trim() : String(item.name || "")
      ),
    };
    const res = await fetch(`${apiUrl}/resume/${email}`, {
      method: "POST", // or PUT if updating
      headers: {
        "Content-Type": "application/json",
        // Add auth if needed
        // "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to save resume");
    }

    return await res.json();
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
        // "Authorization": `Bearer ${token}` if needed
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch resume");
    }
    console.log("Respones data", res.json);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};
