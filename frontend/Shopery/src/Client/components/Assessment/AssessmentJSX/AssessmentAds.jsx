import React from "react";
import "../AssessmentCSS/AssessmentAds.css";

const ads = [
  {
    id: 1,
    img: "https://dummyimage.com/300x120/1677ff/ffffff&text=IELTS+Course",
    link: "#",
  },
  {
    id: 2,
    img: "https://dummyimage.com/300x120/ff8c00/ffffff&text=TOEIC+Calculator",
    link: "#",
  },
  {
    id: 3,
    img: "https://dummyimage.com/300x120/28a745/ffffff&text=Study4+Extension",
    link: "#",
  },
];

const AssessmentAds = () => {
  return (
    <div className="assessment-ads">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          className="assessment-ads__item"
          target="_blank"
          rel="noreferrer"
        >
          <img src={ad.img} alt="Ad banner" className="assessment-ads__img" />
        </a>
      ))}
    </div>
  );
};

export default AssessmentAds;
