import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Trophy,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Coins,
  Zap,
  MousePointer2,
} from "lucide-react";

/**
 * ОПРЕДЕЛЕНИЕ ФИГУР
 * Форма задается массивом смещений [y, x] относительно точки захвата (0,0)
 */
const SHAPES = {
  I_3: {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    color: "bg-blue-500",
  },
  L_SHAPE: {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    color: "bg-indigo-500",
  },
  O_BLOCK: {
    cells: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    color: "bg-purple-500",
  },
  T_SHAPE: {
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    color: "bg-pink-500",
  },
  Z_SHAPE: {
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    color: "bg-orange-500",
  },
  U_SHAPE: {
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    color: "bg-cyan-600",
  },
  S_SMALL: {
    cells: [
      [0, 0],
      [0, 1],
    ],
    color: "bg-emerald-500",
  },
  DOT: { cells: [[0, 0]], color: "bg-slate-500" },
};

const LEVELS = [
  { id: 1, blocks: ["I_3", "O_BLOCK"], blocked: [] },
  { id: 2, blocks: ["L_SHAPE", "T_SHAPE", "S_SMALL"], blocked: [] },
  {
    id: 3,
    blocks: ["Z_SHAPE", "O_BLOCK", "I_3"],
    blocked: [
      [2, 2],
      [2, 3],
    ],
  },
  {
    id: 4,
    blocks: ["L_SHAPE", "T_SHAPE", "Z_SHAPE", "DOT"],
    blocked: [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ],
  },
  {
    id: 5,
    blocks: ["U_SHAPE", "I_3", "O_BLOCK", "Z_SHAPE", "S_SMALL"],
    blocked: [
      [1, 1],
      [1, 3],
      [2, 2],
      [3, 1],
      [3, 3],
      [0, 2],
    ],
  },
];

const GRID_SIZE = 5;

export const PazzleGame = ({
  jobData = { reward: 600, energyCost: 40 },
  onFinish,
}) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [grid, setGrid] = useState(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null)),
  );
  const [pool, setPool] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [previewCells, setPreviewCells] = useState([]);
  const [showVictory, setShowVictory] = useState(false);

  const containerRef = useRef(null);
  const currentLevel = LEVELS[currentLevelIdx];

  // Инициализация уровня
  useEffect(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    currentLevel.blocked.forEach(([y, x]) => {
      newGrid[y][x] = { type: "blocked" };
    });
    setGrid(newGrid);

    setPool(
      currentLevel.blocks.map((type, index) => ({
        id: `block-${currentLevelIdx}-${index}`,
        type,
        data: SHAPES[type],
        placed: false,
        pos: null,
      })),
    );
  }, [currentLevelIdx]);

  const isLevelComplete = useMemo(() => {
    return pool.length > 0 && pool.every((b) => b.placed);
  }, [pool]);

  const handleStartDrag = (e, block, fromGrid = false) => {
    e.preventDefault();
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    setDraggedBlock({ ...block, fromGrid });
    setDragPos({ x: clientX, y: clientY });

    if (fromGrid) {
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        block.data.cells.forEach(([dy, dx]) => {
          const py = block.pos.y + dy;
          const px = block.pos.x + dx;
          if (next[py] && next[py][px]?.id === block.id) next[py][px] = null;
        });
        return next;
      });
    }
  };

  const handleMove = (e) => {
    if (!draggedBlock) return;
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
    setDragPos({ x: clientX, y: clientY });

    const gridEl = containerRef.current.querySelector(".game-grid");
    const rect = gridEl.getBoundingClientRect();
    const cellSize = rect.width / GRID_SIZE;

    // Расчет координат относительно сетки (с учетом центра фигуры)
    const gx = Math.floor((clientX - rect.left) / cellSize);
    const gy = Math.floor((clientY - rect.top) / cellSize);

    const validCells = [];
    let possible = true;

    draggedBlock.data.cells.forEach(([dy, dx]) => {
      const targetY = gy + dy;
      const targetX = gx + dx;
      if (
        targetY >= 0 &&
        targetY < GRID_SIZE &&
        targetX >= 0 &&
        targetX < GRID_SIZE
      ) {
        if (grid[targetY][targetX] !== null) possible = false;
        validCells.push({ y: targetY, x: targetX });
      } else {
        possible = false;
      }
    });

    setPreviewCells(possible ? validCells : []);
  };

  const handleEndDrag = () => {
    if (!draggedBlock) return;

    if (previewCells.length === draggedBlock.data.cells.length) {
      // Успешная постановка
      const gy = previewCells[0].y - draggedBlock.data.cells[0][0];
      const gx = previewCells[0].x - draggedBlock.data.cells[0][1];

      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        previewCells.forEach(({ y, x }) => {
          next[y][x] = { id: draggedBlock.id, color: draggedBlock.data.color };
        });
        return next;
      });

      setPool((prev) =>
        prev.map((b) =>
          b.id === draggedBlock.id
            ? { ...b, placed: true, pos: { y: gy, x: gx } }
            : b,
        ),
      );
    } else {
      // Возврат в пул
      setPool((prev) =>
        prev.map((b) =>
          b.id === draggedBlock.id ? { ...b, placed: false, pos: null } : b,
        ),
      );
    }

    setDraggedBlock(null);
    setPreviewCells([]);
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      setShowVictory(true);
    }
  };

  const BlockPreview = ({ block, scale = 1, isDragging = false }) => {
    // Находим границы фигуры для правильного рендеринга сетки
    const maxY = Math.max(...block.data.cells.map((c) => c[0]));
    const maxX = Math.max(...block.data.cells.map((c) => c[1]));

    return (
      <div
        className={`grid gap-1 ${isDragging ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"}`}
        style={{
          gridTemplateRows: `repeat(${maxY + 1}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
          width: isDragging ? `${(maxX + 1) * 40}px` : "auto",
        }}
      >
        {Array.from({ length: (maxY + 1) * (maxX + 1) }).map((_, i) => {
          const r = Math.floor(i / (maxX + 1));
          const c = i % (maxX + 1);
          const active = block.data.cells.some(
            (cell) => cell[0] === r && cell[1] === c,
          );
          return (
            <div
              key={i}
              className={`w-6 h-6 md:w-8 md:h-8 rounded-md transition-colors ${active ? block.data.color : "bg-transparent"}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 font-sans select-none overflow-hidden"
      onMouseMove={handleMove}
      onMouseUp={handleEndDrag}
      onTouchMove={handleMove}
      onTouchEnd={handleEndDrag}
    >
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
              Shape Puzzle
            </h2>
            <div className="flex gap-1">
              {LEVELS.map((l, i) => (
                <div
                  key={l.id}
                  className={`h-1.5 w-6 rounded-full transition-all ${i <= currentLevelIdx ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-800"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Награда
          </span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1">
            <Coins size={16} /> {jobData.reward}
          </span>
        </div>
      </div>

      {/* Main Board */}
      <div className="relative group">
        <div className="game-grid grid grid-cols-5 gap-2 bg-slate-200 dark:bg-slate-800 p-3 rounded-[2rem] shadow-inner border-4 border-white dark:border-slate-900">
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPreview = previewCells.some(
                (p) => p.x === x && p.y === y,
              );
              const isBlocked = cell?.type === "blocked";
              const isOccupied = cell && !isBlocked;

              return (
                <div
                  key={`${y}-${x}`}
                  className={`
                  w-12 h-12 md:w-16 md:h-16 rounded-xl transition-all duration-200 flex items-center justify-center
                  ${isBlocked ? "bg-slate-400 dark:bg-slate-700" : "bg-white dark:bg-slate-900"}
                  ${isPreview ? "bg-indigo-300 dark:bg-indigo-500/50 scale-95 animate-pulse shadow-lg" : ""}
                  ${isOccupied ? `${cell.color} shadow-lg border-2 border-white/20` : ""}
                `}
                  onMouseDown={(e) => {
                    if (isOccupied) {
                      const block = pool.find((b) => b.id === cell.id);
                      handleStartDrag(e, block, true);
                    }
                  }}
                >
                  {isBlocked && (
                    <AlertCircle
                      size={20}
                      className="text-slate-300 dark:text-slate-600 opacity-40"
                    />
                  )}
                  {isOccupied && !draggedBlock && (
                    <MousePointer2
                      size={14}
                      className="text-white/40 absolute"
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>

        {/* Level Success Overlay */}
        {isLevelComplete && !showVictory && (
          <div className="absolute inset-0 z-20 bg-indigo-600/90 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
              <CheckCircle2 size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Отлично!</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Все блоки на своих местах
            </p>
            <button
              onClick={nextLevel}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 shadow-xl"
            >
              Уровень {currentLevelIdx + 2} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Pool Area */}
      <div className="mt-8 w-full max-w-lg">
        <div className="flex flex-wrap justify-center items-end gap-8 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 min-h-[140px]">
          {pool.map(
            (block) =>
              !block.placed && (
                <div
                  key={block.id}
                  className="transition-transform hover:scale-110 active:scale-95"
                  onMouseDown={(e) => handleStartDrag(e, block)}
                  onTouchStart={(e) => handleStartDrag(e, block)}
                >
                  <BlockPreview block={block} />
                </div>
              ),
          )}
          {pool.every((b) => b.placed) && (
            <p className="text-slate-400 font-medium italic text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> Поле заполнено
            </p>
          )}
        </div>
      </div>

      {/* Ghost Dragging Block */}
      {draggedBlock && (
        <div
          className="fixed pointer-events-none z-50 opacity-70 scale-110"
          style={{
            left: dragPos.x - 20, // Смещение для визуального центра
            top: dragPos.y - 20,
          }}
        >
          <BlockPreview block={draggedBlock} isDragging />
        </div>
      )}

      {/* Final Victory Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl border border-indigo-100 dark:border-slate-800">
            <div className="relative inline-block mb-6">
              <Trophy size={80} className="text-yellow-500 animate-bounce" />
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                MVP
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Головоломка решена!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm px-4">
              Вы успешно завершили все 5 уровней и оптимизировали структуру
              данных.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Золото
                </span>
                <span className="text-xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-1">
                  <Coins size={18} className="text-yellow-500" /> +
                  {jobData.reward}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Опыт
                </span>
                <span className="text-xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-1">
                  <Zap size={18} className="text-blue-500" /> +250
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onFinish({
                  reward: jobData.reward,
                  energyCost: jobData.energyCost,
                  exp: 250,
                })
              }
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              Забрать награду
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
