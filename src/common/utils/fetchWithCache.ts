const fetchWithCache = async <T>({
    ids,
    cacheFetchFn,
    remoteFetchFn,
    getId,
}: {
    ids: string[];
    cacheFetchFn: (ids: string[]) => Promise<T[]>;
    remoteFetchFn: (ids: string[]) => Promise<T[]>;
    getId: (record: T) => string;
}): Promise<T[]> => {
    const uniqueIds = Array.from(new Set(ids));

    const cached = await cacheFetchFn(uniqueIds);
    const cachedIds = new Set(cached.map(getId));

    const missingIds = uniqueIds.filter((id) => !cachedIds.has(id));

    const missing = missingIds.length ? await remoteFetchFn(missingIds) : [];

    return [...cached, ...missing];
};

export default fetchWithCache;
