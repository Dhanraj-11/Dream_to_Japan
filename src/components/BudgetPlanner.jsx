"use client";

import { useMemo, useState, memo } from "react";

const initialBudget = {
  flight: "",
  hotel: "",
  food: "",
  transport: "",
  shopping: "",
};

export default memo(function BudgetPlanner({ className = "" }) {
  const [budget, setBudget] = useState(initialBudget);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setBudget((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    const cleanedValue = value.replace(/\D/g, "");
    setBudget((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const total = useMemo(() => {
    return (
      Number(budget.flight || 0) +
      Number(budget.hotel || 0) +
      Number(budget.food || 0) +
      Number(budget.transport || 0) +
      Number(budget.shopping || 0)
    );
  }, [budget]);

  const resetBudget = () => setBudget(initialBudget);

  const fillSampleBudget = () => {
    setBudget({
      flight: "45000",
      hotel: "30000",
      food: "15000",
      transport: "10000",
      shopping: "12000",
    });
  };

  const formatINR = (amount) => new Intl.NumberFormat("en-IN").format(amount);

  return (
    <section className={`section section-alt ${className}`} id="budget">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">06 • Budget Planner</p>
          <h2>My Japan Trip Budget Planner</h2>
          <p className="muted center-text">
            Type any amount you want. Empty fields are treated as ₹0.
          </p>
        </div>

        <div className="budget-box animate-slide-in">
          <div className="budget-grid">
            <div className="input-group">
              <label htmlFor="flight">Flight Cost (₹)</label>
              <input
                id="flight"
                type="text"
                inputMode="numeric"
                name="flight"
                placeholder="e.g. 45000"
                value={budget.flight}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="hotel">Hotel / Stay (₹)</label>
              <input
                id="hotel"
                type="text"
                inputMode="numeric"
                name="hotel"
                placeholder="e.g. 30000"
                value={budget.hotel}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="food">Food (₹)</label>
              <input
                id="food"
                type="text"
                inputMode="numeric"
                name="food"
                placeholder="e.g. 15000"
                value={budget.food}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="transport">Local Transport (₹)</label>
              <input
                id="transport"
                type="text"
                inputMode="numeric"
                name="transport"
                placeholder="e.g. 10000"
                value={budget.transport}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="shopping">Shopping / Extra (₹)</label>
              <input
                id="shopping"
                type="text"
                inputMode="numeric"
                name="shopping"
                placeholder="e.g. 12000"
                value={budget.shopping}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="budget-actions">
            <button type="button" className="btn btn-primary" onClick={fillSampleBudget}>
              Fill Sample Budget
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetBudget}>
              Reset
            </button>
          </div>

          <div className="budget-total animate-fade">
            <h3>Total Estimated Budget</h3>
            <p>₹ {formatINR(total)}</p>
          </div>
        </div>
      </div>
    </section>
  );
});