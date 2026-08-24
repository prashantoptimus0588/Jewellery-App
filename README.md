# Vikas Jewellers — AI-Powered Jewellery E-Commerce Platform

> A full-stack jewellery e-commerce platform featuring a **production-grade RAG (Retrieval Augmented Generation) chatbot** powered by Google Gemini, pgvector semantic search, and Upstash Redis memory — built to demonstrate real-world GenAI integration in a consumer product.

**Live Demo:** [vikas-jewellers-delta.vercel.app](https://vikas-jewellers-delta.vercel.app)  
**GitHub:** [github.com/prashantoptimus0588](https://github.com/prashantoptimus0588)

---

## What Makes This Different

Most e-commerce projects are CRUD apps. This one is built around a **semantic search and conversational AI layer** — when a user asks *"show me something for my wife's anniversary under ₹50,000"*, the system embeds the query using Google's `gemini-embedding-001` model, runs a cosine similarity search against 768-dimensional product vectors stored in pgvector, retrieves the most semantically relevant products, and passes them as grounded context to Gemini Flash to generate a natural language response — all in under 2 seconds.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| React Router v7 | Client-side routing |
| Zustand | Global state (cart, auth, wishlist) |
| Tailwind CSS v4 | Styling |
| Razorpay JS SDK | Payment UI |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Prisma 7 + PostgreSQL | ORM + relational database (Neon) |
| pgvector | Vector similarity search for RAG |
| JWT + Passport.js | Authentication |
| Cloudinary + Multer | Image upload and storage |
| Razorpay | Payment gateway |

### AI / GenAI
| Technology | Purpose |
|---|---|
| Google Gemini Flash (`gemini-1.5-flash`) | LLM for response generation |
| `gemini-embedding-001` | Text embeddings (768-dim via MRL) |
| pgvector (cosine similarity) | Semantic product retrieval |
| Upstash Redis | Sliding window chat memory (last 6 messages, 1hr TTL) |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Neon | Serverless PostgreSQL |
| Upstash | Serverless Redis |
| Cloudinary | Image CDN |

---

## Core Features

### 🤖 RAG-Powered AI Chatbot
- Embeds user queries using `gemini-embedding-001` (768 dimensions via Matryoshka Representation Learning)
- Performs cosine similarity search against product embeddings stored in pgvector
- Filters results by relevance threshold (≥0.65 similarity score) to avoid irrelevant product suggestions
- Passes top-K retrieved products as context to Gemini Flash for grounded response generation
- Maintains conversation history using sliding window memory (last 6 messages) in Upstash Redis
- Responds in English or Hinglish based on user's language
- Returns product cards alongside AI responses for direct navigation

### 🛍️ E-Commerce Flow
- Product listing with real-time filtering (price range, metal type) and sorting
- Semantic search — searches by product name, purity, metal, and tag
- Product detail with image gallery, size selection, and spec display
- Cart management with Zustand (persistent across sessions)
- Checkout with saved address management and Razorpay payment gateway
- Order history with expandable order details and status tracking

### 🔐 Authentication
- OTP-based email login (6-digit code, 5-minute expiry, consumed tracking)
- Google OAuth via Passport.js
- JWT-based session management with localStorage persistence
- Auto-rehydration on page refresh via `/api/auth/me`

### ❤️ Wishlist
- Synced to PostgreSQL when logged in
- Optimistic UI updates — instant response, DB sync in background
- Visible in Profile page and header badge count

### 🛠️ Admin Dashboard
- Product CRUD with Cloudinary image uploads (up to 5 images per product)
- Auto-generates product embeddings on create/update for RAG freshness
- Order management with real-time status updates (PENDING → PAID → SHIPPED → DELIVERED)
- Dashboard stats: total products, orders, users, revenue

---

## RAG Pipeline Architecture

```
User Message
     ↓
Embed with gemini-embedding-001 (768-dim)
     ↓
pgvector cosine similarity search → Top 3 products
     ↓
Filter by similarity threshold (≥0.65)
     ↓
Fetch last 6 messages from Upstash Redis (sliding window)
     ↓
Build prompt: System prompt + Retrieved products + Chat history + User message
     ↓
Gemini Flash generates grounded response
     ↓
Save updated history to Redis (TTL: 1 hour)
     ↓
Return response + product cards to frontend
```

**Key design decisions:**
- **No LangChain** — pipeline built from scratch using direct API calls for full control and easier debugging
- **MRL slicing** — `gemini-embedding-001` outputs 3072 dims; sliced to 768 to match schema, preserving semantic quality (MRL ensures top dims carry the most information)
- **Relevance threshold** — similarity score filter prevents the chatbot from showing products for generic jewellery questions
- **Async embedding generation** — admin product creation doesn't wait for embedding; fires in background so UI stays fast

---

## Database Schema (Key Models)

```
User ──── OtpCode
 │
 ├──── Address ──── Order ──── OrderItem ──── Product ──── ProductImage
 │                                                │
 ├──── CartItem ────────────────────────────────┘
 │                                                │
 ├──── WishlistItem ─────────────────────────────┘
                                                  │
                                            ProductEmbedding
                                         (vector(768) via pgvector)
```

---

## Environment Variables

### Backend (`server/.env`)
```
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_AI_API_KEY=
CLIENT_URL=
```

### Frontend (`client/.env`)
```
VITE_API_URL=
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_CLIENT_ID=
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/prashantoptimus0588/Jewellery-App
cd Jewellery-App

# Backend
cd server
npm install
npx prisma generate
node server.js

# Frontend (new terminal)
cd client
npm install
npm run dev
```

Seed the database:
```bash
cd server
node prisma/seed.js
```

Generate product embeddings for RAG:
```bash
node src/ai/generateEmbeddings.js
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP, return JWT |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | List products with filters |
| GET | `/api/products/search` | Semantic keyword search |
| GET | `/api/products/:slug` | Single product detail |
| POST | `/api/orders/create-razorpay-order` | Create Razorpay order |
| POST | `/api/orders/verify-payment` | Verify payment signature |
| GET | `/api/orders` | User order history |
| POST | `/api/chat/message` | Send message to RAG chatbot |
| GET | `/api/admin/stats` | Dashboard statistics |
| POST | `/api/admin/products` | Create product (with embedding) |
| PUT | `/api/admin/products/:id` | Update product (refresh embedding) |

---

## Built By

**Prashant** — B.Tech Electrical Engineering, MNIT Jaipur (2023–2027)  
Robotics Club Member | Full-Stack → GenAI/LLM Engineering

> *This project was built to demonstrate production-grade GenAI integration — specifically RAG architecture, vector databases, and LLM-grounded response generation — in the context of a real consumer product.*