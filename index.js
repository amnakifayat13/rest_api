const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs")

const app = express();

const PORT = 5000;

app.use(express.json());
// Routes

app.get("/api/users", (req, res) => {
  const { search } = req.query;

  if (search) {
    const filteredUsers = users.filter(user =>
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    return res.json(filteredUsers);
  }

  return res.json(users); // agar koi search query nahi di ho to pura list bhej do
});



app.route("/api/users/:id").get(
(req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user)
})
.patch((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;

    fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user" });
      }
      return res.json({ status: "User updated", data: updatedUser });
    });
  })


  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(index, 1);

    fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete user" });
      }
      return res.json({ status: "User deleted", data: deletedUser[0] });
    });
  });



app.post("/api/users", (req, res) => {
  const userData = req.body;
  users.push({ ...userData, id: users.length + 1 });
  fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ status: "error", error: err.message });
    }
    return res.json({ status: "Success", id: users.length });
  });
});


app.listen(PORT, () => console.log(`server started at the port ${PORT}`));
