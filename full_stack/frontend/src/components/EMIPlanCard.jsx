function formatCurrency(amount) {
  const numericAmount = Number(amount || 0);
  return `₹${numericAmount.toLocaleString("en-IN")}`;
}

function EMIPlanCard({ plan, selected, onSelect }) {
  const hasCashback = Number(plan.cashback) > 0;

  return (
    <article className={`emi-plan-card ${selected ? "selected" : ""}`}>
      <button type="button" className="emi-radio-row" onClick={onSelect} aria-pressed={selected}>
        <span className="emi-radio" aria-hidden="true" />

        <span className="emi-plan-copy">
          <strong>{formatCurrency(plan.monthly_payment)}</strong>
          <span>x {plan.tenure} months</span>
        </span>

        {hasCashback ? (
          <span className="emi-side-copy">
            <small>{Number(plan.interest_rate || 0)}% INTEREST</small>
            <b>{formatCurrency(plan.cashback)} CASHBACK</b>
          </span>
        ) : (
          <span className="emi-badge">*0%EMI</span>
        )}

        <span className="emi-select-button">{selected ? "Selected" : "Select"}</span>
      </button>
    </article>
  );
}

export default EMIPlanCard;
