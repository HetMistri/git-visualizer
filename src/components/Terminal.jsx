/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X } from "lucide-react";
import "./Terminal.css";

const Terminal = ({
  gitGraph,
  currentBranch,
  onCommandExecute,
  commandsFromToolbar = [],
  onClose,
}) => {
  // -----------------------------
  // STATE & REFERENCES
  // -----------------------------
  const [history, setHistory] = useState([
    { type: "system", text: "Welcome to Git Visualizer Terminal 🎨" },
    { type: "system", text: 'Type "git help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // -----------------------------
  // SCROLL & FOCUS HANDLING
  // -----------------------------
  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // -----------------------------
  // COMMAND PARSING
  // -----------------------------
  const parseCommand = (cmd) => {
    const parts = cmd.trim().split(/\s+/);
    if (parts[0] !== "git") {
      return { error: `Unknown command: ${parts[0]}` };
    }
    return { subCmd: parts[1], args: parts.slice(2) };
  };

  // -----------------------------
  // COMMAND EXECUTION
  // -----------------------------
  const executeCommand = useCallback(
    (cmd) => {
      const parsed = parseCommand(cmd);
      const inputEntry = { type: "input", text: cmd, branch: currentBranch };

      // 1️⃣ Invalid or unknown command
      if (!parsed || parsed.error) {
        return setHistory((prev) => [
          ...prev,
          inputEntry,
          { type: "error", text: parsed?.error || "Invalid command." },
        ]);
      }

      const { subCmd, args } = parsed;
      let output = [];

      try {
        switch (subCmd) {
          case "help":
            output = [
              "Available commands:",
              "  git commit -m <msg>   → Create a commit",
              "  git branch [name]     → Create or list branches",
              "  git checkout <name>   → Switch branch",
              "  git merge <name>      → Merge branch",
              "  git reset <id>        → Reset to commit",
              "  git log               → Show recent commits",
              "  git clear             → Clear terminal",
            ];
            break;

          case "clear":
          case "cls":
            setHistory([]);
            return;

          case "commit": {
            const msgIndex = args.indexOf("-m");
            if (msgIndex === -1 || msgIndex === args.length - 1)
              throw new Error("Missing commit message. Use: git commit -m <msg>");
            const message = args.slice(msgIndex + 1).join(" ");
            gitGraph.commit(message);
            output = [`✅ Commit created: "${message}"`];
            break;
          }

          case "branch": {
            if (args.length === 0) {
              const branches = Array.from(gitGraph.branches.keys());
              output = branches.map((b) =>
                b === currentBranch ? `* ${b}` : `  ${b}`
              );
            } else {
              gitGraph.createBranch(args[0]);
              output = [`✅ Branch created: ${args[0]}`];
            }
            break;
          }

          case "checkout":
            if (args.length === 0)
              throw new Error("Missing branch name. Use: git checkout <name>");
            gitGraph.checkout(args[0]);
            output = [`✅ Switched to branch: ${args[0]}`];
            break;

          case "merge":
            if (args.length === 0)
              throw new Error("Missing branch name. Use: git merge <name>");
            gitGraph.merge(args[0]);
            output = [`✅ Merged ${args[0]} into ${currentBranch}`];
            break;

          case "reset":
            if (args.length === 0)
              throw new Error("Missing commit ID. Use: git reset <id>");
            gitGraph.reset(args[0]);
            output = [`✅ Reset ${currentBranch} to ${args[0].slice(0, 7)}`];
            break;

          case "log": {
            const commits = Array.from(gitGraph.commits.values())
              .sort((a, b) => b.timestampMs - a.timestampMs)
              .slice(0, 8);
            output = commits.map(
              (c) =>
                `${c.id.slice(0, 7)} - ${c.message} (${c.createdByBranch ?? "?"})`
            );
            break;
          }

          default:
            throw new Error(`Unknown git command: ${subCmd}`);
        }

        setHistory((prev) => [
          ...prev,
          inputEntry,
          ...output.map((t) => ({ type: "success", text: t })),
        ]);
        onCommandExecute?.();
      } catch (err) {
        setHistory((prev) => [
          ...prev,
          inputEntry,
          { type: "error", text: `✗ ${err.message}` },
        ]);
      }
    },
    [gitGraph, currentBranch, onCommandExecute]
  );

  // -----------------------------
  // INPUT HANDLING (↑, ↓, ENTER)
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input);
      setCommandHistory((prev) => [...prev, input]);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <motion.div
      className="terminal-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.25 }}
    >
      <div className="terminal-header">
        <div className="terminal-title">
          <TerminalIcon size={16} />
          <span>Git Terminal</span>
        </div>
        <button className="terminal-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="terminal-body" ref={terminalRef}>
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              className={`terminal-line terminal-line-${entry.type}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              {entry.type === "input" ? (
                <>
                  <span className="terminal-branch">{entry.branch}</span>
                  <span className="terminal-arrow">➜</span>
                  <span className="terminal-command">{entry.text}</span>
                </>
              ) : (
                <span className="terminal-output">{entry.text}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="terminal-input-line">
          <span className="terminal-branch">{currentBranch}</span>
          <span className="terminal-arrow">➜</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            placeholder="Type a git command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Terminal;
