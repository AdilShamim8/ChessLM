# ChessLM - Master Chess with AI

![ChessLM Header](public/rook.png)

**ChessLM** is a next-generation chess platform that allows valid chess games against advanced Large Language Models (LLMs). Play against OpenAI, Anthropic, Google Gemini, and more in a sleek, distraction-free environment aimed at Grandmaster-level analysis and strategy.

## 🚀 Features

-   **Multi-Engine Support**: Challenge different AI personalities and capabilities (OpenAI GPT-4, Claude 3.5 Sonnet, Gemini Pro, Grok).
-   **Real-time Analysis**: Get instant feedback on your moves.
-   **Sleek UI**: A modern, responsive interface built with Shadcn/UI and Tailwind CSS.
-   **Grandmaster Persona**: The AI is prompted to play with high-level strategic and tactical understanding.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Game Logic**: [Chess.js](https://github.com/jhlywa/chess.js) & [React-Chessboard](https://github.com/Clariity/react-chessboard)

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ovishkh/ChessLM.git
    cd ChessLM
    ```

2.  **Install dependencies**:
    ```bash
    make install
    # or
    npm install
    ```

3.  **Configure Environment**:
    Copy the example environment file and add your API keys.
    ```bash
    cp .env.example .env.local
    ```
    Then edit `.env.local` with your preferred editor.

4.  **Run Development Server**:
    ```bash
    make dev
    # or
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

We use a `Makefile` for convenience:

-   `make install`: Install dependencies.
-   `make dev`: Start the development server.
-   `make build`: Build for production.
-   `make lint`: Run code linting.
-   `make clean`: Clean build artifacts and node_modules.

## 🤝 Contributing

We welcome contributions! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Ovi Shekh](https://ovishekh.com)**
