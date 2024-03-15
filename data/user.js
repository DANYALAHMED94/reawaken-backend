import bcrypt from "bcryptjs";

const Users = [
  {
    name: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("987654321", 10),
    role: "Admin",
  },
  // {
  //   name: "arooj",
  //   email: "ashiqarooj846@gmail.com",
  //   password: bcrypt.hashSync("123456", 10),
  //   role: "Admin",
  // },
  // {
  //   name: "fatime",
  //   email: "arooj.fatima.31324@gmail.com",
  //   password: bcrypt.hashSync("123456", 10),
  //   role: "Contractor",
  // },
];

export default Users;
