import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import Tus from '@uppy/tus';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SessionContext } from './contexts';

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
          'width',
          'height',
          'bucketName',
          'objectName',
          'contentType',
          'cacheControl',
        ], // Metadata fields allowed for the upload
      });
    };

    // Initialize Uppy with Supabase settings
    initializeUppy();
  }, []);

  // Return the configured Uppy instance
  return uppy;
};

const useElementIntersection = (threshold = 0.1) => {
  const [intersectingElement, setIntersectingElement] = useState(null);
  const [elementNode, setElementNode] = useState(null);
  const [observer, setObserver] = useState(null);
  const elementNodeTimerRef = useRef();

  const elementRef = useCallback((node) => {
    if (node && node !== elementNode) {
      clearTimeout(elementNodeTimerRef.current);
      elementNodeTimerRef.current = setTimeout(() => {
        setElementNode(node);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIntersectingElement(entry);
          } else {
            setIntersectingElement(null);
          }
        });
      },
      { threshold }
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

  return [elementRef, intersectingElement];
};

export { useElementIntersection, useUppyWithSupabase };
