import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

interface PieChartDrawProps {}

export const PieChartDraw: React.FC<PieChartDrawProps> = ({}) => {
  const data = [
    { title: "One", value: 10, color: "#E38627" },
    { title: "Two", value: 15, color: "#C13C37" },
    { title: "Three", value: 20, color: "#6A2135" },
]
    return (
        <>
            <PieChart
                data={data}
                
            />
            
        </>
    );
};
