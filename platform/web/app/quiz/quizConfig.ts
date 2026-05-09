export type QuizOption = {
  id: string;
  label: string;
  /** 选此项时计入总分的分值 */
  score: number;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "你更倾向哪种出行节奏？",
    options: [
      { id: "q1a", label: "每天排满景点，效率优先", score: 3 },
      { id: "q1b", label: "留白发呆，随缘走走", score: 1 },
      { id: "q1c", label: "经典必去 + 小幅机动", score: 2 },
    ],
  },
  {
    id: "q2",
    prompt: "住宿你更看重？",
    options: [
      { id: "q2a", label: "交通与性价比", score: 2 },
      { id: "q2b", label: "设计氛围与景观", score: 3 },
      { id: "q2c", label: "当地特色民宿 / 老屋", score: 2 },
    ],
  },
  {
    id: "q3",
    prompt: "遇到行程被打乱时？",
    options: [
      { id: "q3a", label: "立刻改计划追上原目标", score: 3 },
      { id: "q3b", label: "顺势改成当下更舒服的安排", score: 1 },
      { id: "q3c", label: "先冷静查备选，再决定", score: 2 },
    ],
  },
  {
    id: "q4",
    prompt: "旅行结束归来后你通常？",
    options: [
      { id: "q4a", label: "尽快整理照片/游记", score: 3 },
      { id: "q4b", label: "先休整，之后慢慢补", score: 1 },
      { id: "q4c", label: "挑几张发朋友圈就够", score: 2 },
    ],
  },
];

/**
 * 根据总分映射称号（与 quizQuestions 分值范围一致，可按业务调整档位的分数区间）。
 */
export function getHonorTitle(totalScore: number): string {
  if (totalScore <= 6) return "随兴漫旅者";
  if (totalScore <= 9) return "均衡探路人";
  if (totalScore <= 11) return "周密计划派";
  return "极限效率玩家";
}
