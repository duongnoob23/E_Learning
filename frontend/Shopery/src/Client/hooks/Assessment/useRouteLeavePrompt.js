import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useRouteLeavePrompt = (when, message, onConfirm) => {
  const location = useLocation();
  const isNavigatingRef = useRef(false);

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

    // Lắng nghe sự kiện beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Lắng nghe sự kiện popstate
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [when, message, onConfirm, location]);

  // Trả về function để đánh dấu navigation được phép
  const allowNavigation = () => {
    isNavigatingRef.current = true;
  };

  return { allowNavigation };
};
