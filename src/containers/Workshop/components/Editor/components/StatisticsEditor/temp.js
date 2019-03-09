import React from 'react';

{/* Rendered statistics */}
<div className="form__form-group">
  <div className="form__form-group-field">
    {statistics.map(statistic => (
      <div className="mr-3" key={statistic.id}>
        <h4>
          <i className={`fal fa-fw fa-${statistic.icon} mr-2`} />
          {statistic.name}: {statistic.value}
        </h4>
      </div>
    ))}
  </div>
</div>

{/* Error message */ }
<div className="form__form-group">
  <div className="form__form-group-field">
    {error}
  </div>
</div>
</div>
