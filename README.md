# AI Support Agent

A customer support application that serves both end users and support technicians with AI-powered ticket creation and management.

## Features

### End User Interface
- **AI-Guided Chat**: Interactive chat interface with an AI assistant
- **Smart Ticket Creation**: AI guides users through gathering all necessary information
- **Category Detection**: Automatic categorization of issues with deduplication
- **Priority Assessment**: AI suggests appropriate priority levels based on issue severity

### Support Tech Interface
- **Dashboard Overview**: Statistics and metrics for all support tickets
- **Advanced Filtering**: Search and filter tickets by status, category, and keywords
- **Ticket Management**: Update ticket status (Open → In Progress → Resolved)
- **Real-time Updates**: Tickets are updated in real-time across the interface

### AI Assistant Capabilities
- Collects user name and email
- Determines issue category from predefined list
- Assesses priority level (low, medium, high)
- Generates concise ticket titles
- Gathers detailed problem descriptions
- Creates structured support tickets

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **AI Integration**: AI SDK with OpenAI GPT-4
- **State Management**: React hooks with localStorage persistence
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env\` file in the root directory:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For End Users
1. Visit the homepage and click "Start Chat"
2. Describe your issue to the AI assistant
3. Follow the AI's guidance to provide all necessary details
4. Receive a ticket confirmation with tracking ID

### For Support Technicians
1. Visit the homepage and click "View Dashboard"
2. Review all submitted tickets with filtering options
3. Update ticket statuses as work progresses
4. Use search and category filters to manage workload

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   └── tickets/route.ts       # Ticket management API
│   ├── chat/page.tsx              # End user chat interface
│   ├── dashboard/page.tsx         # Support tech dashboard
│   └── page.tsx                   # Landing page
├── components/
│   └── ui/                        # shadcn/ui components
└── README.md
\`\`\`

## Key Features Implementation

### AI-Powered Conversation Flow
The AI assistant uses a structured system prompt to guide users through ticket creation:
- Asks one question at a time to avoid overwhelming users
- Validates and acknowledges provided information
- Suggests appropriate priority levels based on issue type
- Creates structured tickets when all information is collected

### Smart Category Management
- Predefined categories: Technical Issue, Account Problem, Billing Question, Feature Request, Bug Report, General Inquiry
- AI automatically selects the most appropriate category
- Categories are deduplicated in the dashboard interface

### Responsive Design
- Mobile-friendly interface for both user types
- Clean, professional design with intuitive navigation
- Real-time updates and loading states

### Data Persistence
- Uses localStorage for demo purposes
- In production, would integrate with a proper database
- Tickets persist across browser sessions

## Customization

### Adding New Categories
Update the system prompt in \`app/api/chat/route.ts\` to include new categories.

### Modifying AI Behavior
Adjust the system prompt to change how the AI interacts with users or what information it collects.
