let database = {
  classes: [],
  classSessions: []
};

const generateRandomNumber = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const createClass = classData => {
  const newClass = {
    id: generateRandomNumber(),
    name: classData.name,
    owner: classData.owner ? classData.owner : null,
    sessionCodes: [],
  }

  database.classes.push(newClass)
  return newClass;
};

export const getClassesByOwner = (owner) => database.classes.filter(item => item.owner === owner);

export const getClassById = (id) => database.classes.find(item => item.id === id);

export const getClasses = () => database.classes;

export const getSessionById = (id) => database.classSessions.find(item => item.id === id);

export const createSessionCodeForClass = classId => {
  const classInfo = database.classes.find(classInfo => {
    return classInfo.id === classId;
  });

  if (!classInfo) {
    return null;
  }

  const newSession = {
    id: generateRandomNumber(),
    classId: classId,
    createdAt: Date.now(), 
    questions: [],
  }

  classInfo.sessionCodes.push(newSession);

  database.classSessions.push(newSession);
  return newSession;
};

export const createQuestionForSession = (classSessionId, question) => {
  const classSession = database.classSessions.find(
    classSession => classSession.id === classSessionId
  );

  if (!classSession) {
    return null;
  }

  const newQuestion = {
    id: generateRandomNumber(),
    name: question.name,
    question: question.question,
    upvotes: 0
  }
  classSession.questions.push(newQuestion);
  return newQuestion;
};

export const getQuestions = (id) => {
  return database.classSessions.find(item => {
    return item.id === id;
  }).questions;
};

export const upvoteQuestionForSession = (sessionId, questionId) => {
  const session = database.classSessions.find(item => item.id === sessionId);
  const question = session.questions.find(item => item.id === questionId);

  question.upvotes += 1;

  return question;
};

export const clear = () => {
  database = {
    classes: [],
    classSessions: []
  };
};