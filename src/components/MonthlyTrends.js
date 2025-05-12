import React from 'react';
import Chart from 'react-apexcharts';
import { COLORS } from '../utils/constants';

const MonthlyTrends = ({ monthlyStats, loading, trendType = 'month-on-month', onTrendTypeChange }) => {
  // Prepare data for ApexCharts
  const prepareChartData = () => {
    if (!monthlyStats || monthlyStats.length === 0) return null;
    console.log('monthlyStats', monthlyStats);
    const categories = monthlyStats.map(item => item.date);
    
    const series = [
      {
        name: 'Assigned',
        data: monthlyStats.map(item => item.pending)
      },
      // {
      //   name: 'In-Process',
      //   data: monthlyStats.map(item => item.inProcess)
      // },
      {
        name: 'Completed',
        data: monthlyStats.map(item => item.completed)
      }
    ];
    
    return { categories, series };
  };
  
  const chartData = prepareChartData();
  
  const options = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: chartData?.categories || []
    },
    colors: [
      COLORS.SECONDARY.DEFAULT, // for Assigned
      COLORS.WARNING.DEFAULT,   // for In-Process
      COLORS.SUCCESS.DEFAULT    // for Completed
    ],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    }
  };

  const getTrendTypeLabel = (type) => {
    const labels = {
      'day-on-day': 'Daily',
      'week-on-week': 'Weekly',
      'month-on-month': 'Monthly',
      'year-on-year': 'Yearly'
    };
    return labels[type] || 'Monthly';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{getTrendTypeLabel(trendType)} Assessment Trends</h3>
          <div className="flex space-x-2">
            <select
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={trendType}
              onChange={(e) => onTrendTypeChange(e.target.value)}
              disabled={loading}
            >
              <option value="day-on-day">Daily Trends</option>
              <option value="week-on-week">Weekly Trends</option>
              <option value="month-on-month">Monthly Trends</option>
              <option value="year-on-year">Yearly Trends</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div className="h-64">
            {chartData ? (
              <Chart
                options={options}
                series={chartData.series}
                type="area"
                height="100%"
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTrends; 