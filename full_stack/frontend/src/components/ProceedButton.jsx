function ProceedButton({ selectedPlan, onProceed }) {
  return (
    <button
      type="button"
      className="proceed-button"
      disabled={!selectedPlan}
      aria-disabled={!selectedPlan}
      onClick={onProceed}
    >
      Proceed
    </button>
  );
}

export default ProceedButton;
