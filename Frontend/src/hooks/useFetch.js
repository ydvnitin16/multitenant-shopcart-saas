import { fetchService } from "@/services/fetchService";
import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (endpoint, options) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const abortRef = useRef(null);

    const execute = useCallback(async () => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchService({
                endpoint,
                signal: controller.signal,
                ...options,
            });
            setData(result);
            return result;
        } catch (err) {
            if (err.name !== "AbortError") setError(err);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        execute();
        return () => abortRef.current?.abort();
    }, [execute]);

    return { data, loading, error, reFetch: execute, execute };
};

export default useFetch;
