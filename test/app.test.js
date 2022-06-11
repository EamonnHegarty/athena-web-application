const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const assert = require("assert");

//testing get home page
describe("GET /", () => {
  test("It should respond to the GET method", () => {
    return request(app)
    .get("/")
    .expect(200);
  });


});

//testing get log in
describe("GET /login", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/login")
      .expect(200);
  });
});

//testing get register 
describe("GET /register", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/register")
      .expect(200);
  });
});

//testing post to log in
describe('POST /login', function() {
  it('responds with json and accepts log in', function(done) {
    request(app)
      .post('/login')
      .type('form')
      .send({username: "eamonn", password: "password"})
      .set('Accept', /application\/json/)
      .expect(201)
      .end(function (err, res) { done(); });
      });
});

//testing post to register
describe('POST /register', function() {
  it('responds with json and accepts register', function(done) {
    request(app)
      .post('/login')
      .type('form')
      .send({username: "test", email: "test@athena.com", password: "password"})
      .set('Accept', /application\/json/)
      .expect(201)
      .end(function (err, res) { done(); });
      });
});

//testing get expenses
//should redirect(302) due to user not being logged in
describe("GET /expenses", () => {
  test("It should response the GET method and redirect to /login", () => {
    return request(app)
      .get("/expenses")
      .expect("Location", "/login")
  });
});

//testing get expenses/new
//should redirect(302) due to user not being logged in
describe("GET /expenses/new", () => {
  test("It should response the GET method and redirect to /login", () => {
    return request(app)
      .get("/expenses/new")
      .expect("Location", "/login")
  });
});

