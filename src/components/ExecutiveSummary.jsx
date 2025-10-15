import React from 'react';

/**
 * ExecutiveSummary Component
 *
 * Displays the executive summary and business value - always visible in solution brief
 */
const ExecutiveSummary = ({ module }) => {
  if (!module) return null;

  const businessValueItems =
    module.businessValue
      ?.split(',')
      .map(item => item.trim())
      .filter(Boolean) || [];

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Executive Narrative
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          Why this module matters
        </h2>
      </header>

      {module.executiveSummary && (
        <p className="text-base text-gray-800 leading-relaxed">
          {module.executiveSummary}
        </p>
      )}

      {module.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Opportunity Landscape
          </h3>
          <p className="text-base text-gray-700 leading-relaxed">
            {module.description}
          </p>
        </div>
      )}

      {!module.executiveSummary && businessValueItems.length > 0 && (
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Expected Business Value
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {businessValueItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ExecutiveSummary;
