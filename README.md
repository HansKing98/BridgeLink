# 🌉 BridgeLink - Communication Translator

A production-ready AI-powered tool that bridges the communication gap between **Product Managers** and **Developers** in enterprise teams.
<img width="1748" height="1137" alt="截屏2025-12-20 00 08 17" src="https://github.com/user-attachments/assets/0bb0dfa9-9b1f-44d7-bebf-9a3e46abac9a" />

## 🎯 What Problem Does It Solve?

In product development, PMs and developers often struggle to understand each other:

- **Product Managers** focus on user value, business goals, and feature descriptions
- **Developers** need technical details, architecture decisions, and implementation specifics

**BridgeLink** uses advanced prompt engineering to translate between these two perspectives, ensuring both sides understand what's really needed.

---

## ✨ Key Features

### 1. **Bi-directional Translation**
- **PM → Developer**: Converts vague requirements into technical specifications
- **Developer → PM**: Translates technical work into business value

### 2. **Intelligent Gap Filling**
- Automatically identifies missing information
- Suggests technology stacks and approaches
- Estimates complexity and effort

### 3. **Quick Example Loading**
- One-click example filling for quick testing
- Examples for both PM and Developer perspectives
- Helps users understand expected input format

### 4. **Real-time Streaming**
- See AI translation as it's generated
- Fast, responsive user experience
- Built with Vercel AI SDK

### 5. **Custom API Support**
- Works with OpenAI official API
- Supports custom proxy/relay services (great for China users!)
- Easy configuration via environment variables

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- An OpenAI API key OR access to a custom AI proxy

### Installation

1. **Clone and install dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Configure your API key**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your API configuration:

**Option A: Official OpenAI API**
\`\`\`env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
\`\`\`

**Option B: Custom Proxy (Recommended for China)**
\`\`\`env
CUSTOM_API_KEY=your_proxy_api_key
CUSTOM_API_BASE_URL=https://your-proxy-server.com/v1
\`\`\`

3. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Examples

### Example 1: PM → Developer Translation

**Input (Product Manager perspective):**
\`\`\`
We need a smart recommendation feature similar to TikTok's infinite scroll 
to increase user engagement time.
\`\`\`

**Expected Output Structure (Developer receives):**
\`\`\`markdown
## 🎯 Technical Implementation Approach
- Implement personalized recommendation algorithm using collaborative filtering
- Consider hybrid approach: user-based + content-based filtering
- Infinite scroll requires virtual scrolling for performance

## 📊 Data & Architecture
- User interaction data: views, likes, time spent
- Content features: tags, categories, popularity
- Recommendation service (microservice architecture)
- Real-time update queue for user actions

## ⚡ Performance Requirements
- Target: <200ms recommendation latency
- Support 10k+ concurrent users
- Cache top recommendations with Redis

## 🔧 Technology Stack
- Algorithm: TensorFlow Recommenders or Surprise library
- Frontend: React + Intersection Observer API
- Backend: FastAPI/Node.js + Celery for async tasks
- Cache: Redis with 5min TTL

## ⏱️ Development Estimation
- Complexity: **High**
- Estimated: **3-4 sprints** (6-8 weeks)
- Requires ML expertise

## ❓ Questions for PM
- Do we have enough user data for collaborative filtering?
- What's the acceptable "cold start" experience?
- Budget for ML infrastructure?
\`\`\`

---

### Example 2: Developer → PM Translation

**Input (Developer perspective):**
\`\`\`
Optimized database queries with Redis caching layer. 
Reduced response time from 800ms to 250ms. QPS increased 30%.
\`\`\`

**Output (Product Manager receives):**
\`\`\`markdown
## 💼 Business Value & Impact
- **Pages load 3x faster** - users see content in under 300ms instead of 800ms
- **Supports 30% more users** without adding servers
- Users experience snappier, more responsive app

## 📈 Growth & Scalability
- Can now handle **50,000 daily active users** (vs 38,000 before)
- Prepared for upcoming marketing campaign
- Room for 50% user growth before next optimization needed

## 💰 Cost & Efficiency Benefits
- **Save ~$400/month** on database costs
- Reduced server load means fewer crashes during peak hours
- Less infrastructure scaling needed in next 6 months

## ✨ User Experience Improvements
- Feed loads instantly when opening app
- Smooth scrolling without lag
- Less frustration during high-traffic periods (lunch hours)

## ⚠️ Trade-offs & Considerations
- Cache needs monitoring - very rarely users might see 5-min-old data
- Small increase in complexity for future features
- Requires Redis maintenance (already automated)

## 🎉 Worth Celebrating
- This optimization unlocks our ability to launch in 3 new markets
- Puts us ahead of competitors in speed benchmarks
- Engineering innovation that required zero product changes
\`\`\`

---

## 🧠 Prompt Engineering Philosophy

The core of BridgeLink is **advanced prompt engineering**. The prompts are carefully crafted to ensure AI thinks like the target audience and proactively fills information gaps.

### PM → Dev Translator Design Principles

**1. Think Like a Tech Lead**
- The prompt instructs AI to act as a "senior technical architect" who reviews PRDs
- Forces critical thinking: "What's missing? What could go wrong?"
- Encourages asking the hard questions developers would ask

**2. Structured Output Requirements**
The prompt mandates 6 specific sections:
- **Technical Implementation Approach**: Concrete algorithms, patterns, architecture
- **Data & Architecture Design**: Data models, flow, APIs, database schema
- **Performance & Scalability**: Load estimates, latency targets, caching strategies
- **Technology Stack**: Specific libraries/frameworks with reasoning
- **Development Estimation**: Complexity, story points, team needs, risks
- **Critical Questions**: What information is missing that blocks development?

**3. Gap Identification**
The prompt explicitly lists common gaps to identify:
- Missing user flow details
- Unclear success criteria
- No mention of edge cases
- Vague performance expectations
- Missing integration requirements
- No consideration for future scalability

**4. Developer-Friendly Tone**
- Uses technical terminology (it's okay to be technical)
- Direct and actionable
- Highlights risks and unknowns
- Doesn't sugarcoat complexity

### Dev → PM Translator Design Principles

**1. Think Like a Product Strategist**
- The prompt positions AI as a "product strategist" who explains to stakeholders
- Focuses on business value, not technical details
- Translates every technical detail into business impact

**2. Business-Focused Output**
Mandates 6 business-oriented sections:
- **Business Value & Impact**: User benefits, product experience, measurable outcomes
- **Growth & Scalability Capacity**: User capacity, new capabilities, market opportunities
- **Cost & Efficiency Benefits**: Infrastructure savings, time savings, ROI
- **User Experience Improvements**: Noticeable changes, quality improvements
- **Trade-offs & Considerations**: Limitations, what we gave up, future work
- **Celebration-Worthy Achievements**: Technical wins explained in business terms

**3. Jargon Elimination Rules**
The prompt provides explicit translation rules:
- ❌ "QPS increased 30%" → ✅ "Can handle 30% more users simultaneously"
- ❌ "Redis caching" → ✅ "Smart data storage that makes pages load instantly"
- ❌ "Reduced latency" → ✅ "Pages load faster, users don't wait"

**4. Stakeholder-Friendly Language**
- Enthusiastic but honest
- Results-focused
- Clear and jargon-free
- Connects to business goals and OKRs

### Key Design Insights

**1. Proactive Gap Filling**
Both prompts don't just translate—they identify what's missing and suggest what should be included. This is the key differentiator from simple translation.

**2. Role-Based Thinking**
The prompts force AI to adopt the mindset of the target audience:
- PM→Dev: Think like a tech lead reviewing a PRD
- Dev→PM: Think like a PM explaining to executives

**3. Structured Output**
By mandating specific sections, we ensure consistency and completeness. Users always get the information they need.

**4. Context-Aware Translation**
The prompts include examples of common scenarios and edge cases, helping AI understand the context better.

### Prompt Evolution

The prompts were iteratively refined to:
- Reduce generic responses
- Increase specificity
- Better identify missing information
- Improve business value translation
- Handle edge cases better

**Result**: The prompts now produce outputs that are genuinely useful for cross-functional communication, not just word-for-word translations.

---

## 🏗️ Architecture

\`\`\`
app/
├── page.tsx                 # Main UI with role switcher
├── api/translate/route.ts   # API endpoint with streaming
├── layout.tsx               # Root layout with metadata
└── globals.css              # Tailwind theme

components/
├── translation-output.tsx   # Markdown renderer with streaming
└── ui/                      # shadcn/ui components

lib/
├── prompt-templates.ts      # Core prompt engineering logic
└── schemas.ts                # Zod validation schemas
\`\`\`

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **AI Integration**: Vercel AI SDK with streaming
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Type Safety**: TypeScript + Zod validation
- **Validation**: Zod for runtime type checking and input validation

---

## 🔧 Configuration

### Supported AI Providers
Currently supports any OpenAI-compatible API:
- Official OpenAI API
- Custom proxy services
- Self-hosted AI models with OpenAI-compatible endpoints

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Conditional | Official OpenAI API key |
| `CUSTOM_API_KEY` | Conditional | Custom proxy API key |
| `CUSTOM_API_BASE_URL` | Optional | Custom API base URL |

**Note:** You need to add your environment variables in the **Vars** section of the v0 in-chat sidebar.

---

## 🎨 Design Principles

1. **Professional & Technical**: Dark theme, monospace fonts, clear role indicators
2. **Efficient Workflow**: Minimal clicks, keyboard-friendly, instant feedback
3. **Trust & Transparency**: Show streaming process, clear examples, honest limitations
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

## 💡 Tips for Best Results

1. **Be specific in input**: More context = better translation
2. **Use examples**: Click "填入PM示例" or "填入开发示例" button above the input box to quickly load example content
3. **Iterate**: Try different phrasings if first result isn't perfect
4. **Customize prompts**: Edit `lib/prompt-templates.ts` for your team's needs
5. **Keyboard shortcuts**: 
   - `Cmd/Ctrl + Enter`: Translate
   - `Cmd/Ctrl + K`: Clear all

## 🔒 Data Validation

The project uses **Zod** for runtime type checking and input validation:
- Validates request format and types
- Ensures input length limits (max 5000 characters)
- Validates translation mode
- Provides clear error messages for invalid inputs

See `lib/schemas.ts` for validation schema definitions.

## 🔧 Environment Variables Setup

Create a `.env.local` file in the project root with your API configuration:

**Option 1: Official OpenAI API**
\`\`\`env
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`

**Option 2: Custom Proxy/Relay Service (Recommended for China users)**
\`\`\`env
CUSTOM_API_KEY=your-custom-api-key-here
CUSTOM_API_BASE_URL=https://your-proxy-server.com/v1
\`\`\`

**Notes:**
- If both `OPENAI_API_KEY` and `CUSTOM_API_KEY` are set, `CUSTOM_API_KEY` takes precedence
- `CUSTOM_API_BASE_URL` should point to an OpenAI-compatible API endpoint
- Make sure your API supports streaming responses for best experience

---

## 🧪 Test Cases

### Test Case 1: PM → Developer Translation

**Scenario**: Product Manager wants to add a recommendation feature

**Input**:
\`\`\`
We need a smart recommendation feature similar to TikTok's infinite scroll 
to increase user engagement time. Users should see personalized content based on their interests.
\`\`\`

**Expected Output Should Include**:
- ✅ Specific recommendation algorithms (collaborative filtering, content-based, etc.)
- ✅ Data architecture (user interaction data, content features, recommendation service)
- ✅ Performance requirements (latency targets, concurrent user capacity)
- ✅ Technology stack suggestions (specific libraries/frameworks)
- ✅ Development estimation (complexity level, story points, time range)
- ✅ Questions about missing information (cold start problem, data availability, etc.)

**Evaluation Criteria**:
- Does it identify technical gaps in the requirement?
- Are the suggestions concrete and actionable?
- Does it estimate complexity realistically?
- Are there questions that would help developers?

---

### Test Case 2: Developer → PM Translation

**Scenario**: Developer completed a performance optimization

**Input**:
\`\`\`
Optimized database queries with Redis caching layer. Reduced response time from 800ms to 250ms. 
QPS increased 30%. Also implemented connection pooling to handle more concurrent requests.
\`\`\`

**Expected Output Should Include**:
- ✅ User-facing benefits (pages load faster, smoother experience)
- ✅ Business capacity (can support X% more users)
- ✅ Cost savings (infrastructure cost reduction)
- ✅ Growth opportunities (what this enables)
- ✅ Trade-offs (any limitations or considerations)
- ✅ Celebration points (technical achievements in business terms)

**Evaluation Criteria**:
- Is technical jargon translated to business language?
- Are numbers translated to user/business impact?
- Does it explain what this means for the product?
- Are trade-offs and limitations mentioned?

---

### Test Case 3: Vague PM Requirement

**Input**:
\`\`\`
We need to make the app faster.
\`\`\`

**Expected Output Should Include**:
- ✅ Questions about what "faster" means (which pages? target metrics?)
- ✅ Multiple optimization approaches
- ✅ Performance measurement strategy
- ✅ Trade-offs between different approaches

**Evaluation Criteria**:
- Does it identify that the requirement is too vague?
- Does it ask clarifying questions?
- Does it suggest multiple approaches?

---

### Test Case 4: Technical Implementation Details

**Input**:
\`\`\`
Implemented microservices architecture using Docker containers, Kubernetes orchestration, 
and gRPC for inter-service communication. Added Prometheus monitoring and Grafana dashboards.
\`\`\`

**Expected Output Should Include**:
- ✅ What this means for users (more reliable? faster? scalable?)
- ✅ Business benefits (can handle growth, reduce downtime, etc.)
- ✅ Cost implications (infrastructure costs, maintenance)
- ✅ Future capabilities unlocked
- ✅ Any risks or trade-offs

**Evaluation Criteria**:
- Are technical terms explained in business language?
- Is the business value clear?
- Does it connect to product goals?

---

## 🎯 How to Evaluate Translation Quality

### For PM → Dev Translations:
1. **Completeness**: Does it cover all technical aspects needed?
2. **Specificity**: Are suggestions concrete (not generic)?
3. **Gap Identification**: Does it identify missing information?
4. **Actionability**: Can developers start working with this?

### For Dev → PM Translations:
1. **Jargon-Free**: Can a non-technical person understand it?
2. **Business Value**: Is the business impact clear?
3. **User Focus**: Does it explain user benefits?
4. **Honesty**: Are trade-offs and limitations mentioned?

---

**Made with AI-powered prompt engineering** 🚀
