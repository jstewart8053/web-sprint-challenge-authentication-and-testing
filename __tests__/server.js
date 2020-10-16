const supertest = require("supertest")
const server = require("../api/server")
const db = require("../database/dbConfig")

beforeAll((done) => {
    supertest(server)
        .post('/api/auth/login')
        .send({
            username: "jstewart",
            password: "abcd1234",
        })
        .end((err, res) => {
            token = res.body.token;
            done();
        });
});

afterAll(async () => {
    await db.destroy()
})

describe("server.js", () => {
    beforeEach(async () => {
        await db('users').truncate()
    })

    it("POST api/auth/register - should return status 200", function () {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "jstewart", password: "abcd1234" })
            .then(res => {

                expect(res.status).toBe(200);
            })
    })

    it("POST /auth/register - res.type should match json", function () {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "jstewart", password: "abcd1234" })
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("POST api/auth/login - res.type should match json", function () {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "jstewart", password: "abcd1234" })
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("POST api/auth/login - should return status 401", function () {
        return supertest(server).post("/api/auth/login")
            .send({ username: "jstewart", password: "abcd1234" })
            .then(res => {

                expect(res.status).toBe(401);
            })
    })

    it("GET api/jokes/ - res.type should match json", function () {
        return supertest(server)
            .get("/api/jokes/")
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("GET api/jokes/ - should be defined", function () {
        return supertest(server)
            .get("/api/jokes/")
            .then(res => {

                expect(res.body).toBeDefined();
            })
    })

    it("Should respond with a 401", () => {
        return supertest(server)
            .get("/api/users")
            .then((res) => {
                expect(res.status).toBe(401)
                expect(res.type).toBe('application/json');
            })
    })

    it("Should respond with a 200", () => {
        return supertest(server)
            .get("/api/users")
            .set("authorization", `${token}`)
            .then((res) => {
                expect(res.status).toBe(200)
                expect(res.type).toBe('application/json');
            })
    })
})
