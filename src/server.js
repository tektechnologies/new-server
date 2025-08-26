const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { configDotenv } = require("dotenv");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Node.js Server!",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the API!",
    data: {
      user: req.query.name || "Anonymous",
      timestamp: new Date().toISOString(),
    },
  });
});

app.post("/api/data", (req, res) => {
  const { message, data } = req.body;

  res.json({
    message: message || "Data received successfully",
    receivedData: data,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/api/hello`);
});

// 1.Problem domain
// - print 1 - 100,
// - 3 = fizz
// - 5 = buzz
// so for 2 print the number

// 2. Visualization
// 1,2,fizz,4,buzz,fizz,7

// loop through 7-120. X
// 7 = pop instead of the Number. X
// 3,5,7 print name instead of any other output.

//35 7/5 buzzpop
//21.  7/3  fizzpop
//



//3. pseudo code

//4. code

//5. test

//6. big O

let numsArray = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
  84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102,
  103, 104, 105, 106, 107, 108, 109, 110, 110, 112, 113, 114, 115, 116, 117,
  118, 119, 120,
];

function fizzBuzzFizzBuzz(arrayOfNumber, nameTheyWant) {
  // console.log("numbers: ", arrayOfNumber);

  let stringOfFizzBuzzPop;
  for (let i = 0; i <= arrayOfNumber.length; i++) {
    // console.log("i", i);
    if (
      arrayOfNumber[i] % 3 === 0 &&
      arrayOfNumber[i] % 5 === 0 &&
      arrayOfNumber[i] % 7 === 0
    ) {
      console.log("Craig Barkley"); //
    } else if (arrayOfNumber[i] % 7 === 0 && arrayOfNumber[i] % 5 === 0) {
      console.log("BUZZPOP");
    } else if (arrayOfNumber[i] % 7 === 0 && arrayOfNumber[i] % 3 === 0) {
      console.log("FIZZPOP");
    } else if (arrayOfNumber[i] % 3 === 0 && arrayOfNumber[i] % 5 === 0) {
      console.log("FizzBuzz");
    } else if (arrayOfNumber[i] % 7 === 0) {
      console.log("POP");
    } else if (arrayOfNumber[i] % 3 === 0) {
      console.log("fizz");
    } else if (arrayOfNumber[i] % 5 === 0) {
      console.log("buzz");
    } else {
      console.log(arrayOfNumber[i]);
    }
  }
  return stringOfFizzBuzzPop;
}

fizzBuzzFizzBuzz(numsArray, nameTheyWant);


//updated dry version
function fizzBuzzFizzBuzz(arrayOfNumber, nameTheyWant) {
  const rules = [
    [3, "fizz"],
    [5, "buzz"],
    [7, "POP"],
  ];

  arrayOfNumber.forEach(num => {
    let output = rules
      .filter(([div]) => num % div === 0)
      .map(([, word]) => word)
      .join("");

    // special case: all three divisors
    if (num % 3 === 0 && num % 5 === 0 && num % 7 === 0) {
      output = nameTheyWant || "Craig Barkley";
    }

    console.log(output || num);
  });
}


module.exports = app;
