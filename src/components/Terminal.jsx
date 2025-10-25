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
  const [cmdHistory, setCmdHistory] = useState([
    {
      type: "system",
      text: "Welcome to Git Visualizer Terminal 🎨",
      timestamp: new Date(),
    },
    {
      type: "system",
      text: 'Type "git help" to see available commands.',
      timestamp: new Date(),
    },
  ]);
  const [curInput, setCurInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandList, setCommandList] = useState([]);

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const lastToolbarCommandRef = useRef(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [cmdHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle external commands from toolbar
  useEffect(() => {
    if (commandsFromToolbar.length > 0) {
      const latestCmd = commandsFromToolbar[commandsFromToolbar.length - 1];
      if (latestCmd !== lastToolbarCommandRef.current) {
        lastToolbarCommandRef.current = latestCmd;
        executeCommand(latestCmd, true);
      }
    }
  }, [commandsFromToolbar, executeCommand]);

  const parseCommand = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Parse git command
    const parts = trimmed.split(/\s+/);
    if (parts[0] !== "git") {
      return { error: `Command not found: ${parts[0]}` };
    }

    const subCmd = parts[1];
    const args = parts.slice(2);

    return { subCmd, args };
  };

  const executeCommand = useCallback(
    (input, fromToolbar = false) => {
      const parsed = parseCommand(input);

      // Add command to history
      const newEntry = {
        type: "input",
        text: input,
        timestamp: new Date(),
        branch: currentBranch,
      };

      if (!parsed) {
        setCmdHistory((prev) => [...prev, newEntry]);
        return;
      }

      if (parsed.error) {
        setCmdHistory((prev) => [
          ...prev,
          newEntry,
          { type: "error", text: parsed.error, timestamp: new Date() },
        ]);
        return;
      }

      const { subCmd, args } = parsed;

      // Handle special commands
      if (subCmd === "help") {
        const helpText = [
          "Available commands:",
          "  git commit -m <message>    Create a new commit",
          "  git branch <name>          Create a new branch",
          "  git checkout <branch>      Switch to a branch",
          "  git merge <branch>         Merge a branch into current",
          "  git rebase <branch>        Rebase current onto branch",
          "  git reset <commit-id>      Reset branch to commit",
          "  git revert <commit-id>     Revert a commit",
          "  git log                    Show commit history",
          "  clear                      Clear terminal",
        ];
        setCmdHistory((prev) => [
          ...prev,
          newEntry,
          ...helpText.map((line) => ({
            type: "output",
            text: line,
            timestamp: new Date(),
          })),
        ]);
        return;
      }

      if (subCmd === "clear" || input.trim() === "clear") {
        setCmdHistory([]);
        return;
      }

      if (subCmd === "log") {
        const commits = Array.from(gitGraph.commits.values())
          .sort((a, b) => b.timestampMs - a.timestampMs)
          .slice(0, 10);

        const logOutput = commits.map(
          (c) =>
            `${c.id.substring(0, 7)} - ${c.message} (${
              c.createdByBranch || "unknown"
            })`
        );

        setCmdHistory((prev) => [
          ...prev,
          newEntry,
          ...logOutput.map((line) => ({
            type: "output",
            text: line,
            timestamp: new Date(),
          })),
        ]);
        return;
      }

      // Execute git commands
      try {
        let result;

        switch (subCmd) {
          case "commit": {
            const msgIndex = args.indexOf("-m");
            if (msgIndex === -1 || msgIndex === args.length - 1) {
              throw new Error(
                "Missing commit message. Use: git commit -m <message>"
              );
            }
            const message = args
              .slice(msgIndex + 1)
              .join(" ")
              .replace(/^["']|["']$/g, "");
            gitGraph.commit(message);
            result = `✓ Commit created: ${message}`;
            break;
          }

          case "branch": {
            if (args.length === 0) {
              const branches = Array.from(gitGraph.branches.keys());
              result = branches
                .map((b) => (b === currentBranch ? `* ${b}` : `  ${b}`))
                .join("\n");
            } else {
              gitGraph.createBranch(args[0]);
              result = `✓ Branch created: ${args[0]}`;
            }
            break;
          }

          case "checkout": {
            if (args.length === 0) {
              throw new Error(
                "Missing branch name. Use: git checkout <branch>"
              );
            }
            gitGraph.checkout(args[0]);
            result = `✓ Switched to branch: ${args[0]}`;
            break;
          }

          case "merge": {
            if (args.length === 0) {
              throw new Error("Missing branch name. Use: git merge <branch>");
            }
            gitGraph.merge(args[0]);
            result = `✓ Merged ${args[0]} into ${currentBranch}`;
            break;
          }

          case "rebase": {
            if (args.length === 0) {
              throw new Error("Missing branch name. Use: git rebase <branch>");
            }
            gitGraph.rebase(currentBranch, args[0]);
            result = `✓ Rebased ${currentBranch} onto ${args[0]}`;
            break;
          }

          case "reset": {
            if (args.length === 0) {
              throw new Error("Missing commit ID. Use: git reset <commit-id>");
            }
            gitGraph.reset(args[0]);
            result = `✓ Branch ${currentBranch} reset to ${args[0].substring(
              0,
              7
            )}`;
            break;
          }

          case "revert": {
            if (args.length === 0) {
              throw new Error("Missing commit ID. Use: git revert <commit-id>");
            }
            gitGraph.revert(args[0]);
            const commit = gitGraph.commits.get(args[0]);
            result = `✓ Reverted commit: ${commit?.message || args[0]}`;
            break;
          }

          default:
            throw new Error(
              `git: '${subCmd}' is not a git command. See 'git help'.`
            );
        }

        // Add output
        const outputLines = result.split("\n");
        setCmdHistory((prev) => [
          ...prev,
          newEntry,
          ...outputLines.map((line) => ({
            type: "success",
            text: line,
            timestamp: new Date(),
          })),
        ]);

        // Notify parent
        if (onCommandExecute) {
          onCommandExecute();
        }
      } catch (error) {
        setCmdHistory((prev) => [
          ...prev,
          newEntry,
          { type: "error", text: `✗ ${error.message}`, timestamp: new Date() },
        ]);
      }
    },
    [currentBranch, gitGraph, onCommandExecute]
  );

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (curInput.trim()) {
        setCommandList((prev) => [...prev, curInput]);
        executeCommand(curInput);
        setCurInput("");
        setHistoryIndex(-1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandList.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandList.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurInput(commandList[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandList.length) {
          setHistoryIndex(-1);
          setCurInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurInput(commandList[newIndex]);
        }
      }
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.div
      className="terminal-container glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="terminal-header">
        <div className="terminal-title">
          <TerminalIcon size={16} />
          <span>Git Terminal</span>
        </div>
        {onClose && (
          <button
            className="terminal-close"
            onClick={onClose}
            title="Close terminal"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="terminal-body" ref={terminalRef}>
        <AnimatePresence>
          {cmdHistory.map((entry, idx) => (
            <motion.div
              key={idx}
              className={`terminal-line terminal-line-${entry.type}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {entry.type === "input" && (
                <>
                  <span className="terminal-prompt">
                    <span className="terminal-branch">{entry.branch}</span>
                    <span className="terminal-arrow">➜</span>
                  </span>
                  <span className="terminal-command">{entry.text}</span>
                </>
              )}
              {entry.type !== "input" && (
                <span className="terminal-output">{entry.text}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="terminal-input-line">
          <span className="terminal-prompt">
            <span className="terminal-branch">{currentBranch}</span>
            <span className="terminal-arrow">➜</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={curInput}
            onChange={(e) => setCurInput(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type a git command..."
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Terminal;
