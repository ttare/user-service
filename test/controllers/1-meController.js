const chai = require('chai');

const server = process.server;
const data = process.data;

describe('Me', function () {

  describe('POST /me', function () {
    it(`it should return info details for user (${data.users[0].username})`, function (done) {
      chai
        .request(server)
        .get('/me')
        .set('authorization', data.users[0].token)
        .then(function (res) {
          res.should.have.status(200);
          res.body.should.have.property('id').and.to.equal(data.users[0].id);
          res.body.should.have.property('username').and.to.equal(data.users[0].username);
          done();
        }).catch(done);
    });

    it('it should return unauthorized error', function (done) {
      chai
        .request(server)
        .get('/me')
        .then(function (res) {
          res.should.have.status(401);
          done();
        }).catch(done);
    });

  });

  describe('POST /update-password', function () {
    it(`it should update password for user (${data.users[2].username})`, function (done) {
      chai
        .request(server)
        .post('/me/update-password')
        .set('authorization', data.users[2].token)
        .send({password: data.users[2].passwordToChange})
        .then(function (res) {
          res.should.have.status(200);
          res.body.should.have.property('success').and.to.equal(true);
          done();
        }).catch(done);
    });

    it(`it should not log in user (${data.users[2].username}) with old password`, function (done) {
      chai
        .request(server)
        .post('/login')
        .send(data.users[2])
        .then(function (res) {
          res.should.have.status(401);
          res.body.should.have.property('message').and.to.be.a('string');
          res.body.should.have.property('message').and.to.equal('Incorrect username or password!!!');
          done();
        }).catch(done);
    });

    it(`it should log in user (${data.users[2].username}) with new password`, function (done) {
      data.users[2].password = data.users[2].passwordToChange;
      chai
        .request(server)
        .post('/login')
        .send(data.users[2])
        .then(function (res) {
          res.should.have.status(200);
          res.body.should.have.property('token').and.to.be.a('string');
          data.users[2].token = res.body.token;
          done();
        }).catch(done);
    });

    it('it should return unauthorized error', function (done) {
      chai
        .request(server)
        .post('/me/update-password')
        .send({password: data.users[2].password})
        .then(function (res) {
          res.should.have.status(401);
          done();
        }).catch(done);
    });
  });
});
