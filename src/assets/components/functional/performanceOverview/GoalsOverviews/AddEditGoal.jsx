import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEditGoal = ({ show, onClose, onSubmit, initialData = null }) => {
  const [goalName, setGoalName] = useState(initialData?.goalName || "");
  const [dataLevel, setDataLevel] = useState(initialData?.dataLevel || "");
  const [dataValue, setDataValue] = useState(initialData?.dataValue || "");
  const [metric, setMetric] = useState(initialData?.metric || "");
  const [metricCondition, setMetricCondition] = useState("Equals");
  const [metricValue, setMetricValue] = useState(initialData?.metricValue || "");
  const [conditions, setConditions] = useState([
    { condition: "", conditionValue: "" },
  ]);
  const [timePeriod, setTimePeriod] = useState(initialData?.timePeriod || "");
  const [priority, setPriority] = useState(initialData?.priority || "");

  const handleAddCondition = () => {
    setConditions([...conditions, { condition: "", conditionValue: "" }]);
  };

  const handleConditionChange = (index, field, value) => {
    const updated = [...conditions];
    updated[index][field] = value;
    setConditions(updated);
  };

  const handleSubmit = () => {
    const formData = {
      goalName,
      dataLevel,
      dataValue,
      metric,
      metricCondition,
      metricValue,
      conditions,
      timePeriod,
      priority,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Goal" : "Add Goal"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Goal Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter goal name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex gap-3">
            <Form.Group className="flex-fill">
              <Form.Label>Data Level *</Form.Label>
              <Form.Select
                value={dataLevel}
                onChange={(e) => setDataLevel(e.target.value)}
              >
                <option value="">Select data level</option>
                <option>Campaign</option>
                <option>Ad Group</option>
                <option>Keyword</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Data Value *</Form.Label>
              <Form.Select
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
              >
                <option value="">Select data value</option>
                <option>All</option>
                <option>Specific</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="d-flex gap-3 mt-3">
            <Form.Group className="flex-fill">
              <Form.Label>Metric *</Form.Label>
              <Form.Select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
              >
                <option value="">Select metric</option>
                <option>ROAS</option>
                <option>Spends</option>
                <option>Clicks</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Metric Value *</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  value={metricCondition}
                  onChange={(e) => setMetricCondition(e.target.value)}
                  style={{ width: "40%" }}
                >
                  <option>Equals</option>
                  <option>Greater Than</option>
                  <option>Less Than</option>
                </Form.Select>
                <Form.Control
                  type="text"
                  placeholder="Enter metric value"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                />
              </div>
            </Form.Group>
          </div>

          {conditions.map((cond, index) => (
            <div className="d-flex gap-3 mt-3" key={index}>
              <Form.Group className="flex-fill">
                <Form.Label>Condition - {index + 1}</Form.Label>
                <Form.Select
                  value={cond.condition}
                  onChange={(e) =>
                    handleConditionChange(index, "condition", e.target.value)
                  }
                >
                  <option value="">Select condition</option>
                  <option>CTR</option>
                  <option>Conversion Rate</option>
                  <option>CPA</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="flex-fill">
                <Form.Label>Condition Value - {index + 1}</Form.Label>
                <Form.Select
                  value={cond.conditionValue}
                  onChange={(e) =>
                    handleConditionChange(index, "conditionValue", e.target.value)
                  }
                >
                  <option value="">Select condition value</option>
                  <option>Greater Than</option>
                  <option>Less Than</option>
                  <option>Equals</option>
                </Form.Select>
              </Form.Group>
            </div>
          ))}

          <Button
            variant="outline-primary"
            size="sm"
            className="mt-3"
            onClick={handleAddCondition}
          >
            Add Condition
          </Button>

          <Form.Group className="mt-3">
            <Form.Label>Time Period *</Form.Label>
            <Form.Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option value="">Select time period</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Priority *</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                label="Low"
                name="priority"
                value="Low"
                checked={priority === "Low"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Medium"
                name="priority"
                value="Medium"
                checked={priority === "Medium"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="High"
                name="priority"
                value="High"
                checked={priority === "High"}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditGoal;