import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import 'swiper/swiper-bundle.css';
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper'
import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
    return (
      <>
        {Courses?.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            modules={[FreeMode, Pagination]}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
            }}
            className="max-h-[30rem]"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <Course_Card course={course} Height={"h-[215px]"} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )}
      </>
    )
  }
  
  export default CourseSlider
  