import EMIPlanCard from "./EMIPlanCard";

function EMIPlanList({ plans, selectedPlanId, onSelect, emiStartLabel }) {
  if (!plans.length) {
    return (
      <section className="emi-plan-list">
        <h3>CHOOSE EMI TENURE</h3>
        <p className="emi-empty">No EMI plans available for this variant.</p>
      </section>
    );
  }

  return (
    <section className="emi-plan-list">
      <h3>CHOOSE EMI TENURE</h3>
      <div className="emi-plan-list__items">
        {plans.map((plan) => (
          <EMIPlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlanId === plan.id}
            onSelect={() => onSelect(plan)}
          />
        ))}
      </div>
      <p className="emi-note">{emiStartLabel}</p>
    </section>
  );
}

export default EMIPlanList;
