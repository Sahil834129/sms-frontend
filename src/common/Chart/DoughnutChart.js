import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const radius = 80;

const image = new Image();
image.src = "/invoice.png";

const styling = { height: 215, maxWidth: 230 };

const option = {
  animation: false,
  responsive: true,
  aspectRatio: 0,
  maintainAspectRatio: false,
  layout: {
    padding: 0,
    margin: 0
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
  }
};

export default function DoughnutChart({ data, midNumberText, midTextFirst, midTextSecond, totalRemainng, totalRemainngData, projectedFee }) {
  return (
    <Doughnut
      data={{ ...data }}
      redraw={true}
      plugins={[{
        beforeDraw: function (chart) {
          var ctx = chart.ctx;
          ctx.restore();
          ctx.textBaseline = "top";
          ctx.font = '600 14px Rubik';
          ctx.fillText(midNumberText, radius + 20, radius + 20);
          ctx.font = '400 14px Rubik';
          ctx.fillstyle = '#00000066';
          ctx.fillText(midTextFirst, radius, radius + 40);
          ctx.fillText(midTextSecond, radius + 20, radius + 60);
          { totalRemainngData.match("₹") ? ctx.fillText(totalRemainngData, radius + 6, radius + 110) : ctx.fillText(totalRemainngData, radius + 20, radius + 110); }

          { totalRemainng === "Remaining Seats" ? ctx.fillText(totalRemainng, radius - 100, radius) : ctx.fillText(totalRemainng, radius - 50, radius + 125); }
          ctx.font = '500 18px Rubik';
          ctx.fillText('50', 100, 265);
          ctx.save();
          if (image.complete) {
            ctx.drawImage(image, 105, 67);
          } else {
            // image.onload = () => ctx.draw();
          }
        }
      }
      ]}
      style={styling}
      options={option}
    />);
}
