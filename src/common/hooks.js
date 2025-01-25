import { useEffect, useState, useCallback } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useContext } from "react";
import { SessionContext } from "./contexts";

const useUppyWithSupabase = ({ uppyOptions }) => {
  // Initialize Uppy instance only once

  const { session } = useContext(SessionContext);
  const [uppy] = useState(() => new Uppy(uppyOptions));

  useEffect(() => {
    const initializeUppy = async () => {
      uppy.use(Tus, {
        endpoint: `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/upload/resumable`, // Supabase TUS endpoint
        retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
        headers: {
          authorization: `Bearer ${session?.access_token}`, // User session access token
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, // API key for Supabase
        },
        uploadDataDuringCreation: true, // Send metadata with file chunks
        removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
        chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
        allowedMetaFields: [
          "bucketName",
          "objectName",
          "contentType",
          "cacheControl",
        ], // Metadata fields allowed for the upload
        onError: (error) => console.error("Upload error:", error), // Error handling for uploads
      });
    };

    // Initialize Uppy with Supabase settings
    initializeUppy();
  }, []);

  // Return the configured Uppy instance
  return uppy;
};

const useElementIntersection = (threshold = 1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [elementNode, setElementNode] = useState(null);
  const [observer, setObserver] = useState(null);

  let elementNodeTimer;
  const elementRef = useCallback((node) => {
    if (node && node !== elementNode) {
      clearTimeout(elementNodeTimer);
      elementNodeTimer = setTimeout(() => {
        setElementNode(node);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsIntersecting(entry);
        });
      },
      { threshold },
    );

    setObserver(intersectionObserver);
  }, []);

  useEffect(() => {
    if (!observer || !elementNode) return;

    observer.observe(elementNode);

    return () => {
      observer.unobserve(elementNode);
    };
  }, [elementNode]);

  return [elementRef, isIntersecting];
};

export { useUppyWithSupabase, useElementIntersection };
