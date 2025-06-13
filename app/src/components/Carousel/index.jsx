import { Image } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
const defaultItems = [
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/a9/b0/7f/3955b62b2c8f715529bf6b5198ebb791.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/ed/9c/ca/7ca6c89a01008c61738e931870b2fa95.jpg.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/3d/c1/52/3bae4f86c28241d3fbceb091011e2286.jpg.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/2d/7e/af/52984eb6170f122896bdc641694390f3.jpg.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/56/80/88/742d50198d1fcd9a0573783376b857e4.jpg.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/a9/b0/7f/3955b62b2c8f715529bf6b5198ebb791.png.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/f3/b8/2c/89543f27a747f4afead6766fa680c7b5.jpg.webp",
  "https://salt.tikicdn.com/cache/w750/ts/tikimsp/3d/c1/52/3bae4f86c28241d3fbceb091011e2286.jpg.webp",
];
const Carousel = ({
  items = defaultItems,
  cols = 2,
  rows = 1,
  autoSlide = true,
}) => {
  const paginateItems = (items, rows, cols) => {
    const pageSize = rows * cols;
    const pages = [];

    for (let i = 0; i < items.length; i += pageSize) {
      const page = items.slice(i, i + pageSize); // Lấy các phần tử cho một trang
      pages.push(page);
    }

    return pages;
  };

  const pages = paginateItems(items, rows, cols);

  const [transition, setTransition] = useState(0);
  const totalSlides = pages.length - 1;
  const [width, setWidth] = useState(1106);
  const ref = useRef(null);
  const timerRef = useRef(null);
  const setSlideInterval = () => {
    clearInterval(timerRef.current);
    if (autoSlide) {
      timerRef.current = setInterval(() => {
        setTransition((prev) => (prev + 1) % (totalSlides + 1));
      }, 3000);
    }
  };

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
    if (autoSlide) setSlideInterval();
    return () => {
      clearInterval(timerRef.current);
    };
  }, [totalSlides]);

  const handlePrev = () => {
    if (transition === 0) setTransition(3);
    else setTransition((prev) => prev - 1);

    setSlideInterval();
  };

  const handleNext = () => {
    if (transition + 1 > totalSlides) setTransition(0);
    else setTransition((prev) => prev + 1);
    setSlideInterval();
  };
  return (
    <div className="flex flex-col items-start align-self-stretch gap-3 p-4 rounded-lg bg-white">
      <div className="w-full relative group banner-carousel" ref={ref}>
        <span
          className="left hidden absolute top-[calc(50%-5px)] items-center justify-center shadow rounded-[16px] cursor-pointer bg-white p-1.5 left-2 z-10 group-hover:flex"
          onClick={handlePrev}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.0899 14.5899C11.7645 14.9153 11.2368 14.9153 10.9114 14.5899L5.91139 9.58991C5.58596 9.26447 5.58596 8.73683 5.91139 8.4114L10.9114 3.41139C11.2368 3.08596 11.7645 3.08596 12.0899 3.41139C12.4153 3.73683 12.4153 4.26447 12.0899 4.58991L7.67916 9.00065L12.0899 13.4114C12.4153 13.7368 12.4153 14.2645 12.0899 14.5899Z"
              fill="#0A68FF"
            ></path>
          </svg>
        </span>
        <div className="content overflow-hidden">
          <span
            className={`slide inline-flex min-w-full duration-500 ease-in-out`}
            style={{
              transform: `translateX(-${transition * width}px)`,
            }}
          >
            {pages.map((page, i) => (
              <div
                key={i}
                className={`block`}
                style={{
                  width: width + "px",
                }}
              >
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(calc(${
                      100 / cols
                    }% - 12px), 1fr))`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                  }}
                >
                  {page.map((item, j) => {
                    if (typeof item === "string") {
                      return (
                        <div key={`${i}-${j}`}>
                          <span className="rounded-xl border bg-transparent overflow-hidden flex">
                            <Image
                              preview={false}
                              className="w-full h-full opacity-100"
                              src={item}
                            />
                          </span>
                        </div>
                      );
                    } else {
                      return <Fragment key={`${i}-${j}`}>{item}</Fragment>;
                    }
                  })}
                </div>
              </div>
            ))}
          </span>
        </div>
        <span
          className="right hidden absolute top-[calc(50%-5px)] items-center justify-center shadow rounded-[16px] cursor-pointer bg-white p-1.5 right-2 z-10 group-hover:flex"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              fillOpacity="evenodd"
              clipRule="evenodd"
              d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
              fill="#0A68FF"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Carousel;
