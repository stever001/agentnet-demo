# AgentNet

## Description  
AgentNet is an open-source, AI-native web infrastructure project that enables websites to become intelligent, queryable agents. It empowers developers and publishers to expose structured knowledge from their sites via a simple publishing protocol and interface, drastically reducing compute overhead compared to traditional LLM workflows. AgentNet combines declarative web semantics with an efficient retrieval layer to support real-time AI querying and content interaction.

**Key features:**
- Structured agent publishing and discovery  
- Developer-friendly publishing API  
- Graph-based data model with JSON-LD support  
- Lightweight Express backend with MySQL  
- Vite + React frontend with Chakra UI  
- Concurrent dev server launch using `concurrently`

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/stever001/agentnet-demo.git
   cd agentnet-demo
   ```

2. **Install root-level tools and concurrently**  
   ```bash
   npm install concurrently --save-dev
   ```

3. **Install backend dependencies**  
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**  
   ```bash
   cd ../frontend
   npm install
   ```

5. **Setup MySQL and create the database**  
   ```sql
   CREATE DATABASE agentnet;
   ```

6. **Configure backend environment variables**  
   Create a `.env` file in the `backend` directory:
   ```
   DB_NAME=agentnet
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   ```

7. **Configure root-level `package.json` (if not already set)**  
   In the project root, add this to your `package.json`:
   ```
   {
     "scripts": {
       "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
     }
   }
   ```

## Usage  

### Run the Development Servers  

To start both frontend and backend servers simultaneously:

```bash
npm run dev
```

This command uses [`concurrently`](https://www.npmjs.com/package/concurrently) to run both the Express backend and Vite-powered frontend from the project root.

Alternatively, you can run them separately:

- **Backend**  
  ```bash
  cd backend
  npm run dev
  ```

- **Frontend**  
  ```bash
  cd frontend
  npm run dev
  ```

### Features in Development  
- Agent publishing dashboard  
- OpenAPI + JSON-LD integration for agents  
- Node prioritization tools  
- Publisher onboarding and analytics

## License  
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
This project is licensed under the MIT license.

## Contributing  

We welcome contributions from developers, researchers, and semantic web enthusiasts!

**To contribute:**
1. Fork the repository  
2. Create a new feature branch  
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add my feature"
   ```
4. Push your branch  
   ```bash
   git push origin feature/my-feature
   ```
5. Open a pull request with a description of your changes

Please use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and ensure your code is clean and readable. We recommend using Prettier for formatting.

## Tests  
Test coverage is not yet implemented. Tests will be introduced once the API and data model stabilize. Planned coverage includes:
- API endpoint unit tests (Jest)  
- Frontend UI component testing (React Testing Library)  
- DB validation and model integration tests

## Questions  

For questions or collaboration inquiries, please contact:

**Steve Rouse**  
Founder, AgentNet  
📧 steve17rouse@gmail.com  
🌐 [agent-net.ai](http://agent-net.ai) *(coming soon)*  
📁 GitHub: [stever001](https://github.com/stever001)