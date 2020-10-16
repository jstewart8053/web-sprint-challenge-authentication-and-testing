const db = require("../database/dbConfig")
const bcrypt = require("bcryptjs")


const add = async (user) => {
    const hash = parseInt(process.env.JWT_HASH_AMOUNT);

    user.password = await bcrypt.hash(user.password, hash);
    const [id] = await db("users").insert(user);

    return findById(id);
}

const find = () => {
    return db("users")
        .select("id", "username")
}

const findBy = (filter) => {
    return db("users")
        .select("id", "username", "password")
        .where(filter)
}

const findById = (id) => {
    return db("users")
        .select("id", "username", "password")
        .where({ id })
        .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}