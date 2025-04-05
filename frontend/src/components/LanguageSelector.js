import React from 'react';

function LanguageSelector({ languages, selectedLanguage, onLanguageChange }) {
  return (
    <div className="language-selector">
      <h3>Select Language</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className={selectedLanguage === lang.code ? 'active' : ''}
              onClick={() => onLanguageChange(lang.code)}
            >
              {lang.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LanguageSelector;
