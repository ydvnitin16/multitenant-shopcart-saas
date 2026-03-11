import { useEffect, useState } from "react";
import { getAddresses } from "../services/address";

export const useAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            const data = await getAddresses();
            setAddresses(data.addresses);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return { addresses, loading, refetch: fetchAddresses };
};
