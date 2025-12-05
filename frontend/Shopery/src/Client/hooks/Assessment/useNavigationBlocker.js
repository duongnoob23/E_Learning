import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useNavigationBlocker = (when, message, onConfirm) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);
  const originalNavigateRef = useRef(navigate);

  // Tạo custom navigate function
  const customNavigate = useCallback(
    (...args) => {
      if (!when) {
        originalNavigateRef.current(...args);
        return;
      }

      const confirmLeave = window.confirm(message);
      if (confirmLeave) {
        if (onConfirm) {
          onConfirm();
        }
        isNavigatingRef.current = true;
        originalNavigateRef.current(...args);
      }
      // Nếu người dùng hủy, không navigate
    },
    [when, message, onConfirm]
  );

  useEffect(() => {
    if (!when) return;

    // Xử lý beforeunload (F5, đóng tab, đóng browser)
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    // Xử lý popstate (back/forward button)
    const handlePopState = (event) => {
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
      }

      const confirmLeave = window.confirm(message);
      if (confirmLeave) {
        if (onConfirm) {
          onConfirm();
        }
        isNavigatingRef.current = true;
      } else {
        // Ngăn navigation bằng cách push lại state hiện tại
        window.history.pushState(null, "", location.pathname + location.search);
      }
    };

    // Intercept tất cả click events trên links
    const handleLinkClick = (event) => {
      const target = event.target.closest("a[href]");
      if (target && target.href && !target.href.startsWith("#")) {
        event.preventDefault();
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          if (onConfirm) {
            onConfirm();
          }
          isNavigatingRef.current = true;
          window.location.href = target.href;
        }
      }
    };

    // Lắng nghe sự kiện beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Lắng nghe sự kiện popstate
    window.addEventListener("popstate", handlePopState);

    // Lắng nghe click events trên links
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [when, message, onConfirm, location]);

  return { customNavigate };
};
