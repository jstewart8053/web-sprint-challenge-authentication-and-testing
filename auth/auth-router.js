const router = require('express').Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const users = require('../users/users-model');

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid Credentials" })
  }

  try {
    const user = await users.findBy({ username }).first()

    if (user) {
      res.status(409).json({ message: "Username Unavailable" })
    }
    res.json(await users.add(req.body))
  }
  catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await users.findBy({ username: username }).first()

    if (!user) {
      res.status(401).json({ message: "Invalid username" })
    }

    const { password } = req.body
    const validPassword = await bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" })
    }

    const token = {
      userId: user.id,
      username: user.username
    }

    res.json({
      message: `Welcome ${user.username}!`,
      token: jwt.sign(token, process.env.JWT_SECRET),
    });
  }
  catch (err) {
    next(err)
  }
});

module.exports = router;