import { useInView } from "@/app/hooks/useInView";
import { trpc } from "@/app/lib/TRPC";

export const PAGE_SIZE = 10;

export function useListTask() {
  const query = trpc.task.list.useInfiniteQuery(
    { limit: PAGE_SIZE },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const sentinelRef = useInView<HTMLDivElement>(
    () => query.fetchNextPage(),
    query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError,
  );

  const tasks = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { query, tasks, sentinelRef };
}
