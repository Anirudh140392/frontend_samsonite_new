import React, { useState } from "react";
import { Card, Button, Dropdown, Spinner } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FiRefreshCw } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../../assets/styles/goals/goalService.less";
import AdvancedDataTable from "../../../common/AdvancedDataTable";
import AddEditGoal from "./AddEditGoal";

ChartJS.register(ArcElement, Tooltip, Legend);

const initialRows = [
  {
    id: 1,
    goalName: "Hair Color Spends",
    metricUnit: "Spends",
    target: "5,00,000",
    achievement: "4,80,000",
    percent: "96%",
    status: "Not Achieved",
  },
  {
    id: 2,
    goalName: "Hair Color ROAS",
    metricUnit: "ROAS",
    target: "3",
    achievement: "3.2",
    percent: "106%",
    status: "Achieved",
  },
  {
    id: 3,
    goalName: "Account Spends",
    metricUnit: "Spends",
    target: "10,00,000",
    achievement: "9,50,000",
    percent: "95%",
    status: "Not Achieved",
  },
  {
    id: 4,
    goalName: "Face Wash Goals",
    metricUnit: "Spends",
    target: "3,00,000",
    achievement: "3,20,000",
    percent: "107%",
    status: "Achieved",
  },
  {
    id: 5,
    goalName: "Face Wash ROAS",
    metricUnit: "ROAS",
    target: "4",
    achievement: "2.5",
    percent: "62%",
    status: "Not Achieved",
  },
];

const GoalsOverview = () => {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const filteredRows = rows.filter((row) => {
    if (filter === "Active")
      return row.status === "Achieved" || row.status === "Not Achieved";
    return row.status === filter;
  });

  const chartData = {
    labels: ["Achieved", "Not Achieved"],
    datasets: [
      {
        data: [
          filteredRows.filter((r) => r.status === "Achieved").length,
          filteredRows.filter((r) => r.status === "Not Achieved").length,
        ],
        backgroundColor: ["#28a745", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, padding: 10 },
      },
    },
  };

  const columns = [
    { field: "goalName", headerName: "GOAL NAME", flex: 1 },
    { field: "metricUnit", headerName: "METRIC UNIT", flex: 1 },
    { field: "target", headerName: "TARGET", flex: 1 },
    { field: "achievement", headerName: "ACHIEVEMENT", flex: 1 },
    { field: "percent", headerName: "% ACHIEVEMENT", flex: 1 },
    {
      field: "status",
      headerName: "GOAL STATUS",
      flex: 1,
      renderCell: (params) => (
        <span
          className={
            params.value === "Achieved" ? "status-achieved" : "status-not"
          }
        >
          {params.value}
        </span>
      ),
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setFilter("Active");
    setTimeout(() => {
      setRows([...initialRows]);
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const exportData = filteredRows.map(
      ({ goalName, metricUnit, target, achievement, percent, status }) => ({
        "GOAL NAME": goalName,
        "METRIC UNIT": metricUnit,
        TARGET: target,
        ACHIEVEMENT: achievement,
        "% ACHIEVEMENT": percent,
        "GOAL STATUS": status,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Goals");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "goals_overview.xlsx");
  };

  return (
    <Card className="goals-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 goals-header flex-wrap">
        <h5>Goals Overview</h5>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <Dropdown>
            <Dropdown.Toggle variant="light" className="dropdown-btn">
              {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {["Active", "Achieved", "Not Achieved"].map((status) => (
                <Dropdown.Item key={status} onClick={() => setFilter(status)}>
                  {status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="light" onClick={handleRefresh}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FiRefreshCw />
            )}
          </Button>

          {/* <Button variant="primary" onClick={() => setShowAddGoal(true)}>
            Add Goal
          </Button> */}
          <Button variant="primary" >
            Add Goal
          </Button>

          <AddEditGoal
            show={showAddGoal}
            onClose={() => setShowAddGoal(false)}
            onSubmit={(data) => console.log("Goal Submitted:", data)}
          />

          <Button
            variant="dark"
            onClick={handleExport}
            style={{
              backgroundColor: "black",
              borderColor: "black",
            }}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-4 goals-content">
        <div
          className="chart-section"
          style={{
            flex: "1 1 250px",
            minWidth: 250,
            maxWidth: 400,
            height: 250,
            position: "relative",
          }}
        >
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        <div className="table-section flex-grow-1" style={{ minWidth: 300 }}>
          <AdvancedDataTable
            columns={columns}
            rows={filteredRows}
            loading={loading}
            hideFooter={true}
            showExportButton={false}
            dynamicHeight={filteredRows.length > 5 ? 330 : "auto"}
          />
        </div>
      </div>
    </Card>
  );
};

export default GoalsOverview;
