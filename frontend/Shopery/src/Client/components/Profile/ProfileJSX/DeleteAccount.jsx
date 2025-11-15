// Client/components/Profile/ProfileJSX/DeleteAccount.jsx
import React from "react";
import "../ProfileCSS/DeleteAccount.css";

const DeleteAccount = () => {
  const handleSendEmail = () => {
    // Handle send email logic
    console.log("Send deletion confirmation email");
  };

  return (
    <div className="delete-account">
      <div className="delete-account__card">
        <h2 className="delete-account__title">Close Account</h2>

        <p className="delete-account__greeting">
          Christine, we're sorry to see you go
        </p>

        <div className="delete-account__content">
          <ul className="delete-account__list">
            <li className="delete-account__list-item">
              If you're leaving because you're receiving too many emails from
              us, you can{" "}
              <a href="#" className="delete-account__link">
                change your settings
              </a>
              .
            </li>
            <li className="delete-account__list-item">
              Deleting your account will remove all access to your courses,
              programs and degrees. This includes your progress on current
              courses, any comments you have made, and any digital statements
              you have bought.
            </li>
            <li className="delete-account__list-item">
              Deleting your account cannot be undone. There is no way to restore
              your account.
            </li>
          </ul>

          <div className="delete-account__warning">
            <p className="delete-account__warning-text">
              You'll need to confirm your account deletion request. Please click
              the button below to request an account deletion confirmation
              email. It will be sent to: <strong>textxyz@gmail.com</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="delete-account__btn"
          onClick={handleSendEmail}
        >
          Send me email
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
