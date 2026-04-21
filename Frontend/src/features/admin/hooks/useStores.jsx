const useStores = ({ status }) => {
    const { data, loading, error } = useFetch(`/api/stores?status=${status}`);
    const [stores, setStores] = useState([]);
    const [loadingIds, setLoadingIds] = useState(() => new Set());

    // sync fetched data into local state
    useEffect(() => {
        if (data?.stores) setStores(data.stores);
    }, [data]);

    const updateStatus = useCallback(
        async (storeId, newStatus) => {
            // 1. optimistic update
            setStores((prev) =>
                prev.map((s) =>
                    s._id === storeId ? { ...s, status: newStatus } : s,
                ),
            );
            setLoadingIds((prev) => new Set(prev).add(storeId));

            try {
                await updateStoreStatus(storeId, newStatus);
            } catch (err) {
                // 2. rollback on failure
                setStores(data?.stores ?? []);
                console.error(err.message);
            } finally {
                setLoadingIds((prev) => {
                    const ids = new Set(prev);
                    ids.delete(storeId);
                    return ids;
                });
            }
        },
        [data],
    );

    return {
        stores,
        loading,
        error,
        approveStore: (id) => updateStatus(id, "APPROVED"),
        rejectStore: (id) => updateStatus(id, "REJECTED"),
        isLoading: (id) => loadingIds.has(id),
    };
};

export default useStores;
