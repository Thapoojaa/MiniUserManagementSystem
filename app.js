const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");
const fetchUserBtn = document.getElementById("fetchUserBtn");

let users = [];

// Validate email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Render users
const renderUsers = () => {
  userList.innerHTML = "";
  users.forEach((user, index) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.image}" alt="${user.name}" />
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>${user.location}</p>
      <button onclick="deleteUser(${index})">X</button>
    `;
    userList.appendChild(card);
  });
};

// Add user manually
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const location = document.getElementById("location").value.trim();
  const image = document.getElementById("imageUrl").value.trim();

  if (!name || !email || !location || !image) {
    alert("All fields are required!");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Invalid email format.");
    return;
  }

  if (users.some((user) => user.email === email)) {
    alert("Email already exists!");
    return;
  }

  const newUser = { name, email, location, image };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
  userForm.reset();
});

// Delete user
function deleteUser(index) {
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
}

// Fetch 5 users initially
const fetchUsers = async () => {
  const res = await fetch("https://randomuser.me/api/?results=5");
  const data = await res.json();
  return data.results.map((user) => ({
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    location: `${user.location.city}, ${user.location.country}`,
    image: user.picture.medium,
  }));
};

// Fetch a single random user
const fetchSingleUser = async () => {
  try {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    const user = data.results[0];
    const newUser = {
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      location: `${user.location.city}, ${user.location.country}`,
      image: user.picture.medium,
    };

    if (users.some((u) => u.email === newUser.email)) {
      alert("Fetched user already exists.");
      return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  } catch (error) {
    alert("Failed to fetch user.");
    console.error(error);
  }
};

// Event: Fetch new user
fetchUserBtn.addEventListener("click", fetchSingleUser);

// Initialize
const init = async () => {
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const apiUsers = await fetchUsers();
  users = [...apiUsers, ...storedUsers];
  renderUsers();
};

init();
