# RateMyCity RAG

An AI-powered city recommendation system that uses Retrieval-Augmented Generation (RAG) architecture to provide personalized city suggestions based on career goals, lifestyle preferences, and employment opportunities.

## Overview

RateMyCity RAG leverages vector database technology and large language models to analyze user preferences and match them with the most suitable cities from a comprehensive database of employment data, cost of living information, and cultural factors.

## Architecture

- **Frontend**: Next.js 15 with React and Material-UI components
- **Backend**: Next.js API routes for server-side processing
- **Vector Database**: Pinecone for storing and querying city embeddings
- **AI Model**: Google Gemini AI (text-embedding-004 for embeddings, gemini-1.5-flash for chat completion)
- **Data Processing**: Custom RAG pipeline with semantic search capabilities

## Features

- Intelligent city matching based on user preferences
- Real-time streaming AI responses
- Interactive city comparison tools
- Detailed employment and lifestyle analysis
- Responsive startup-style user interface
- Semantic search across 50+ cities

## Technology Stack

### Frontend
- **Next.js 15.0.3** - React framework with App Router
- **Material-UI 6.2.0** - Component library for modern UI design
- **React 18** - Frontend JavaScript library

### Backend & AI
- **Pinecone** - Vector database for similarity search
- **Google Gemini AI** - Large language model for text generation and embeddings
- **Node.js** - Server-side JavaScript runtime

### Development Tools
- **JavaScript/ES6+** - Primary programming language
- **CSS-in-JS** - Styling with Material-UI system
- **JSON** - Data format for city information storage

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Pinecone API key** for vector database access
- **Google AI API key** for Gemini model access

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
PINECONE_INDEX_NAME=rag
PINECONE_NAMESPACE=ns1
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AdamOwolabi/RateMyCity.git
cd ratemycity-rag
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables as described above

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your preferences in the search input (e.g., "I'm a recent graduate interested in tech opportunities and cultural activities")
2. The AI will analyze your input and return personalized city recommendations
3. Review detailed city cards with employment highlights, pros/cons, and industry information
4. Use the comparison tool to evaluate multiple cities side-by-side
5. Click on individual cities for more detailed information

## Data Sources

The system uses employment data, cost of living information, and cultural factors from various cities to provide comprehensive recommendations. The vector database contains embeddings for efficient semantic search and matching.

## API Endpoints

- `POST /api/chat` - Main endpoint for processing user queries and returning city recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Performance

- Vector similarity search provides sub-second query responses
- Streaming AI responses for real-time user feedback
- Optimized frontend with lazy loading and responsive design
- Efficient data parsing and city recommendation algorithms

## Future Enhancements

- Additional data sources for more comprehensive city analysis
- User preference learning and recommendation improvement
- Integration with real-time job market data
- Mobile application development
- Advanced filtering and sorting capabilities
