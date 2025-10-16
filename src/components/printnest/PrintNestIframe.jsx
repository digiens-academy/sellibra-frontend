import { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { printnestApi } from "../../api/printnestApi";
import useAuthStore from "../../store/authStore";
import { PRINTNEST_URL } from "../../utils/constants";

const PrintNestIframe = () => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const { user } = useAuthStore();
  const iframeRef = useRef(null);

  // Track iframe open (silent tracking for admin analytics)
  useEffect(() => {
    const trackOpen = async () => {
      try {
        const response = await printnestApi.trackOpen(window.location.pathname);
        setSessionId(response.data.sessionId);
        setStartTime(Date.now());
      } catch (error) {
        console.error("Track open error:", error);
        // Continue loading iframe even if tracking fails
        setSessionId('fallback-' + Date.now());
      }
    };

    trackOpen();

    // Cleanup on unmount
    return () => {
      if (sessionId && startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        printnestApi.trackClose(sessionId, timeSpent).catch((error) => {
          console.error("Track close error:", error);
        });
      }
    };
  }, []);

  // Track interactions (window blur event - silent for admin analytics)
  useEffect(() => {
    const handleWindowBlur = () => {
      if (sessionId) {
        printnestApi.trackInteraction(sessionId).catch((error) => {
          console.error("Track interaction error:", error);
        });
      }
    };

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [sessionId]);

  // iframe load handler
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Build iframe URL with parameters
  const iframeUrl = `${PRINTNEST_URL}?ref=digiens&uid=${
    user?.id
  }&sid=${sessionId}&t=${Date.now()}`;

  return (
    <div className="printnest-container">
      <div className="iframe-container">
        {loading && (
          <div className="iframe-loading">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">PrintNest yükleniyor...</p>
          </div>
        )}

        {sessionId && (
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            title="PrintNest"
            onLoad={handleIframeLoad}
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  );
};

export default PrintNestIframe;
