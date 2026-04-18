import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Field } from "../types";

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = async () => {
    try {
      const response = await api.get<Field[]>('fields/');
      setFields(response.data);
    } catch (err) {
      setError('Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return { fields, loading, refresh: fetchFields };
};