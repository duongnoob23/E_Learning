import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Hook để ngăn người dùng rời khỏi trang thi khi chưa nộp bài
 * Xử lý tất cả các trường hợp: F5, đóng tab, navigation trong app, back/forward button
 */
export const useExamLeaveBlocker = (when, message, onConfirm) => {
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

    // Intercept tất cả click events trên links và buttons có navigation
    const handleClick = (event) => {
      const target = event.target.closest("a[href], button[data-navigate]");

      if (target) {
        // Kiểm tra nếu là link external hoặc anchor
        if (target.tagName === "A") {
          const href = target.getAttribute("href");
          if (
            href &&
            !href.startsWith("#") &&
            !href.startsWith("javascript:")
          ) {
            event.preventDefault();
            const confirmLeave = window.confirm(message);
            if (confirmLeave) {
              if (onConfirm) {
                onConfirm();
              }
              isNavigatingRef.current = true;
              // Sử dụng navigate thay vì window.location để giữ SPA behavior
              if (href.startsWith("/")) {
                navigate(href);
              } else {
                window.location.href = href;
              }
            }
          }
        }

        // Kiểm tra nếu là button có data-navigate
        if (target.tagName === "BUTTON" && target.dataset.navigate) {
          event.preventDefault();
          const confirmLeave = window.confirm(message);
          if (confirmLeave) {
            if (onConfirm) {
              onConfirm();
            }
            isNavigatingRef.current = true;
            navigate(target.dataset.navigate);
          }
        }
      }
    };

    // Lắng nghe sự kiện beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Lắng nghe sự kiện popstate
    window.addEventListener("popstate", handlePopState);

    // Lắng nghe click events
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
    };
  }, [when, message, onConfirm, location, navigate]);

  return { customNavigate };
};
