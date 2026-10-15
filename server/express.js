import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';
import contactRoutes from './routes/contact.routes.js';
import projectRoutes from './routes/project.routes.js';
import qualificationRoutes from './routes/qualification.routes.js';

const app = express();

// Root welcome message
app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

// 1. Parsers & Security (MUST be loaded BEFORE routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// 2. Mount All Routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', contactRoutes);
app.use('/', projectRoutes);
app.use('/', qualificationRoutes);

// 3. Catch Unauthorized JWT Errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
  }
});

export default app;