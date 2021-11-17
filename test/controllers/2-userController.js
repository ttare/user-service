const chai = require('chai');

const server = process.server;
const data = process.data;

const userDetails = (userIdx, numOfLikes, done) => {
  chai
    .request(server)
    .get(`/user/${data.users[userIdx].id}`)
    .then(function (res) {
      res.should.have.status(200);
      res.body.should.have.property('username').and.to.equal(data.users[userIdx].username);
      res.body.should.have.property('likes').and.to.equal(numOfLikes);
      done();
    }).catch(done);
};

const createOrRemoveLike = (userIdx, likedByIdx, unlike) => {
  return chai
    .request(server)
    .get(`/user/${data.users[userIdx].id}/${unlike ? 'un' : ''}like`)
    .set('authorization', data.users[likedByIdx].token)
    .then(function (res) {
      return new Promise((resolve => resolve(res)));
    })
};


describe('User controller', function () {
  describe('POST /user/:id', function () {
    it(`it should return user (${data.users[0].username}) details with no likes`, function (done) {
      userDetails(0, 0, done);
    });
  });

  describe('POST /user/:id/like', function () {
    it(`it should return true for create like for user (${data.users[0].username} is liked by ${data.users[1].username})`, function (done) {
      createOrRemoveLike(0, 1).then(function (res) {
        res.should.have.status(200);
        res.body.should.have.property('liked').and.to.equal(true);
        done();
      }).catch(done);
    });

    it(`it should should return true for create like for user (${data.users[0].username} is liked by ${data.users[2].username})`, function (done) {
      createOrRemoveLike(0, 2).then(function (res) {
        res.should.have.status(200);
        res.body.should.have.property('liked').and.to.equal(true);
        done();
      }).catch(done);
    });

    it(`it should return true for create like for user (${data.users[1].username} is liked by ${data.users[2].username})`, function (done) {
      createOrRemoveLike(1, 2).then(function (res) {
        res.should.have.status(200);
        res.body.should.have.property('liked').and.to.equal(true);
        done();
      }).catch(done);
    });

    it(`it should return user (${data.users[0].username}) details with TWO like`, function (done) {
      userDetails(0, 2, done);
    });

    it(`it should return user (${data.users[1].username}) details with ONE like`, function (done) {
      userDetails(1, 1, done);
    });

    it(`it should return user (${data.users[2].username}) details with NO like`, function (done) {
      userDetails(2, 0, done);
    });

    it(`it should return false for create like for user (${data.users[0].username} is liked by ${data.users[1].username}) because that like already exist`, function (done) {
      createOrRemoveLike(0, 2).then(function (res) {
        res.should.have.status(200);
        res.body.should.have.property('liked').and.to.equal(false);
        done();
      }).catch(done);
    });

    it(`it should not allow user to like itself (${data.users[0].username} tried to be liked by ${data.users[0].username})`, function (done) {
      createOrRemoveLike(0, 0).then(function (res) {
        res.should.have.status(400);
        res.body[0].should.have.property('message').and.to.equal('Not allowed!!!');
        done();
      }).catch(done);
    });
  });

  describe('GET /most-liked after some like api calls', function () {
    it('it should return most-liked users', function (done) {
      chai
        .request(server)
        .get('/most-liked')
        .then(function (res) {
          res.should.have.status(200);
          res.body[0].should.have.property('username').and.to.equal(data.users[0].username);
          res.body[0].should.have.property('likes').and.to.equal(2);

          res.body[1].should.have.property('username').and.to.equal(data.users[1].username);
          res.body[1].should.have.property('likes').and.to.equal(1);

          res.body[2].should.have.property('username').and.to.equal(data.users[2].username);
          res.body[2].should.have.property('likes').and.to.equal(0);

          done();
        }).catch(done);
    });
  });

  describe('POST /user/:id/unlike', function () {
    it(`it should not allow to remove like for itself (${data.users[0].username} is liked by ${data.users[0].username})`, function (done) {
      createOrRemoveLike(0, 0, true)
        .then(function (res) {
          res.should.have.status(400);
          res.body[0].should.have.property('message').and.to.equal('Not allowed!!!');
          done();
        }).catch(done);
    });

    it(`it should return false for remove like for user (${data.users[2].username} is liked by ${data.users[1].username}) which doesn't exist`, function (done) {
      createOrRemoveLike(2, 1, true)
        .then(function (res) {
          res.should.have.status(200);
          res.body.should.have.property('unLiked').and.to.equal(false);
          done();
        }).catch(done);
    });

    it(`it should return true for remove like for user (${data.users[1].username} is liked by ${data.users[2].username}) which doesn't exist`, function (done) {
      createOrRemoveLike(1, 2, true)
        .then(function (res) {
          res.should.have.status(200);
          res.body.should.have.property('unLiked').and.to.equal(true);
          done();
        }).catch(done);
    });

    it(`it should return user (${data.users[1].username}) details with NO likes`, function (done) {
      userDetails(1, 0, done);
    });

  });

  describe('GET /most-liked after some calls of unlike api', function () {
    it('it should return most-liked users', function (done) {
      chai
        .request(server)
        .get('/most-liked')
        .then(function (res) {
          res.should.have.status(200);
          res.body[0].should.have.property('username').and.to.equal(data.users[0].username);
          res.body[0].should.have.property('likes').and.to.equal(2);

          // multiple users with no likes are not sorted so cant compare username
          res.body[1].should.have.property('likes').and.to.equal(0);
          res.body[2].should.have.property('likes').and.to.equal(0);

          done();
        }).catch(done);
    });
  });

});
