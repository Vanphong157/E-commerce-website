"use client";
import { Carousel, Col, Row } from "antd";
import React from "react";
import Banner from "./Banner";
import Category from "./Category";
import ListProduct from "./ListProduct";

const HomepageComponent = () => {

  return (
    <>
      <Banner />
      <Category />
      <ListProduct />
    </>
  );
};

export default HomepageComponent;
