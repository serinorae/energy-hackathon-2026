export default function SummaryCards() {
  return (
    <section className="summary-cards">
      <div className="summary-card">
        <p>Neighbourhoods at Critical Risk</p>
        <strong className="red">4</strong>
        <span>of 10</span>
      </div>

      <div className="summary-card">
        <p>People at High Risk</p>
        <strong className="orange">412,000</strong>
        <span>32% of Toronto population</span>
      </div>

      <div className="summary-card">
        <p>Cooling Centres Available</p>
        <strong className="green">23</strong>
        <span>of 38</span>
      </div>

      <div className="summary-card">
        <p>Centres at Capacity &gt; 80%</p>
        <strong className="red">7</strong>
        <span>require attention</span>
      </div>
    </section>
  );
}
