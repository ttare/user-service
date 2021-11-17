const chai = require('chai');

const server = process.server;
const data = process.data;

const createUser = (user, done) => {
  return chai
    .request(server)
    .post('/signup')
    .send(user)
    .then(function (res) {
      res.should.have.status(200);
      res.body.should.have.property('id').and.to.be.a('string');
      user.id = res.body.id;
      done();
    }).catch(done);
};


const loginUser = (user, done) => {
  return chai
    .request(server)
    .post('/login')
    .send(user)
    .then(function (res) {
      res.should.have.status(200);
      res.body.should.have.property('token').and.to.be.a('string');

      user.token = res.body.token; // attached id of user for next tests
      done();
    }).catch(done);
};

describe('Main', function () {
  describe('POST /signup', function () {

    it('it should create user (tkaldzija) in the system', function (done) {
      createUser(data.users[0], done);
    });

    it('it should create user (tarik90) in the system', function (done) {
      createUser(data.users[1], done);
    });

    it('it should create user (ttare) in the system', function (done) {
      createUser(data.users[2], done);
    });

    it('it should not create user (tkaldzija) in the system because it is already created', function (done) {
      chai
        .request(server)
        .post('/signup')
        .send(data.users[0])
        .then(function (res) {
          res.should.have.status(400);
          res.body[0].should.have.property('message').and.to.be.a('string');
          res.body[0].should.have.property('message').and.to.equal('Username is already taken!!!');
          done();
        }).catch(done);
    });
  });


  describe('POST /login', function () {
    it('it should login user (tkaldzija) in to system', function (done) {
      loginUser(data.users[0], done);
    });

    it('it should not login user (tkaldzija) in to system because password is wrong ', function (done) {
      chai
        .request(server)
        .post('/login')
        .send({
          ...data.users[0],
          password: 'someotherpassword'
        })
        .then(function (res) {
          res.should.have.status(401);
          res.body.should.have.property('message').and.to.be.a('string');
          res.body.should.have.property('message').and.to.equal('Incorrect username or password!!!');

          done();
        }).catch(done);
    });

    it('it should login user (tarik90) in to system', function (done) {
      loginUser(data.users[1], done);
    });

    it('it should login user (ttare) in to system', function (done) {
      loginUser(data.users[2], done);
    });

  });


  describe('GET /most-liked', function () {
    it('it should return most-liked users with zero likes', function (done) {
      chai
        .request(server)
        .get('/most-liked')
        .then(function (res) {
          res.should.have.status(200);
          for (let i = 0; i < res.body.length; i++) {
            const user = res.body[i];
            user.should.have.property('username').and.to.be.a('string');
            user.should.have.property('likes').and.to.equal(0);
          }
          done();
        }).catch(done);
    });
  });
});
