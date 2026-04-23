import { fetchService } from "@/services/fetchService";
import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (endpoint, options = {}, config = {}) => {
    const { enabled = true } = config;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);
    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const execute = useCallback(async () => {
        if (!endpoint || !enabled) {
            return null;
        }

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchService({
                endpoint,
                signal: controller.signal,
                ...optionsRef.current,
            });
            setData(result);
            return result;
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, [enabled, endpoint]);

    useEffect(() => {
        if (!enabled || !endpoint) {
            return undefined;
        }

        execute().catch(() => {});
        return () => abortRef.current?.abort();
    }, [enabled, endpoint, execute]);

    return { data, loading, error, reFetch: execute, execute };
};

export default useFetch;
