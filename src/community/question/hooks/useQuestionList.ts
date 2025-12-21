import { useEffect, useState } from "react";
import { getQuestionList } from "@/community/question/services/questionListApi";
import type { QuestionListResponse } from "@/community/question/types/questionList"

export function useQuestionList() {
  const [list, setList] = useState<QuestionListResponse[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getQuestionList(page, size, keyword);
        if (!mounted) return;
        setList(data.list);
        setTotalCount(data.totalCount);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page, keyword, size]);

  return {
    list,
    page,
    size,
    totalCount,
    keyword,
    setKeyword,
    setPage,
  };
}
