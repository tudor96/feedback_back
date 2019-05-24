process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Candidates', () => {

  describe('/GET all candidates', () => {
    it('it should GET all candidates', (done) => {
      chai.request(server)
        .get('/api/candidate/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
    it('it should GET candidate given id', (done) => {
      chai.request(server)
        .get('/api/candidate/' + 1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.companies.should.be.a('array');
          res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            done();
        });
    });
  });


  describe('/POST new candidate', () => {
    it('it should POST a candidate ', (done) => {
      let candidate = {
        "firstName": "UnitTest2",
        "lastName": "UnitTest23",
        "resumeLink": "linkresume.com",
        "contactedAt": 1557771117021,
        "interviewedAt": 1557771117021,
        "feedbackAtContact": "Candidate successfully added!",
        "feedback": "HR",
        "companies": ["Guardus", "Veoneer", "Carl Zeiss"],
        "technologies": ["NodeJs", "JavaScript"]
      }
      chai.request(server)
        .post('/api/candidate/')
        .send(candidate)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('feedbackAtContact')
          res.body.should.have.property('firstName').eql("UnitTest2");;
          res.body.should.have.property('lastName');
          res.body.should.have.property('resumeLink');
          res.body.should.have.property('contactedAt');
          res.body.should.have.property('interviewedAt');
          done();
        });
    });

    it('it should POST a candidate ', (done) => {
      let candidate = {
        "firstName": undefined,
        "lastName": "",
      }
      chai.request(server)
        .post('/api/candidate/')
        .send(candidate)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/PUT/:id candidate', () => {
    it('it should UPDATE a candidate given the id', (done) => {
      chai.request(server)
        .put('/api/candidate/' + 1)
        .send({
          "firstName": "Jony1",
          "lastName": "Last name updated!",
          "companies": ["grd", "Veoneer"],
          "technologies": ["NodeJsssss", "JavaScript"]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('lastName').eql("Last name updated!");

          done();
        });
    });
    it('it should UPDATE a candidate given the id with new companies', (done) => {
      chai.request(server)
        .put('/api/candidate/' + 1)
        .send({
          "firstName": "Jony1",
          "lastName": "Last name updated!",
          "companies": ["new_company", "new_company"],
          "technologies": ["NodeJsssss", "JavaScript"]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('lastName').eql("Last name updated!");

          done();
        });
    });
    it('it should FAIL UPDATE a candidate given the id', (done) => {
      chai.request(server)
        .put('/api/candidate/' + 1)
        .send({
          "firstName": undefined,
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

});




