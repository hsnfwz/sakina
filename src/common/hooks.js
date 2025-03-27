import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './context/AuthContextProvider';

const useUppyWithSupabase = ({ uppyOptions }) => {
  const { authSession } = useContext(AuthContext);
  const [uppy] = useState(() => new Uppy(uppyOptions));

  useEffect(() => {
    const initializeUppy = async () => {
      uppy.use(Tus, {
        endpoint: `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${authSession?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
        allowedMetaFields: [
          'bucketName',
          'objectName',
          'contentType',
          'cacheControl',
        ],
      });
    };

    if (authSession) {
      initializeUppy();
    }
  }, [authSession]);

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
