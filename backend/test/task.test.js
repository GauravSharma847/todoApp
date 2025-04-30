// test/task.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const Task = require("../models/Task");

chai.use(chaiHttp);
const { expect } = chai;

describe("Task API", () => {
  before(async () => {
    await Task.deleteMany({});
  });

  it("should create a new task", (done) => {
    chai
      .request(app)
      .post("/api/task")
      .send({ title: "Test task", completed: false })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.include({ title: "Test task", completed: false });
        done();
      });
  });

  it("should get all tasks", (done) => {
    chai
      .request(app)
      .get("/api/tasks")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should update a task", async () => {
    const task = await Task.create({ title: "Update me", completed: false });
    const res = await chai
      .request(app)
      .put(`/api/task/${task._id}`)
      .send({ title: "Updated", completed: true });
    expect(res).to.have.status(200);
    expect(res.body).to.include({ title: "Updated", completed: true });
  });

  it("should delete a task", async () => {
    const task = await Task.create({ title: "Delete me", completed: false });
    const res = await chai.request(app).delete(`/api/task/${task._id}`);
    expect(res).to.have.status(204);
  });
});
