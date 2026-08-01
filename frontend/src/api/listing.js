import API_URL from "./config";

const API = API_URL;

function getToken() {
  return localStorage.getItem("token");
}

export async function getMyListings() {
  const response = await fetch(`${API}/api/my-listings`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load listings");
  }

  return data;
}

export async function createListing(formData) {
  const response = await fetch(`${API}/api/listings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create listing");
  }

  return data;
}

export async function updateListing(id, formData) {
  const response = await fetch(`${API}/api/listings/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update listing");
  }

  return data;
}

export async function deleteListing(id) {
  const response = await fetch(`${API}/api/listings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete listing");
  }

  return data;
}

export async function getListing(id) {
  const response = await fetch(`${API}/api/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load listing");
  }

  return data;
}
