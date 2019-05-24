const {
  Candidate,
  Company,
  Technology
} = require('../models')
const Sequelize = require('sequelize')

const showOne = async (req, res) => {
  Candidate.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      "firstName",
      "lastName",
      "resumeLink",
      "contactedAt",
      "feedbackAtContact",
      "interviewedAt",
      "feedback"
    ],
    include: [{
        model: Company,
        as: 'companies', // where: { },
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: Technology,
        as: 'technologies',
        attributes: ['name'],
        through: {
          attributes: []
        }
      }
    ]
  }).then(candidate => {
    res.send(candidate);
  });
}

const show = async (req, res) => {
  console.log('Get')
  Candidate.findAll({
    attributes: [
      'id',
      "firstName",
      "lastName",
      "resumeLink",
      "contactedAt",
      "feedbackAtContact",
      "interviewedAt",
      "feedback"
    ],
    include: [{
        model: Company,
        as: 'companies',
        // where: { },
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: Technology,
        as: 'technologies',
        // where: { },
        attributes: ['name'],
        through: {
          attributes: []
        }
      }
    ]
  }).then(candidate => {
    res.send(candidate);
  });

}

const showXls = async (req, res) => {
  const formatDate = (date) => {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  Candidate.findAll({
    attributes: [
      'id',
      "firstName",
      "lastName",
      "resumeLink",
      "contactedAt",
      "feedbackAtContact",
      "interviewedAt",
      "feedback"
    ],
    include: [{
        model: Company,
        as: 'companies',
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: Technology,
        as: 'technologies',
        attributes: ['name'],
        through: {
          attributes: []
        }
      }
    ]
  }).then(candidate => {
    candidate.forEach(element => {
      element.companies = element.companies.map(el => {
        return el.name;
      });
      element.technologies = element.technologies.map(el => {
        return el.name;
      });
      element.contactedAtFormat = formatDate(element.contactedAt);
      element.interviewedAtFormat = formatDate(element.interviewedAt);
    });

    res.xls('data.xlsx', candidate, {
      fields: ['firstName', 'lastName', 'companies',
       "resumeLink", 'contactedAtFormat', 'interviewedAtFormat',
       "interviewedAt", "feedback", "feedbackAtContact"]
    });
  });

}


const post = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      resumeLink,
      companies,
      technologies,
      contactedAt,
      interviewedAt,
      feedbackAtContact,
      feedback
    } = req.body;
    console.log("CANDIDATE:", req.body);
    if (firstName === undefined || lastName === undefined || firstName === '' || lastName === '') {
      const err = 'Name or Surname provided is empty.'
      throw (err)
    }
    let newCandidate = await Candidate.create({
        firstName: firstName,
        lastName: lastName,
        resumeLink: resumeLink,
        contactedAt: contactedAt,
        interviewedAt: interviewedAt,
        feedbackAtContact: feedbackAtContact,
        feedback: feedback,
      }, {
        include: [{
            model: Technology,
            as: 'technologies',
            attributes: ['id', 'name']
          },
          {
            model: Company,
            as: 'companies',
            attributes: ['id', 'name']
          }
        ],
      })
      .then(function (createdCandidate) {

        //ADDING COMPANIES
        companies.forEach(function (element, id) {
          Company.findOrCreate({
            where: {
              name: element
            },
            defaults: {
              name: element
            }
          }).then(function (result) {
            var company = result[0];
            createdCandidate.addCompany(company);
          });
        });

        // ADDING TECHNOLOGIES
        technologies.forEach(function (element, id) {
          Technology.findOrCreate({
            where: {
              name: element
            },
            defaults: {
              name: element
            }
          }).then(function (result) {
            var tech = result[0];
            createdCandidate.addTechnology(tech);
          });
        });
        res.status(200).send(createdCandidate)
      });

  } catch (err) {
    res.status(400).json({
      error: err
    })
  }
}


const update = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      resumeLink,
      companies,
      technologies,
      contactedAt,
      interviewedAt,
      feedbackAtContact,
      feedback
    } = req.body;
    console.log("CANDIDATE:", req.body);
    if (firstName === undefined || lastName === undefined || firstName === '' || lastName === '') {
      const err = 'Name or Surname provided is empty.'
      throw (err)
    }

    var updateCandidate = Object.assign({}, {
      firstName: firstName,
      lastName: lastName,
      resumeLink: resumeLink,
      contactedAt: contactedAt,
      interviewedAt: interviewedAt,
      feedbackAtContact: feedbackAtContact,
      feedback: feedback
    });
    Object.keys(updateCandidate).forEach(key => updateCandidate[key] === undefined && delete updateCandidate[key]);

    Candidate.findOne({
      where: {
        id: req.params.id
      },
      include: [{
          model: Company,
          as: 'companies',
          attributes: ['id', 'name'],
        },
        {
          model: Technology,
          as: 'technologies',
          attributes: ['id', 'name'],
        }
      ]
    }).then(candidateFound => {
      candidateFound.update(updateCandidate);
      candidateFound.setCompanies([]);
      companies.forEach(function (element, id) {
        Company.findOrCreate({
          where: {
            name: element
          },
          defaults: { 
            name: element
          }
        }).then(function (result) {
          var company = result[0];
          candidateFound.addCompany(company);
        });
      });
      candidateFound.setTechnologies([]);
      technologies.forEach(function (element, id) {
        Technology.findOrCreate({
          where: {
            name: element
          },
          defaults: {
            name: element
          }
        }).then(function (result) {
          var tech = result[0];
          candidateFound.addTechnology(tech);
        });
      });
      res.status(200).send(candidateFound)
    });

  } catch (err) {
    res.status(400).json({
      error: err
    })
  }
}

module.exports = {
  '/': {
    get: {
      action: show,
      level: 'public'
    },
    post: {
      action: post,
      level: 'public'
    }
  },
  '/getXls': {
    get: {
      action: showXls,
      level: 'public'
    },
  },
  ':id': {
    put: {
      action: update,
      level: 'public'
    },
    get: {
      action: showOne,
      level: 'public'
    }
  }
}
