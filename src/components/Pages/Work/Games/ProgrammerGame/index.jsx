import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Check,
  ChevronRight,
  Play,
  FileCode,
  Search,
  GitBranch,
  Layers,
  Settings,
  AlertCircle,
  Code2,
} from "lucide-react";

// --- КОНФИГУРАЦИЯ УРОВНЕЙ (20 штук) ---
const LEVELS_DATA = [
  {
    id: 1,
    title: "Variable",
    fileName: "setup.js",
    code: [
      {
        text: "konst",
        isError: true,
        correct: "const",
        options: ["const", "constant", "cnst"],
        id: "e1",
      },
      { text: " x = 10;", isError: false },
    ],
  },
  {
    id: 2,
    title: "Functions",
    fileName: "utils.js",
    code: [
      { text: "function test() { ", isError: false },
      {
        text: ";;",
        isError: true,
        correct: ";",
        options: [":", ";", "!!!"],
        id: "e2",
      },
      { text: " }", isError: false },
    ],
  },
  {
    id: 3,
    title: "Return",
    fileName: "logic.js",
    code: [
      { text: "if (x) { ", isError: false },
      {
        text: "retun",
        isError: true,
        correct: "return",
        options: ["returns", "return", "ret"],
        id: "e3",
      },
      { text: " false }", isError: false },
    ],
  },
  {
    id: 4,
    title: "Array Method",
    fileName: "data.js",
    code: [
      { text: "list.", isError: false },
      {
        text: "forEachh",
        isError: true,
        correct: "forEach",
        options: ["forEach", "forEvery", "each"],
        id: "e4",
      },
      { text: "(() => {})", isError: false },
    ],
  },
  {
    id: 5,
    title: "Async",
    fileName: "api.js",
    code: [
      {
        text: "asinc",
        isError: true,
        correct: "async",
        options: ["async", "sync", "waiter"],
        id: "e5",
      },
      { text: " function get() {}", isError: false },
    ],
  },
  {
    id: 6,
    title: "React Hook",
    fileName: "App.jsx",
    code: [
      { text: "const [s, setS] = ", isError: false },
      {
        text: "useStat",
        isError: true,
        correct: "useState",
        options: ["useState", "useStatus", "state"],
        id: "e6",
      },
      { text: "(0)", isError: false },
    ],
  },
  {
    id: 7,
    title: "Import",
    fileName: "index.js",
    code: [
      {
        text: "impoort",
        isError: true,
        correct: "import",
        options: ["import", "include", "require"],
        id: "e7",
      },
      { text: " React from 'react'", isError: false },
    ],
  },
  {
    id: 8,
    title: "JSON",
    fileName: "config.json",
    code: [
      { text: '{ "key": ', isError: false },
      {
        text: "'value'",
        isError: true,
        correct: '"value"',
        options: ['"value"', "value", "`value`"],
        id: "e8",
      },
      { text: " }", isError: false },
    ],
  },
  {
    id: 9,
    title: "Loop",
    fileName: "main.py",
    code: [
      { text: "for (let i=0; i < 10; ", isError: false },
      {
        text: "i++-",
        isError: true,
        correct: "i++",
        options: ["i++", "i+1", "++i"],
        id: "e9",
      },
      { text: ") {}", isError: false },
    ],
  },
  {
    id: 10,
    title: "Boolean",
    fileName: "check.js",
    code: [
      { text: "const isReady = ", isError: false },
      {
        text: "truu",
        isError: true,
        correct: "true",
        options: ["true", "yes", "1"],
        id: "e10",
      },
      { text: ";", isError: false },
    ],
  },
  {
    id: 11,
    title: "Class",
    fileName: "Player.js",
    code: [
      {
        text: "cllass",
        isError: true,
        correct: "class",
        options: ["class", "className", "object"],
        id: "e11",
      },
      { text: " Hero {}", isError: false },
    ],
  },
  {
    id: 12,
    title: "Condition",
    fileName: "gate.js",
    code: [
      { text: "if (a ", isError: false },
      {
        text: "===",
        isError: true,
        correct: "===",
        options: ["===", "=>", "=<"],
        id: "e12",
      },
      { text: " b)", isError: false },
    ],
  },
  {
    id: 13,
    title: "Export",
    fileName: "mod.js",
    code: [
      {
        text: "exsport",
        isError: true,
        correct: "export",
        options: ["export", "module.out", "public"],
        id: "e13",
      },
      { text: " default Fn;", isError: false },
    ],
  },
  {
    id: 14,
    title: "Await",
    fileName: "fetch.js",
    code: [
      { text: "const r = ", isError: false },
      {
        text: "awaait",
        isError: true,
        correct: "await",
        options: ["await", "wait", "async"],
        id: "e14",
      },
      { text: " req();", isError: false },
    ],
  },
  {
    id: 15,
    title: "Object",
    fileName: "user.js",
    code: [
      { text: "const u = { name", isError: false },
      {
        text: "::",
        isError: true,
        correct: ":",
        options: [":", "=", "=>"],
        id: "e15",
      },
      { text: " 'Admin' };", isError: false },
    ],
  },
  {
    id: 16,
    title: "Types",
    fileName: "types.ts",
    code: [
      { text: "let n:", isError: false },
      {
        text: "nummber",
        isError: true,
        correct: "number",
        options: ["number", "int", "float"],
        id: "e16",
      },
      { text: " = 5;", isError: false },
    ],
  },
  {
    id: 17,
    title: "Null",
    fileName: "null.js",
    code: [
      { text: "let x = ", isError: false },
      {
        text: "nulll",
        isError: true,
        correct: "null",
        options: ["null", "nil", "undefined"],
        id: "e17",
      },
      { text: ";", isError: false },
    ],
  },
  {
    id: 18,
    title: "Arrow Fn",
    fileName: "arrow.js",
    code: [
      { text: "const f = () ", isError: false },
      {
        text: "=>-",
        isError: true,
        correct: "=>",
        options: ["=>", "->", ">"],
        id: "e18",
      },
      { text: " {}", isError: false },
    ],
  },
  {
    id: 19,
    title: "Console",
    fileName: "test.js",
    code: [
      {
        text: "consoole",
        isError: true,
        correct: "console",
        options: ["console", "log", "print"],
        id: "e19",
      },
      { text: ".log(1);", isError: false },
    ],
  },
  {
    id: 20,
    title: "Length",
    fileName: "str.js",
    code: [
      { text: "str.", isError: false },
      {
        text: "lenght",
        isError: true,
        correct: "length",
        options: ["length", "len", "size"],
        id: "e20",
      },
      { text: ";", isError: false },
    ],
  },
];

export const ProgrammerGame = ({ onFinish, jobData }) => {
  // Настройки сессии
  console.log(jobData);
  const TASKS_PER_SESSION = 5;

  // Состояние
  const [sessionTaskCount, setSessionTaskCount] = useState(0); // Сколько решили в этой сессии
  const [globalLevelIdx, setGlobalLevelIdx] = useState(() => {
    const saved = sessionStorage.getItem("prog_game_level_idx");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [solvedErrors, setSolvedErrors] = useState({});
  const [activeErrorMenu, setActiveErrorMenu] = useState(null);
  const [gameStatus, setGameStatus] = useState("playing");

  const currentLevel = LEVELS_DATA[globalLevelIdx % LEVELS_DATA.length];
  const totalErrorsInLevel = useMemo(
    () => currentLevel.code.filter((part) => part.isError).length,
    [currentLevel],
  );

  // Проверка решения уровня
  useEffect(() => {
    const levelErrors = currentLevel.code.filter((p) => p.isError);
    const allFixed = levelErrors.every(
      (err) => solvedErrors[err.id] === err.correct,
    );
    if (allFixed && levelErrors.length > 0) setGameStatus("level_complete");
  }, [solvedErrors, currentLevel]);

  const handleFix = (errorId, choice) => {
    setSolvedErrors((prev) => ({ ...prev, [errorId]: choice }));
    setActiveErrorMenu(null);
  };

  const nextLevel = () => {
    const nextIdx = (globalLevelIdx + 1) % LEVELS_DATA.length;
    const nextSessionCount = sessionTaskCount + 1;
    // Сохраняем глобальный прогресс
    setGlobalLevelIdx(nextIdx);
    sessionStorage.setItem("prog_game_level_idx", nextIdx);
    if (nextSessionCount >= TASKS_PER_SESSION) {
      setGameStatus("finished");
      // ВАЖНО: передаем объект с данными, которые ожидает родительский компонент Work
      if (onFinish) {
        onFinish({
          money: jobData.reward,
          energy: jobData.energyCost,
          timeAdd: jobData.duration,
        });
      }
    } else {
      setSessionTaskCount(nextSessionCount);
      setSolvedErrors({});
      setGameStatus("playing");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#0d1117",
        color: "#d1d5db",
        fontFamily: "monospace",
      }}
    >
      {/* Header / Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#161b22",
          height: "35px",
          alignItems: "center",
          borderBottom: "1px solid #30363d",
          justifyContent: "space-between",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            height: "100%",
            backgroundColor: "#0d1117",
            borderTop: "1px solid #f97316",
            fontSize: "13px",
            gap: "8px",
          }}
        >
          <FileCode size={14} color="#f97316" />
          <span>{currentLevel.fileName}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#64748b" }}>
          ЗАДАЧИ: {sessionTaskCount + 1} / {TASKS_PER_SESSION}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* VS Code Sidebar Sidebar */}
        <div
          style={{
            width: "48px",
            backgroundColor: "#161b22",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "10px",
            gap: "20px",
            borderRight: "1px solid #30363d",
          }}
        >
          <FileCode size={24} color="#fff" />
          <Search size={24} color="#6b7280" />
          <GitBranch size={24} color="#6b7280" />
          <div style={{ marginTop: "auto", marginBottom: "15px" }}>
            <Settings size={20} color="#6b7280" />
          </div>
        </div>

        {/* Editor */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "15px 25px",
              borderBottom: "1px solid #30363d",
              background: "#0d1117",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Code2 size={18} color="#3b82f6" />
              <h2 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>
                Ticket #{currentLevel.id}: {currentLevel.title}
              </h2>
            </div>
          </div>

          <div
            style={{
              padding: "30px",
              flex: 1,
              display: "flex",
              fontSize: "1.2rem",
              backgroundColor: "#0d1117",
            }}
          >
            <div
              style={{
                paddingRight: "20px",
                color: "#4b5563",
                textAlign: "right",
                borderRight: "1px solid #30363d",
                marginRight: "20px",
                userSelect: "none",
              }}
            >
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                alignContent: "flex-start",
              }}
            >
              {currentLevel.code.map((part, index) => {
                if (!part.isError) {
                  return (
                    <span
                      key={index}
                      style={{ color: "#d2a8ff", whiteSpace: "pre" }}
                    >
                      {part.text}
                    </span>
                  );
                }
                const isFixed = solvedErrors[part.id] === part.correct;
                const currentDisplay = solvedErrors[part.id] || part.text;
                return (
                  <div
                    key={index}
                    style={{ position: "relative", margin: "0 4px" }}
                  >
                    <span
                      onClick={() => !isFixed && setActiveErrorMenu(part.id)}
                      style={{
                        cursor: isFixed ? "default" : "pointer",
                        padding: "0 4px",
                        borderRadius: "2px",
                        color: isFixed ? "#4ade80" : "#f87171",
                        borderBottom: isFixed
                          ? "2px solid #22c55e"
                          : "2px dashed #ef4444",
                        backgroundColor: isFixed
                          ? "transparent"
                          : "rgba(239, 68, 68, 0.1)",
                        transition: "all 0.2s",
                      }}
                    >
                      {currentDisplay}
                    </span>
                    {activeErrorMenu === part.id && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: 100,
                          top: "100%",
                          left: 0,
                          marginTop: "8px",
                          width: "200px",
                          backgroundColor: "#1c2128",
                          border: "1px solid #444c56",
                          borderRadius: "6px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "6px 12px",
                            fontSize: "10px",
                            color: "#768390",
                            borderBottom: "1px solid #444c56",
                            background: "#22272e",
                          }}
                        >
                          QUICK FIX
                        </div>
                        {part.options.map((opt) => (
                          <div
                            key={opt}
                            onClick={() => handleFix(part.id, opt)}
                            style={{
                              padding: "10px 12px",
                              fontSize: "13px",
                              cursor: "pointer",
                              transition: "0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#316dca")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "transparent")
                            }
                          >
                            Заменить на{" "}
                            <span
                              style={{ color: "#adbac7", fontWeight: "bold" }}
                            >
                              {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console / Problems */}
          <div
            style={{
              height: "140px",
              backgroundColor: "#0d1117",
              borderTop: "1px solid #30363d",
              padding: "12px",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "12px",
                marginBottom: "10px",
                display: "flex",
                gap: "20px",
              }}
            >
              <span
                style={{
                  borderBottom: "2px solid #f97316",
                  paddingBottom: "2px",
                  cursor: "pointer",
                }}
              >
                Problems
              </span>
              <span style={{ color: "#6b7280", cursor: "not-allowed" }}>
                Output
              </span>
              <span style={{ color: "#6b7280", cursor: "not-allowed" }}>
                Terminal
              </span>
            </div>
            <div style={{ fontSize: "13px", fontFamily: "monospace" }}>
              {Object.keys(solvedErrors).length === totalErrorsInLevel ? (
                <div
                  style={{
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Check size={14} /> Все тесты пройдены. Ошибок нет.
                </div>
              ) : (
                <div
                  style={{
                    color: "#f87171",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={14} /> SyntaxError: Unexpected token in{" "}
                  {currentLevel.fileName}
                </div>
              )}
              <div style={{ color: "#4b5563", marginTop: "10px" }}>
                $ node --watch {currentLevel.fileName}
              </div>
            </div>
          </div>

          {/* Level Win Modal */}
          {gameStatus === "level_complete" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(13, 17, 23, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 200,
                backdropFilter: "blur(2px)",
              }}
            >
              <div
                style={{
                  backgroundColor: "#161b22",
                  padding: "40px",
                  borderRadius: "16px",
                  textAlign: "center",
                  border: "1px solid #30363d",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Check size={35} color="#22c55e" />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    margin: "0 0 10px 0",
                    fontSize: "1.5rem",
                  }}
                >
                  Build Successful!
                </h3>
                <p style={{ color: "#64748b", marginBottom: "25px" }}>
                  Вы исправили код. Прогресс сессии: {sessionTaskCount + 1}/
                  {TASKS_PER_SESSION}
                </p>
                <button
                  onClick={nextLevel}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "transform 0.1s",
                  }}
                  onMouseDown={(e) =>
                    (e.target.style.transform = "scale(0.95)")
                  }
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {sessionTaskCount + 1 >= TASKS_PER_SESSION
                    ? "Сдать проект"
                    : "Следующий тикет"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
