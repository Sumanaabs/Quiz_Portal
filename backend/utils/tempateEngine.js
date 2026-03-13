const subjectData = {
  javascript: {
    keywords: [
      { term: "Closure", def: "A function bundled together with its lexical environment", type: "concept" },
      { term: "Hoisting", def: "Moving declarations to the top of the current scope", type: "behavior" },
      { term: "Promises", def: "An object representing the eventual completion of an asynchronous operation", type: "api" },
      { term: "Event Loop", def: "The mechanism that handles asynchronous callbacks in JavaScript", type: "architecture" },
      { term: "Arrow Functions", def: "A compact alternative to traditional function expressions", type: "syntax" }
    ],
    templates: [
      {
        q: "In JavaScript, what does the term '{term}' refer to?",
        options: ["{def}", "A styling property", "A database query", "A hardware component"]
      },
      {
        q: "Which of the following best describes the behavior of '{term}'?",
        options: ["{def}", "It deletes all files in the directory", "It converts code to binary", "It optimizes network latency"]
      }
    ]
  },
  react: {
    keywords: [
      { term: "JSX", def: "A syntax extension for JavaScript that looks like HTML", type: "syntax" },
      { term: "Hooks", def: "Functions that let you 'hook into' React state and lifecycle features", type: "api" },
      { term: "Virtual DOM", def: "A lightweight copy of the real DOM used for performance optimization", type: "concept" },
      { term: "Props", def: "Inputs to a React component passed down from a parent", type: "data" },
      { term: "State", def: "An object that holds information that may change over the lifetime of a component", type: "data" }
    ],
    templates: [
      {
        q: "What is '{term}' in the context of React development?",
        options: ["{def}", "A server-side routing engine", "A CSS preprocessor", "A package manager"]
      },
      {
        q: "When using React, '{term}' is primarily used for:",
        options: ["{def}", "Managing binary files", "Styling raw HTML", "Connecting to a printer"]
      }
    ]
  },
  database: {
    keywords: [
      { term: "SQL", def: "A standard language for managing relational databases", type: "language" },
      { term: "Indexing", def: "A data structure technique to quickly locate data in a database", type: "optimization" },
      { term: "Normalization", def: "The process of organizing data to reduce redundancy", type: "architecture" },
      { term: "ACID", def: "A set of properties that guarantee database transactions are processed reliably", type: "principles" },
      { term: "NoSQL", def: "A non-relational database that provides a mechanism for storage and retrieval", type: "language" }
    ],
    templates: [
      {
        q: "In database management, what is the role of '{term}'?",
        options: ["{def}", "Encrypting network traffic", "Compressing video files", "Building 3D models"]
      }
    ]
  },
  html: {
    keywords: [
      { term: "Semantic HTML", def: "HTML that introduces meaning to the web page rather than just presentation", type: "concept" },
      { term: "DOCTYPE", def: "An instruction to the web browser about what version of HTML the page is written in", type: "syntax" },
      { term: "Alt Attribute", def: "Specifies an alternate text for an image, if the image cannot be displayed", type: "syntax" },
      { term: "Void Elements", def: "Elements that cannot have any child nodes and do not require a closing tag", type: "syntax" }
    ],
    templates: [
      {
        q: "In HTML development, why is '{term}' significant?",
        options: ["{def}", "It defines CSS animations", "It sets up the database connection", "It handles user authentication"]
      }
    ]
  },
  css: {
    keywords: [
      { term: "Flexbox", def: "A one-dimensional layout method for arranging items in rows or columns", type: "layout" },
      { term: "Grid", def: "A two-dimensional layout system for the web", type: "layout" },
      { term: "Specificity", def: "The means by which browsers decide which CSS property values are most relevant to an element", type: "concept" },
      { term: "Box Model", def: "A box that wraps around every HTML element, consisting of margins, borders, padding, and content", type: "concept" }
    ],
    templates: [
      {
        q: "What does the term '{term}' describe in CSS?",
        options: ["{def}", "A JavaScript framework", "A server-side scripting language", "A data storage format"]
      }
    ]
  },
  nodejs: {
    keywords: [
      { term: "NPM", def: "A package manager for the JavaScript programming language", type: "tool" },
      { term: "Express", def: "A minimal and flexible Node.js web application framework", type: "framework" },
      { term: "Middleware", def: "Functions that have access to the request object, response object, and the next middleware function", type: "concept" },
      { term: "Buffers", def: "Objects used to represent a fixed-length sequence of bytes", type: "concept" }
    ],
    templates: [
      {
        q: "Within the Node.js ecosystem, what is '{term}' used for?",
        options: ["{def}", "Managing system memory manually", "Writing SQL queries exclusively", "Styling frontend components"]
      }
    ]
  }
};

const generateQuizFromTemplate = (subjectName, count = 5) => {
  const subject = subjectData[subjectName.toLowerCase()];
  if (!subject) return null;

  const generatedQuestions = [];
  const usedKeywords = new Set();

  for (let i = 0; i < count; i++) {
    // Pick a random keyword that hasn't been used yet (if possible)
    let availableKeywords = subject.keywords.filter(k => !usedKeywords.has(k.term));
    if (availableKeywords.length === 0) {
      usedKeywords.clear(); // Recirculate if we run out
      availableKeywords = subject.keywords;
    }
    
    const keyword = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
    usedKeywords.add(keyword.term);

    // Pick a random template
    const template = subject.templates[Math.floor(Math.random() * subject.templates.length)];

    // Inject semantics
    const questionText = template.q.replace("{term}", keyword.term);
    const correctAnswer = template.options[0].replace("{def}", keyword.def);
    
    // Shuffle options
    const options = template.options.map(opt => opt.replace("{def}", keyword.def))
      .sort(() => Math.random() - 0.5);

    generatedQuestions.push({
      questionText,
      options,
      correctAnswer
    });
  }

  return {
    title: `${subjectName.charAt(0).toUpperCase() + subjectName.slice(1)} Auto-Generated Quiz`,
    description: `A semantically injected quiz exploring key concepts of ${subjectName}.`,
    questions: generatedQuestions
  };
};

module.exports = { generateQuizFromTemplate };
